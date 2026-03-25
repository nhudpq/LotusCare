const db = require('../../config/db');

class PatientModel {
  // Get all patients
  static getAll() {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY created_at DESC');
    return stmt.all();
  }

  // Get patient by ID
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM patients WHERE id = ?');
    return stmt.get(id);
  }

  // Create new patient
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO patients (
        ma_bn, ho_ten, gioi_tinh, ngay_sinh, ma_quoc_tich, so_cmnd, 
        ho_ten_cha, ho_ten_ncs, phone, father_phone, email, 
        tinh, huyen, xa, dia_chi, 
        tien_su_benh, di_ung, hinh_anh, ghi_chu
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Generate ma_bn if not provided or ensure it is passed
    
    const result = stmt.run(
      data.ma_bn,
      data.ho_ten,
      data.gioi_tinh || null,
      data.ngay_sinh || null,
      data.ma_quoc_tich || null,
      data.so_cmnd || null,
      data.ho_ten_cha || null,
      data.ho_ten_ncs || null,
      data.phone || null,
      data.father_phone || null,
      data.email || null,
      data.tinh || null,
      data.huyen || null,
      data.xa || null,
      data.dia_chi || null,
      data.tien_su_benh || null,
      data.di_ung || null,
      data.hinh_anh || null,
      data.ghi_chu || null
    );
    
    return result.lastInsertRowid;
  }

  // Update patient
  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE patients 
      SET ho_ten = ?, gioi_tinh = ?, ngay_sinh = ?, ma_quoc_tich = ?, 
          so_cmnd = ?, ho_ten_cha = ?, ho_ten_ncs = ?, 
          phone = ?, father_phone = ?, email = ?, 
          tinh = ?, huyen = ?, xa = ?, dia_chi = ?, 
          tien_su_benh = ?, di_ung = ?, hinh_anh = ?, ghi_chu = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(
      data.ho_ten,
      data.gioi_tinh || null,
      data.ngay_sinh || null,
      data.ma_quoc_tich || null,
      data.so_cmnd || null,
      data.ho_ten_cha || null,
      data.ho_ten_ncs || null,
      data.phone || null,
      data.father_phone || null,
      data.email || null,
      data.tinh || null,
      data.huyen || null,
      data.xa || null,
      data.dia_chi || null,
      data.tien_su_benh || null,
      data.di_ung || null,
      data.hinh_anh || null,
      data.ghi_chu || null,
      id
    );
    
    return result.changes > 0;
  }

  // Delete patient
  static delete(id) {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Search patients
  static search(query) {
    const stmt = db.prepare(`
      SELECT * FROM patients 
      WHERE ho_ten LIKE ? OR ma_bn LIKE ? OR email LIKE ? OR phone LIKE ? OR so_cmnd LIKE ?
      ORDER BY created_at DESC
    `);
    const searchPattern = `%${query}%`;
    return stmt.all(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }
}

module.exports = PatientModel;
