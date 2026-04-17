const MeridianModel = require('./meridians.model');

class MeridianRepository {
  static getAllMeridians() {
    try {
      return MeridianModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching meridians: ${error.message}`);
    }
  }

  static getMeridianById(id) {
    try {
      const meridian = MeridianModel.getById(id);
      if (!meridian) {
        throw new Error(`Meridian with ID ${id} not found`);
      }
      return meridian;
    } catch (error) {
      throw new Error(`Error fetching meridian: ${error.message}`);
    }
  }

  static getMeridiansByOrgan(organId) {
    try {
      return MeridianModel.getByOrgan(organId);
    } catch (error) {
      throw new Error(`Error fetching meridians by organ: ${error.message}`);
    }
  }

  static createMeridian(data) {
    try {
      if (!data.name_vi) {
        throw new Error('name_vi is required');
      }
      // Validate type if provided
      if (data.type !== undefined && ![0, 1].includes(data.type)) {
        throw new Error('type must be 0 (Primary) or 1 (Extra)');
      }
      const id = MeridianModel.create(data);
      return MeridianModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating meridian: ${error.message}`);
    }
  }

  static updateMeridian(id, data) {
    try {
      // Validate type if provided
      if (data.type !== undefined && ![0, 1].includes(data.type)) {
        throw new Error('type must be 0 (Primary) or 1 (Extra)');
      }
      const updated = MeridianModel.update(id, data);
      if (!updated) {
        throw new Error(`Meridian with ID ${id} not found`);
      }
      return MeridianModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating meridian: ${error.message}`);
    }
  }

  static deleteMeridian(id) {
    try {
      const deleted = MeridianModel.delete(id);
      if (!deleted) {
        throw new Error(`Meridian with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting meridian: ${error.message}`);
    }
  }
}

module.exports = MeridianRepository;
