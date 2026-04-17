const OrganRepository = require('./organs.repository');

class OrganService {
  static async getAllOrgans() {
    return OrganRepository.getAllOrgans();
  }

  static async getOrganById(id) {
    return OrganRepository.getOrganById(id);
  }

  static async getOrgansByType(type) {
    return OrganRepository.getOrgansByType(type);
  }

  static async createOrgan(data) {
    return OrganRepository.createOrgan(data);
  }

  static async updateOrgan(id, data) {
    return OrganRepository.updateOrgan(id, data);
  }

  static async deleteOrgan(id) {
    return OrganRepository.deleteOrgan(id);
  }
}

module.exports = OrganService;
