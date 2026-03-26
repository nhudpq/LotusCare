const MedicalServiceModel = require('./medical-service.model');

class MedicalServiceRepository {
  static getAllServices() {
    try {
      return MedicalServiceModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching medical services: ${error.message}`);
    }
  }

  static getServiceById(id) {
    try {
      const service = MedicalServiceModel.getById(id);
      if (!service) {
        throw new Error(`Medical service with ID ${id} not found`);
      }
      return service;
    } catch (error) {
      throw new Error(`Error fetching medical service: ${error.message}`);
    }
  }

  static createService(data) {
    try {
      if (!data.code || !data.name || data.price === undefined) {
        throw new Error('Code, Name, and Price are required');
      }
      const id = MedicalServiceModel.create(data);
      return MedicalServiceModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating medical service: ${error.message}`);
    }
  }

  static updateService(id, data) {
    try {
      const updated = MedicalServiceModel.update(id, data);
      if (!updated) {
        throw new Error(`Medical service with ID ${id} not found`);
      }
      return MedicalServiceModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating medical service: ${error.message}`);
    }
  }

  static deleteService(id) {
    try {
      const deleted = MedicalServiceModel.delete(id);
      if (!deleted) {
        throw new Error(`Medical service with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting medical service: ${error.message}`);
    }
  }
}

module.exports = MedicalServiceRepository;
