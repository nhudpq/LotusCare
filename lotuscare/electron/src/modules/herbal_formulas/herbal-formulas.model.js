const db = require('../../config/db');

class HerbalFormulaModel {
  static getAll() {
    const stmt = db.prepare(`
      SELECT * FROM herbal_formulas 
      WHERE is_deleted = 0
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT * FROM herbal_formulas 
      WHERE id = ? AND is_deleted = 0
    `);
    return stmt.get(id);
  }

  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO herbal_formulas (
        name, code, description, indication, contraindication, 
        usage_instructions, price, is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name,
      data.code,
      data.description || null,
      data.indication || null,
      data.contraindication || null,
      data.usage_instructions || null,
      data.price,
      data.is_active !== false ? 1 : 0,
      now,
      now
    );
    return result.lastInsertRowid;
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE herbal_formulas 
      SET name = ?, 
          code = ?, 
          description = ?, 
          indication = ?, 
          contraindication = ?, 
          usage_instructions = ?, 
          price = ?,
          is_active = ?,
          updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name,
      data.code,
      data.description || null,
      data.indication || null,
      data.contraindication || null,
      data.usage_instructions || null,
      data.price,
      data.is_active !== false ? 1 : 0,
      now,
      id
    );
    return result.changes > 0;
  }

  static delete(id) {
    const stmt = db.prepare(`
      UPDATE herbal_formulas 
      SET is_deleted = 1, updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    const result = stmt.run(now, id);
    return result.changes > 0;
  }
}

module.exports = HerbalFormulaModel;
