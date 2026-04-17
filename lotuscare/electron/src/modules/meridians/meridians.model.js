const db = require('../../config/db');

class MeridianModel {
  static getAll() {
    const stmt = db.prepare(`
      SELECT * FROM meridians 
      WHERE is_deleted = 0
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT * FROM meridians 
      WHERE id = ? AND is_deleted = 0
    `);
    return stmt.get(id);
  }

  static getByOrgan(organId) {
    const stmt = db.prepare(`
      SELECT * FROM meridians 
      WHERE organ_id = ? AND is_deleted = 0
      ORDER BY type ASC, created_at DESC
    `);
    return stmt.all(organId);
  }

  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO meridians (
        name_vi, type, organ_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name_vi,
      data.type || 0,
      data.organ_id || null,
      now,
      now
    );
    return result.lastInsertRowid;
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE meridians 
      SET name_vi = ?, 
          type = ?, 
          organ_id = ?,
          updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name_vi,
      data.type !== undefined ? data.type : 0,
      data.organ_id || null,
      now,
      id
    );
    return result.changes > 0;
  }

  static delete(id) {
    const stmt = db.prepare(`
      UPDATE meridians 
      SET is_deleted = 1, updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    const result = stmt.run(now, id);
    return result.changes > 0;
  }
}

module.exports = MeridianModel;
