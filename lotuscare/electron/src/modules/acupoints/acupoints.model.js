const db = require('../../config/db');

class AcupointModel {
  static getAll() {
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE is_deleted = 0
      ORDER BY code ASC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE id = ? AND is_deleted = 0
    `);
    return stmt.get(id);
  }

  static getByCode(code) {
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE code = ? AND is_deleted = 0
    `);
    return stmt.get(code);
  }

  static getByMeridian(meridianId) {
    const stmt = db.prepare(`
      SELECT a.* FROM acupoints a
      WHERE a.meridian_id = ? AND a.is_deleted = 0
      ORDER BY a.code ASC
    `);
    return stmt.all(meridianId);
  }

  static search(q) {
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE is_deleted = 0 AND (code LIKE ? OR name_vi LIKE ? OR indication LIKE ?)
      ORDER BY code ASC
    `);
    const searchTerm = `%${q}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm);
  }

  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO acupoints (
        code, name_vi, meridian_id, location, indication, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.code,
      data.name_vi,
      data.meridian_id,
      data.location || null,
      data.indication || null,
      now,
      now
    );
    return result.lastInsertRowid;
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE acupoints 
      SET code = ?, 
          name_vi = ?, 
          meridian_id = ?,
          location = ?,
          indication = ?,
          updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.code,
      data.name_vi,
      data.meridian_id,
      data.location || null,
      data.indication || null,
      now,
      id
    );
    return result.changes > 0;
  }

  static delete(id) {
    const stmt = db.prepare(`
      UPDATE acupoints 
      SET is_deleted = 1, updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    const result = stmt.run(now, id);
    return result.changes > 0;
  }

  static getPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM acupoints 
      WHERE is_deleted = 0
    `);
    const { total } = countStmt.get();
    
    // Get paginated data
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE is_deleted = 0
      ORDER BY code ASC
      LIMIT ? OFFSET ?
    `);
    const data = stmt.all(limit, offset);
    
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static searchPaginated(q, page = 1, limit = 10) {
    const searchTerm = `%${q}%`;
    const offset = (page - 1) * limit;
    
    // Get total count for search results
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM acupoints 
      WHERE is_deleted = 0 AND (code LIKE ? OR name_vi LIKE ? OR indication LIKE ?)
    `);
    const { total } = countStmt.get(searchTerm, searchTerm, searchTerm);
    
    // Get paginated search results
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE is_deleted = 0 AND (code LIKE ? OR name_vi LIKE ? OR indication LIKE ?)
      ORDER BY code ASC
      LIMIT ? OFFSET ?
    `);
    const data = stmt.all(searchTerm, searchTerm, searchTerm, limit, offset);
    
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static getByMeridianPaginated(meridianId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM acupoints 
      WHERE meridian_id = ? AND is_deleted = 0
    `);
    const { total } = countStmt.get(meridianId);
    
    // Get paginated data
    const stmt = db.prepare(`
      SELECT * FROM acupoints 
      WHERE meridian_id = ? AND is_deleted = 0
      ORDER BY code ASC
      LIMIT ? OFFSET ?
    `);
    const data = stmt.all(meridianId, limit, offset);
    
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
