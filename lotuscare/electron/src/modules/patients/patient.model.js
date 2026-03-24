const db = require('../../config/db');

class PatientModel {
  // Get all patients
  static getAll() {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY createdAt DESC');
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
      INSERT INTO patients (firstName, lastName, email, phone, dateOfBirth, gender, address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.firstName,
      data.lastName,
      data.email || null,
      data.phone || null,
      data.dateOfBirth || null,
      data.gender || null,
      data.address || null,
      data.notes || null
    );
    
    return result.lastInsertRowid;
  }

  // Update patient
  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE patients 
      SET firstName = ?, lastName = ?, email = ?, phone = ?, 
          dateOfBirth = ?, gender = ?, address = ?, notes = ?, 
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(
      data.firstName,
      data.lastName,
      data.email || null,
      data.phone || null,
      data.dateOfBirth || null,
      data.gender || null,
      data.address || null,
      data.notes || null,
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
      WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY createdAt DESC
    `);
    const searchPattern = `%${query}%`;
    return stmt.all(searchPattern, searchPattern, searchPattern, searchPattern);
  }
}

module.exports = PatientModel;
