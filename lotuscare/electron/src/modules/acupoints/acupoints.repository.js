const AcupointModel = require('./acupoints.model');

class AcupointRepository {
  static getAllAcupoints() {
    try {
      return AcupointModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching acupoints: ${error.message}`);
    }
  }

  static getAcupointById(id) {
    try {
      const acupoint = AcupointModel.getById(id);
      if (!acupoint) {
        throw new Error(`Acupoint with ID ${id} not found`);
      }
      return acupoint;
    } catch (error) {
      throw new Error(`Error fetching acupoint: ${error.message}`);
    }
  }

  static getAcupointByCode(code) {
    try {
      const acupoint = AcupointModel.getByCode(code);
      if (!acupoint) {
        throw new Error(`Acupoint with code ${code} not found`);
      }
      return acupoint;
    } catch (error) {
      throw new Error(`Error fetching acupoint: ${error.message}`);
    }
  }

  static getAcupointsByMeridian(meridianId) {
    try {
      return AcupointModel.getByMeridian(meridianId);
    } catch (error) {
      throw new Error(`Error fetching acupoints by meridian: ${error.message}`);
    }
  }

  static searchAcupoints(q) {
    try {
      if (!q || q.trim().length === 0) {
        throw new Error('Search query is required');
      }
      return AcupointModel.search(q.trim());
    } catch (error) {
      throw new Error(`Error searching acupoints: ${error.message}`);
    }
  }

  static createAcupoint(data) {
    try {
      if (!data.code || !data.name_vi || !data.meridian_id) {
        throw new Error('code, name_vi, and meridian_id are required');
      }
      const id = AcupointModel.create(data);
      return AcupointModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating acupoint: ${error.message}`);
    }
  }

  static updateAcupoint(id, data) {
    try {
      const updated = AcupointModel.update(id, data);
      if (!updated) {
        throw new Error(`Acupoint with ID ${id} not found`);
      }
      return AcupointModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating acupoint: ${error.message}`);
    }
  }

  static deleteAcupoint(id) {
    try {
      const deleted = AcupointModel.delete(id);
      if (!deleted) {
        throw new Error(`Acupoint with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting acupoint: ${error.message}`);
    }
  }

  static getAcupointsPaginated(page = 1, limit = 10) {
    try {
      page = Math.max(1, parseInt(page) || 1);
      limit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Cap at 100
      return AcupointModel.getPaginated(page, limit);
    } catch (error) {
      throw new Error(`Error fetching paginated acupoints: ${error.message}`);
    }
  }

  static searchAcupointsPaginated(q, page = 1, limit = 10) {
    try {
      if (!q || q.trim().length === 0) {
        throw new Error('Search query is required');
      }
      page = Math.max(1, parseInt(page) || 1);
      limit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Cap at 100
      return AcupointModel.searchPaginated(q.trim(), page, limit);
    } catch (error) {
      throw new Error(`Error searching paginated acupoints: ${error.message}`);
    }
  }

  static getAcupointsByMeridianPaginated(meridianId, page = 1, limit = 10) {
    try {
      page = Math.max(1, parseInt(page) || 1);
      limit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Cap at 100
      return AcupointModel.getByMeridianPaginated(meridianId, page, limit);
    } catch (error) {
      throw new Error(`Error fetching paginated acupoints by meridian: ${error.message}`);
    }
  }
}

module.exports = AcupointRepository;
