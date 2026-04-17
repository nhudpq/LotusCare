const OrganModel = require('./organs.model');

class OrganRepository {
  static getAllOrgans() {
    try {
      return OrganModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching organs: ${error.message}`);
    }
  }

  static getOrganById(id) {
    try {
      const organ = OrganModel.getById(id);
      if (!organ) {
        throw new Error(`Organ with ID ${id} not found`);
      }
      return organ;
    } catch (error) {
      throw new Error(`Error fetching organ: ${error.message}`);
    }
  }

  static getOrgansByType(type) {
    try {
      // Validate type
      if (![0, 1].includes(type)) {
        throw new Error('type must be 0 (Tạng) or 1 (Phủ)');
      }
      return OrganModel.getByType(type);
    } catch (error) {
      throw new Error(`Error fetching organs by type: ${error.message}`);
    }
  }

  static createOrgan(data) {
    try {
      if (!data.name) {
        throw new Error('name is required');
      }
      // Validate type if provided
      if (data.type !== undefined && ![0, 1].includes(data.type)) {
        throw new Error('type must be 0 (Tạng) or 1 (Phủ)');
      }
      const id = OrganModel.create(data);
      return OrganModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating organ: ${error.message}`);
    }
  }

  static updateOrgan(id, data) {
    try {
      // Validate type if provided
      if (data.type !== undefined && ![0, 1].includes(data.type)) {
        throw new Error('type must be 0 (Tạng) or 1 (Phủ)');
      }
      const updated = OrganModel.update(id, data);
      if (!updated) {
        throw new Error(`Organ with ID ${id} not found`);
      }
      return OrganModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating organ: ${error.message}`);
    }
  }

  static deleteOrgan(id) {
    try {
      const deleted = OrganModel.delete(id);
      if (!deleted) {
        throw new Error(`Organ with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting organ: ${error.message}`);
    }
  }
}

module.exports = OrganRepository;
