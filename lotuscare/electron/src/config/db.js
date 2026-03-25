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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Initialize database on load
initializeDatabase();

module.exports = db;
