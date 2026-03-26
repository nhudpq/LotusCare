const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Get the user data directory for database storage
const dbPath = path.join(app.getPath('userData'), 'lotuscare.db');

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

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
    const columns = db.pragma('table_info(patients)');
    const hasIsDeleted = columns.some(col => col.name === 'is_deleted');
    if (!hasIsDeleted) {
      db.exec('ALTER TABLE patients ADD COLUMN is_deleted INTEGER DEFAULT 0');
    }
  } catch (err) {
    console.error('Error during migration:', err);
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
}

// Initialize database on load
initializeDatabase();

module.exports = db;
