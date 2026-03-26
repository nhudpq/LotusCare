const db = require('../../config/db');

class MedicalServiceModel {
  static getAll() {
    const stmt = db.prepare('SELECT * FROM medical_services ORDER BY created_at DESC');
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM medical_services WHERE id = ?');
    return stmt.get(id);
  }

  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO medical_services (
        id, code, name, description, price, duration_minutes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      data.id,
      data.code,
      data.name,
      data.description || null,
      data.price,
      data.duration_minutes || null,
      data.status || 'active'
    );
    
    return data.id;
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE medical_services 
      SET code = COALESCE(?, code),
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          duration_minutes = COALESCE(?, duration_minutes),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(
      data.code !== undefined ? data.code : null,
      data.name !== undefined ? data.name : null,
      data.description !== undefined ? data.description : null,
      data.price !== undefined ? data.price : null,
      data.duration_minutes !== undefined ? data.duration_minutes : null,
      data.status !== undefined ? data.status : null,
      id
    );
    
    return result.changes > 0;
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM medical_services WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = MedicalServiceModel;
