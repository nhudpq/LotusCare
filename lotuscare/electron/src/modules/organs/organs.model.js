const db = require('../../config/db');

class OrganModel {
  static getAll() {
    const stmt = db.prepare(`
      SELECT * FROM organs 
      ORDER BY type ASC, created_at DESC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT * FROM organs 
      WHERE id = ?
    `);
    return stmt.get(id);
  }

  static getByType(type) {
    const stmt = db.prepare(`
      SELECT * FROM organs 
      WHERE type = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(type);
  }

  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO organs (
        name, type, created_at, updated_at
      )
      VALUES (?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name,
      data.type !== undefined ? data.type : 0,
      now,
      now
    );
    return result.lastInsertRowid;
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE organs 
      SET name = ?, 
          type = ?,
          updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name,
      data.type !== undefined ? data.type : 0,
      now,
      id
    );
    return result.changes > 0;
  }

  static delete(id) {
    const stmt = db.prepare(`
      DELETE FROM organs WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = OrganModel;
