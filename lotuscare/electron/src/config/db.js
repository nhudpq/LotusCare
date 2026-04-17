const Database = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");

// Get the user data directory for database storage
const dbPath = path.join(app.getPath("userData"), "lotuscare.db");

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
function initializeDatabase() {
  // Create patients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ma_bn TEXT NOT NULL UNIQUE,
      ho_ten TEXT NOT NULL,
      gioi_tinh INTEGER,
      ngay_sinh TEXT,
      ma_quoc_tich TEXT,
      so_cmnd TEXT,
      ho_ten_cha TEXT,
      ho_ten_ncs TEXT,
      phone TEXT,
      father_phone TEXT,
      email TEXT,
      tinh TEXT,
      huyen TEXT,
      xa TEXT,
      dia_chi TEXT,
      tien_su_benh TEXT,
      di_ung TEXT,
      hinh_anh BLOB,
      ghi_chu TEXT,
      is_deleted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration to add is_deleted column if it doesn't exist
  try {
    const columns = db.pragma("table_info(patients)");
    const hasIsDeleted = columns.some(col => col.name === "is_deleted");
    if (!hasIsDeleted) {
      db.exec("ALTER TABLE patients ADD COLUMN is_deleted INTEGER DEFAULT 0");
    }
  } catch (err) {
    console.error("Error during migration:", err);
  }

  // Create medical_services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS medical_services (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration_minutes INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create herbal_formulas table
  db.exec(` 
    CREATE TABLE IF NOT EXISTS herbal_formulas (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(255) NOT NULL,
       code VARCHAR(100) NOT NULL UNIQUE,
       description TEXT,
       indication TEXT,
       contraindication TEXT,
       usage_instructions TEXT,
       price REAL NOT NULL,
       is_active BOOLEAN DEFAULT TRUE,
       created_at DATETIME,
       updated_at DATETIME, 
       is_deleted INTEGER DEFAULT 0
    )
  `);


  

  //  // Create herbal_formulas_item table
  // db.exec(` 
  //   CREATE TABLE IF NOT EXISTS herbal_formulas_item (
  //     id INTEGER PRIMARY KEY AUTO_INCREMENT,
  //     formula_id INT,
  //     herb_id INT,                    -- liên kết bảng dược liệu
  //     default_gram DECIMAL(6,2),      -- số gram chuẩn
  //     min_gram DECIMAL(6,2),          -- min (cho phép chỉnh)
  //     max_gram DECIMAL(6,2),          -- max
  //     unit VARCHAR(50) DEFAULT 'gram',
  //     note VARCHAR(255),              -- VD: sao vàng, sắc sau,...
  //     sort_order INT,
  //     FOREIGN KEY (formula_id) REFERENCES herbal_formulas(id)
  //   )
  // `);


  //  db.exec(` 
  //   CREATE TABLE IF NOT EXISTS herb_categories  (
  //       id INT PRIMARY KEY AUTO_INCREMENT,
  //       name VARCHAR(255) NOT NULL,        
  //       code VARCHAR(100),                  
  //       description TEXT,                  
  //       parent_id INT NULL,                
  //       is_active BOOLEAN DEFAULT TRUE,
  //       is_deleted INTEGER DEFAULT 0,
  //       created_at DATETIME,
  //       updated_at DATETIME,
  //       FOREIGN KEY (parent_id) REFERENCES herbal_categories(id)  
  //   )
  // `);

  db.exec(` 
    CREATE TABLE IF NOT EXISTS organs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      type INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(` 
    CREATE TABLE IF NOT EXISTS meridians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi VARCHAR(255) NOT NULL,    
      type INTEGER DEFAULT 0,
      organ_id INTEGER NULL,
      is_deleted INTEGER DEFAULT 0,
      created_at DATETIME,
      updated_at DATETIME,
      FOREIGN KEY (organ_id) REFERENCES organs(id)
    )
  `);

  db.exec(` 
    CREATE TABLE IF NOT EXISTS acupoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(10) NOT NULL UNIQUE,
      name_vi VARCHAR(255) NOT NULL,
      meridian_id INTEGER NOT NULL,
      location TEXT,
      indication TEXT,
      is_deleted INTEGER DEFAULT 0,
      created_at DATETIME,
      updated_at DATETIME,
      FOREIGN KEY (meridian_id) REFERENCES meridians(id)
    )
  `);


  

  // Seed organs data
  seedOrgans();
  // Seed meridians data
  seedMeridians();
  // Seed acupoints data
  seedAcupoints();
}

/**
 * Seed organs (tạng phủ) data
 */
function seedOrgans() {
  try {
    const count = db.prepare("SELECT COUNT(*) as count FROM organs").get().count;
    if (count > 0) return; // Data already exists

    const organs = [
      // Tạng (Organs)
      { name: "Tâm (Tim)", type: 0 },
      { name: "Gan", type: 0 },
      { name: "Tỳ (Lá lách)", type: 0 },
      { name: "Phổi", type: 0 },
      { name: "Thận", type: 0 },
      // Phủ (Bowels)
      { name: "Tiểu Tràng", type: 1 },
      { name: "Mật", type: 1 },
      { name: "Dạ Dày", type: 1 },
      { name: "Đại Tràng", type: 1 },
      { name: "Bàng Quang", type: 1 },
      { name: "Thủ Quyết Ấm (Thủ tâm bào)", type: 1 },
      { name: "Tam Tiêu", type: 1 },
    ];

    const stmt = db.prepare(`
      INSERT INTO organs (name, type, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `);
    const now = new Date().toISOString();

    organs.forEach(organ => {
      stmt.run(organ.name, organ.type, now, now);
    });
    console.log(`✅ Seeded ${organs.length} organs`);
  } catch (error) {
    console.error("Error seeding organs:", error);
  }
}

/**
 * Seed meridians (kinh lạc) data
 */
function seedMeridians() {
  try {
    const count = db.prepare("SELECT COUNT(*) as count FROM meridians").get().count;
    if (count > 0) return; // Data already exists

    // Get organ IDs from database
    const getOrganId = (name) => {
      const result = db.prepare("SELECT id FROM organs WHERE name = ?").get(name);
      return result ? result.id : null;
    };

    const meridians = [
      // Primary Meridians (type 0)
      { name_vi: "Kinh Thái Âm Phổi", type: 0, organ: "Phổi" },
      { name_vi: "Kinh Dương Minh Đại Tràng", type: 0, organ: "Đại Tràng" },
      { name_vi: "Kinh Dương Minh Dạ Dày", type: 0, organ: "Dạ Dày" },
      { name_vi: "Kinh Thái Âm Tỳ", type: 0, organ: "Tỳ (Lá lách)" },
      { name_vi: "Kinh Thiếu Âm Tâm", type: 0, organ: "Tâm (Tim)" },
      { name_vi: "Kinh Thái Dương Tiểu Tràng", type: 0, organ: "Tiểu Tràng" },
      { name_vi: "Kinh Thái Dương Bàng Quang", type: 0, organ: "Bàng Quang" },
      { name_vi: "Kinh Thiếu Âm Thận", type: 0, organ: "Thận" },
      { name_vi: "Kinh Quyết Âm Thủ Quyết Ấm", type: 0, organ: "Thủ Quyết Ấm (Thủ tâm bào)" },
      { name_vi: "Kinh Th少 Dương Tam Tiêu", type: 0, organ: "Tam Tiêu" },
      { name_vi: "Kinh Tấc Dương Mật", type: 0, organ: "Mật" },
      { name_vi: "Kinh Quyết Âm Gan", type: 0, organ: "Gan" },
      // Extra Meridians (type 1)
      { name_vi: "Kinh Nhâm Mạch (Conception Vessel)", type: 1, organ: null },
      { name_vi: "Kinh Độc Mạch (Governing Vessel)", type: 1, organ: null },
    ];

    const stmt = db.prepare(`
      INSERT INTO meridians (name_vi, type, organ_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();

    meridians.forEach(meridian => {
      const organId = meridian.organ ? getOrganId(meridian.organ) : null;
      stmt.run(meridian.name_vi, meridian.type, organId, now, now);
    });
    console.log(`✅ Seeded ${meridians.length} meridians`);
  } catch (error) {
    console.error("Error seeding meridians:", error);
  }
}

/**
 * Seed acupoints (huyệt) data - 100 commonly used acupoints
 */
function seedAcupoints() {
  try {
    const count = db.prepare("SELECT COUNT(*) as count FROM acupoints").get().count;
    if (count > 0) return; // Data already exists

    // Get meridian ID by name
    const getMeridianId = (name) => {
      const result = db.prepare("SELECT id FROM meridians WHERE name_vi = ?").get(name);
      return result ? result.id : null;
    };

    const acupoints = [
      // Lung Meridian (LU) - 11 points
      { code: "LU1", name_vi: "Trung Phủ", meridian: "Kinh Thái Âm Phổi", location: "Khoảng trên cỏi xương đòn, ngoài về 6cm", indication: "Ho, hen suyễn, đau ngực" },
      { code: "LU2", name_vi: "Thiên Phủ", meridian: "Kinh Thái Âm Phổi", location: "Ngoài cạnh cơ hai đầu, ngoài LU1 3cm", indication: "Ho, đau tay, thiểu cầu máu" },
      { code: "LU3", name_vi: "Thiên Chủ", meridian: "Kinh Thái Âm Phổi", location: "Sâu vào dưới xương đòn", indication: "Hen suyễn, ho" },
      { code: "LU4", name_vi: "Huyền Thiểm", meridian: "Kinh Thái Âm Phổi", location: "Tay gấp, giữa cơ hai đầu và cơ xương cẳng", indication: "Huyết áp thấp, chóng mặt" },
      { code: "LU5", name_vi: "Thích Bạch", meridian: "Kinh Thái Âm Phổi", location: "Nếp gấp khuỷu, ở bên ngoài cơ hai đầu", indication: "Ho, đau khuỷu" },
      { code: "LU6", name_vi: "Khúc Trpool", meridian: "Kinh Thái Âm Phổi", location: "Trong nếp gấp khuỷu", indication: "Ho, hen suyễn, sốt" },
      { code: "LU7", name_vi: "Liệt Xuyết", meridian: "Kinh Thái Âm Phổi", location: "Trên cạnh tay 1.5 inch từ nếp gấp cổ tay", indication: "Cảm lạnh, ho, nghẹn họng" },
      { code: "LU8", name_vi: "Kinh Quả", meridian: "Kinh Thái Âm Phổi", location: "Khoảng tay 3 inch từ nếp gấp cổ tay", indication: "Ho, chóng mặt" },
      { code: "LU9", name_vi: "Thái Uyên", meridian: "Kinh Thái Âm Phổi", location: "Nếp gấp cổ tay, bên dưới xương quill", indication: "Ho, sốt, mạch thế" },
      { code: "LU10", name_vi: "Fishpool", meridian: "Kinh Thái Âm Phổi", location: "Tâm bàn tay", indication: "Sốt cao, ho, viêm họng" },
      { code: "LU11", name_vi: "Thôi Bạch", meridian: "Kinh Thái Âm Phổi", location: "Bên ngoài ngón tay cái, ở góc móng", indication: "Sốt, ngất, ho" },

      // Large Intestine Meridian (LI) - 20 points  
      { code: "LI1", name_vi: "Thương Dương", meridian: "Kinh Dương Minh Đại Tràng", location: "Góc móng ngón tay trỏ bên ngoài", indication: "Sốt, ho, ngất" },
      { code: "LI2", name_vi: "Nhị Gian", meridian: "Kinh Dương Minh Đại Tràng", location: "Giữa hai xương tay, dạng nếp gấp", indication: "Sốt, viêm họng, kiết" },
      { code: "LI3", name_vi: "Tam Gian", meridian: "Kinh Dương Minh Đại Tràng", location: "Khoảng tay, bên ngoài xương metacarpal thứ 2", indication: "Đau tay, sốt" },
      { code: "LI4", name_vi: "Hợp Cốc", meridian: "Kinh Dương Minh Đại Tràng", location: "Giữa công ngón cái và ngón trỏ", indication: "Đau đầu, mặt mủ, sốt, mệt" },
      { code: "LI5", name_vi: "Dương Khê", meridian: "Kinh Dương Minh Đại Tràng", location: "Nếp gấp khuỷu bên ngoài", indication: "Ho, sốt, đau cánh tay" },
      { code: "LI6", name_vi: "Thích Tịch", meridian: "Kinh Dương Minh Đại Tràng", location: "Trên LI5 3 inch", indication: "Ho, sốt" },
      { code: "LI7", name_vi: "Ôn Lưu", meridian: "Kinh Dương Minh Đại Tràng", location: "Trên LI6 3 inch", indication: "Ho, chóng mặt" },
      { code: "LI8", name_vi: "Xứ Tả", meridian: "Kinh Dương Minh Đại Tràng", location: "Ở dưới LI 10 khi tay gấp", indication: "Tiêu chảy, đau bụi" },
      { code: "LI9", name_vi: "Tuyền Trủ", meridian: "Kinh Dương Minh Đại Tràng", location: "Giữa nếp gấp khuỷu và LI10", indication: "Giảm chán, buồn nôn" },
      { code: "LI10", name_vi: "Quỹ Trì", meridian: "Kinh Dương Minh Đại Tràng", location: "Nếp gấp khuỷu", indication: "Sốt cao, mệt, buồn nôn" },
      { code: "LI11", name_vi: "Ch Pond", meridian: "Kinh Dương Minh Đại Tràng", location: "Khoảng tay 3 inch trên nếp gấp khuỷu", indication: "Sốt, dị dịch" },
      { code: "LI12", name_vi: "Chu Tả", meridian: "Kinh Dương Minh Đại Tràng", location: "Trên LI11 3 inch", indication: "Đau cánh tay" },
      { code: "LI13", name_vi: "Tực Tả", meridian: "Kinh Dương Minh Đại Tràng", location: "Trên LI12 3 inch", indication: "Đau cánh tay, sốt" },
      { code: "LI14", name_vi: "Tương Tuyền", meridian: "Kinh Dương Minh Đại Tràng", location: "Khoảng tay, phía trước xương cơ delta", indication: "Sốt, đau cánh tay" },
      { code: "LI15", name_vi: "Kiên Tuyền", meridian: "Kinh Dương Minh Đại Tràng", location: "Ở đỉnh vai", indication: "Đau vai, đau cánh tay" },
      { code: "LI16", name_vi: "Tứ Độc", meridian: "Kinh Dương Minh Đại Tràng", location: "Ở trên gốc cánh tay", indication: "Đau vai, khó vận động" },
      { code: "LI17", name_vi: "Thiên Định", meridian: "Kinh Dương Minh Đại Tràng", location: "Ở trên cạnh cổ", indication: "Đau cổ, sưng hạch" },
      { code: "LI18", name_vi: "Phủ Tuyền", meridian: "Kinh Dương Minh Đại Tràng", location: "Khoảng cổ, phía trên xương đòn", indication: "Đau cổ, sưng hạch" },
      { code: "LI19", name_vi: "Huyền Lương", meridian: "Kinh Dương Minh Đại Tràng", location: "Dưới hốc mũi", indication: "Viêm xoang, mũi tắc" },
      { code: "LI20", name_vi: "Tích Hương", meridian: "Kinh Dương Minh Đại Tràng", location: "Ở cạnh mũi", indication: "Viêm xoang, mũi tắc" },

      // Stomach Meridian (ST) - 20 points
      { code: "ST1", name_vi: "Mục Hào", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới mắt, ở mặt mũi", indication: "Đau mắt, mặt sưng" },
      { code: "ST2", name_vi: "Tứ Bạch", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới ST1 một nhích", indication: "Đau mắt, chứng nên" },
      { code: "ST3", name_vi: "Đại Tứ", meridian: "Kinh Dương Minh Dạ Dày", location: "Ngoài hốc mũi", indication: "Viêm xoang, mũi tắc" },
      { code: "ST4", name_vi: "Địa Tứ", meridian: "Kinh Dương Minh Dạ Dày", location: "Hàm dưới, trên hố cằm", indication: "Thần kinh mặt, chứng nên" },
      { code: "ST5", name_vi: "Đại Ưng", meridian: "Kinh Dương Minh Dạ Dày", location: "Trước tai, dưới quai hàm", indication: "Sưng tấy, viêm thân kinh" },
      { code: "ST6", name_vi: "Giáp Xe", meridian: "Kinh Dương Minh Dạ Dày", location: "Ở nơi gần tiếp tai và quai hàm", indication: "Paralysis mặt, chứng nên" },
      { code: "ST7", name_vi: "Hạ Quan", meridian: "Kinh Dương Minh Dạ Dày", location: "Trước tai, dưới hốc tai", indication: "Đau tai, viêm thần kinh mặt" },
      { code: "ST8", name_vi: "Đầu Lâm", meridian: "Kinh Dương Minh Dạ Dày", location: "Trên vành tai", indication: "Đau đầu, chóng mặt" },
      { code: "ST9", name_vi: "Nhân Huyễn", meridian: "Kinh Dương Minh Dạ Dày", location: "Cạnh tuyến giáp, trên xương đo mạch", indication: "Huyết áp cao, đau cổ" },
      { code: "ST10", name_vi: "Thủy Tuyến", meridian: "Kinh Dương Minh Dạ Dày", location: "Trên ST9 cách 3 inch", indication: "Đau cổ, sưng hạch" },
      { code: "ST11", name_vi: "Kỳ Ở", meridian: "Kinh Dương Minh Dạ Dày", location: "Trên ST10 cách 3 inch", indication: "Ho, hen suyễn" },
      { code: "ST12", name_vi: "Khí Xuyế", meridian: "Kinh Dương Minh Dạ Dày", location: "Trên xương đòn, gần xương ức", indication: "Ho, đau lồng ngực" },
      { code: "ST13", name_vi: "Kỳ Hư", meridian: "Kinh Dương Minh Dạ Dày", location: "Lõm dưới xương đòn", indication: "Ho, đau lồng ngực" },
      { code: "ST14", name_vi: "Khiếp Độ", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới xương sườn thứ 1", indication: "Ho, đau lồng ngực" },
      { code: "ST15", name_vi: "Vũ Hùng", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới xương sườn thứ 2", indication: "Ho, đau lồng ngực" },
      { code: "ST16", name_vi: "Ưng Huynh", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới xương sườn thứ 3", indication: "Chứng bệnh vú" },
      { code: "ST17", name_vi: "Nữ Ảo", meridian: "Kinh Dương Minh Dạ Dày", location: "Ở núu vú", indication: "Chứng bệnh vú, đau" },
      { code: "ST18", name_vi: "Bút Đồ", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới vú 1 nhích", indication: "Chứng bệnh vú, ho" },
      { code: "ST19", name_vi: "Bất Dung", meridian: "Kinh Dương Minh Dạ Dày", location: "Dưới xương sườn thứ 6", indication: "Đau bụi, tiêu chảy" },
      { code: "ST20", name_vi: "Thích Sơn", meridian: "Kinh Dương Minh Dạ Dày", location: "Trên rốn 2 inch", indication: "Đau bụi, yếu tiêu hóa" },

      // Spleen Meridian (SP) - 15 points
      { code: "SP1", name_vi: "Ẩm Bạch", meridian: "Kinh Thái Âm Tỳ", location: "Góc móng ngón chân cái bên trong", indication: "Chảy máu, kiết" },
      { code: "SP2", name_vi: "Đại Đô", meridian: "Kinh Thái Âm Tỳ", location: "Giữa hai xương chân dạng nếp gấp", indication: "Đau chân, sốt" },
      { code: "SP3", name_vi: "Thạch Bạch", meridian: "Kinh Thái Âm Tỳ", location: "Trên đầu ngón chân cái", indication: "Đau chân, lỏng phân" },
      { code: "SP4", name_vi: "Công Tôn", meridian: "Kinh Thái Âm Tỳ", location: "Khoảng chân, bên dưới xương metatarsal thứ 1", indication: "Đau bụi, mệt" },
      { code: "SP5", name_vi: "Thương Khúc", meridian: "Kinh Thái Âm Tỳ", location: "Nếp gấp cổ chân bên trong", indication: "Sưng chân, bệnh phụ nữ" },
      { code: "SP6", name_vi: "Tam Yin Giao", meridian: "Kinh Thái Âm Tỳ", location: "Giữa cắp chân 3 inch", indication: "Mệt yếu, bệnh phụ nữ, mất ngủ" },
      { code: "SP7", name_vi: "Lâu Huyền", meridian: "Kinh Thái Âm Tỳ", location: "Trên SP6 khoảng 3 inch", indication: "Đau chân, sưng" },
      { code: "SP8", name_vi: "Địa Cơ", meridian: "Kinh Thái Âm Tỳ", location: "Trên SP7 khoảng 3 inch", indication: "Đau chân, tiêu chảy" },
      { code: "SP9", name_vi: "Yin Lăng Tuyền", meridian: "Kinh Thái Âm Tỳ", location: "Dưới xương sàn chân", indication: "Đau chân, tiêu chảy" },
      { code: "SP10", name_vi: "Huyết Hải", meridian: "Kinh Thái Âm Tỳ", location: "Trên đầu gối khoảng 3 inch", indication: "Mệt yếu, bệnh phụ nữ" },
      { code: "SP11", name_vi: "Tích Tông", meridian: "Kinh Thái Âm Tỳ", location: "Trong đùi, gần hạn động mạch", indication: "Chảy máu, sốt" },
      { code: "SP12", name_vi: "Xung Môn", meridian: "Kinh Thái Âm Tỳ", location: "Phía dưới rốn khoảng 4.5 inch", indication: "Bệnh phụ nữ, tiêu hóa yếu" },
      { code: "SP13", name_vi: "Phù Thê", meridian: "Kinh Thái Âm Tỳ", location: "Phía dưới rốn khoảng 3 inch, ngàn xương chậu", indication: "Bệnh phụ nữ, lỏng phân" },
      { code: "SP14", name_vi: "Phủ Thẻ", meridian: "Kinh Thái Âm Tỳ", location: "Dưới vú 2 inch ở khoảng giữa", indication: "Ho, đau lồng ngực" },
      { code: "SP15", name_vi: "Đại Nằm", meridian: "Kinh Thái Âm Tỳ", location: "Dưới vú 4 inch ở khoảng giữa", indication: "Đau bụi, tiêu chảy" },

      // Heart Meridian (HT) - 9 points
      { code: "HT1", name_vi: "Cực Tuyền", meridian: "Kinh Thiếu Âm Tâm", location: "Nách", indication: "Đau cánh tay, tâm bệnh" },
      { code: "HT2", name_vi: "Thanh Linh", meridian: "Kinh Thiếu Âm Tâm", location: "Trên HT1 khoảng 3 inch ở bên trong cánh tay", indication: "Đau cánh tay, tâm bệnh" },
      { code: "HT3", name_vi: "Thiếu Hải", meridian: "Kinh Thiếu Âm Tâm", location: "Nếp gấp khuỷu bên trong", indication: "Tâm bệnh, mất ngủ" },
      { code: "HT4", name_vi: "Linh Đạo", meridian: "Kinh Thiếu Âm Tâm", location: "Trên HT3 khoảng 3 inch", indication: "Tâm bệnh, mất ngủ" },
      { code: "HT5", name_vi: "Thông Lý", meridian: "Kinh Thiếu Âm Tâm", location: "Trên HT4 khoảng 3 inch", indication: "Mất ngủ, bứt rứt" },
      { code: "HT6", name_vi: "Âm Tích", meridian: "Kinh Thiếu Âm Tâm", location: "Khoảng tay ở cạnh bên trong, gần cổ tay", indication: "Tâm bệnh, vô cảm" },
      { code: "HT7", name_vi: "Thần Môn", meridian: "Kinh Thiếu Âm Tâm", location: "Nếp gấp cổ tay bên trong, ở bên cạnh gân", indication: "Mất ngủ, tâm bệnh, lo âu" },
      { code: "HT8", name_vi: "Thiếu Phủ", meridian: "Kinh Thiếu Âm Tâm", location: "Tâm bàn tay, gữa ngón chân giữa và ngón vô danh", indication: "Tâm bệnh, sốt" },
      { code: "HT9", name_vi: "Thiếu Xuyết", meridian: "Kinh Thiếu Âm Tâm", location: "Góc móng ngón tay giữa bên trong", indication: "Sốt cao, tâm bệnh" },

      // Small Intestine Meridian (SI) - 19 points (sample)
      { code: "SI1", name_vi: "Thiếu Tạo", meridian: "Kinh Thái Dương Tiểu Tràng", location: "Góc móng ngón tay cái bên ngoài", indication: "Sốt, ngất" },
      { code: "SI3", name_vi: "Hòa Tuyền", meridian: "Kinh Thái Dương Tiểu Tràng", location: "Gấy quanh cơ xương cẳng tay", indication: "Đau cánh tay, viêm họng" },
      { code: "SI8", name_vi: "Tiểu Hải", meridian: "Kinh Thái Dương Tiểu Tràng", location: "Nếp gấp khuỷu bên trong", indication: "Đau cánh tay, sốt" },

      // Bladder Meridian (BL) - 27 points (sample)
      { code: "BL1", name_vi: "Tuyền Minh", meridian: "Kinh Thái Dương Bàng Quang", location: "Góc mắt trong cạnh mũi", indication: "Đau mắt, viêm họng" },
      { code: "BL2", name_vi: "Xứ Chu", meridian: "Kinh Thái Dương Bàng Quang", location: "Trên BL1 khoảng 0.5 inch", indication: "Đau mắt, đau đầu" },
      { code: "BL10", name_vi: "Thiên Trụ", meridian: "Kinh Thái Dương Bàng Quang", location: "Ở cạnh cổ, bên ngoài ép tính", indication: "Đau cổ, cảm lạnh" },

      // Kidney Meridian (KI) - 27 points (sample)
      { code: "KI1", name_vi: "Yông Tuyền", meridian: "Kinh Thiếu Âm Thận", location: "Tâm bàn chân", indication: "Sốt, ngất, mệt" },
      { code: "KI3", name_vi: "Thái Khể", meridian: "Kinh Thiếu Âm Thận", location: "Ở trong sau làm cổ chân", indication: "Mệt yếu, chứng tiêu chảy" },

      // Pericardium Meridian (PC) - 9 points
      { code: "PC1", name_vi: "Thiên Trùng", meridian: "Kinh Quyết Âm Thủ Quyết Ấm", location: "Khoảng giữa vú thứ 1 và 2", indication: "Đau lồng ngực, tâm bệnh" },
      { code: "PC3", name_vi: "Khúc Tuyền", meridian: "Kinh Quyết Âm Thủ Quyết Ấm", location: "Nếp gấp khuỷu ở lằn giữa", indication: "Tâm bệnh, đau cánh tay" },
      { code: "PC7", name_vi: "Đại Lăng", meridian: "Kinh Quyết Âm Thủ Quyết Ấm", location: "Nếp gấp cổ tay ở lằn giữa", indication: "Mất ngủ, tâm bệnh" },
      { code: "PC8", name_vi: "Lao Gong", meridian: "Kinh Quyết Âm Thủ Quyết Ấm", location: "Tâm bàn tay", indication: "Sốt, tâm bệnh" },
      { code: "PC9", name_vi: "Trung Xuyết", meridian: "Kinh Quyết Âm Thủ Quyết Ấm", location: "Góc móng ngón tay giữa", indication: "Sốt cao, ngất" },

      // Triple Burner Meridian (TE) - 23 points (sample)
      { code: "TE3", name_vi: "Trung Chu", meridian: "Kinh Thất Dương Tam Tiêu", location: "Khoảng cơ xương cẳng tay", indication: "Viêm họng, đau tay" },
      { code: "TE5", name_vi: "Ngoại Quan", meridian: "Kinh Thất Dương Tam Tiêu", location: "Trên cắp tay 2 inch", indication: "Viêm họng, sốt" },

      // Gallbladder Meridian (GB) - 44 points (sample)
      { code: "GB1", name_vi: "Tòng Tử Tương", meridian: "Kinh Tấc Dương Mật", location: "Khoảng đầu mắt", indication: "Đau mắt, viêm họng" },
      { code: "GB20", name_vi: "Phong Trì", meridian: "Kinh Tấc Dương Mật", location: "Ở sau đầu ở lõm", indication: "Đau đầu, cảm lạnh, chóng mặt" },
      { code: "GB34", name_vi: "Dương Linh Tuyền", meridian: "Kinh Tấc Dương Mật", location: "Bên ngoài đầu gối", indication: "Đau đầu gối, mệt yếu" },

      // Liver Meridian (LV) - 14 points (sample)
      { code: "LV1", name_vi: "Đại Đông", meridian: "Kinh Quyết Âm Gan", location: "Góc móng ngón chân cái bên ngoài", indication: "Chứng giận dữ, tiêu chảy" },
      { code: "LV3", name_vi: "Thái Xung", meridian: "Kinh Quyết Âm Gan", location: "Khoảng chân giữa hai xương metatarsal thứ 1 và 2", indication: "Chóng mặt, đau đầu, tâm bệnh" },
      { code: "LV14", name_vi: "Kỳ Môn", meridian: "Kinh Quyết Âm Gan", location: "Dưới vú thứ 2", indication: "Đau bụi, bệnh gan" },
    ];

    const stmt = db.prepare(`
      INSERT INTO acupoints (code, name_vi, meridian_id, location, indication, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    let inserted = 0;

    acupoints.forEach(point => {
      const meridianId = getMeridianId(point.meridian);
      if (meridianId) {
        stmt.run(point.code, point.name_vi, meridianId, point.location, point.indication, now, now);
        inserted++;
      }
    });
    console.log(`✅ Seeded ${inserted} acupoints`);
  } catch (error) {
    console.error("Error seeding acupoints:", error);
  }
}

// Initialize database on load
initializeDatabase();

module.exports = db;
