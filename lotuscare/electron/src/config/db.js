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
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      dateOfBirth TEXT,
      gender TEXT,
      address TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Initialize database on load
initializeDatabase();

module.exports = db;
