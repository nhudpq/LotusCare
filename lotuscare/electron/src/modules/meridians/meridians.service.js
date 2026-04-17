const MeridianRepository = require('./meridians.repository');

class MeridianService {
  static async getAllMeridians() {
    return MeridianRepository.getAllMeridians();
  }

  static async getMeridianById(id) {
    return MeridianRepository.getMeridianById(id);
  }

  static async getMeridiansByOrgan(organId) {
    return MeridianRepository.getMeridiansByOrgan(organId);
  }

  static async createMeridian(data) {
    return MeridianRepository.createMeridian(data);
  }

  static async updateMeridian(id, data) {
    return MeridianRepository.updateMeridian(id, data);
  }

  static async deleteMeridian(id) {
    return MeridianRepository.deleteMeridian(id);
  }
}

module.exports = MeridianService;
