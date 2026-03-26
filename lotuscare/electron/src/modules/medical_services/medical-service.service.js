const MedicalServiceRepository = require('./medical-service.repository');


class MedicalServiceService {
  static async getAllServices() {
    return MedicalServiceRepository.getAllServices();
  }

  static async getServiceById(id) {
    return MedicalServiceRepository.getServiceById(id);
  }

  static async createService(data) {
    const newService = {
      ...data,
      
    };
    return MedicalServiceRepository.createService(newService);
  }

  static async updateService(id, data) {
    return MedicalServiceRepository.updateService(id, data);
  }

  static async deleteService(id) {
    return MedicalServiceRepository.deleteService(id);
  }
}

module.exports = MedicalServiceService;
