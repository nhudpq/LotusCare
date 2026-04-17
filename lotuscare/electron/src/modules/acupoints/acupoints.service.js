const AcupointRepository = require('./acupoints.repository');

class AcupointService {
  static async getAllAcupoints() {
    return AcupointRepository.getAllAcupoints();
  }

  static async getAcupointById(id) {
    return AcupointRepository.getAcupointById(id);
  }

  static async getAcupointByCode(code) {
    return AcupointRepository.getAcupointByCode(code);
  }

  static async getAcupointsByMeridian(meridianId) {
    return AcupointRepository.getAcupointsByMeridian(meridianId);
  }

  static async searchAcupoints(q) {
    return AcupointRepository.searchAcupoints(q);
  }

  static async createAcupoint(data) {
    return AcupointRepository.createAcupoint(data);
  }

  static async updateAcupoint(id, data) {
    return AcupointRepository.updateAcupoint(id, data);
  }

  static async deleteAcupoint(id) {
    return AcupointRepository.deleteAcupoint(id);
  }

  static async getAcupointsPaginated(page = 1, limit = 10) {
    return AcupointRepository.getAcupointsPaginated(page, limit);
  }

  static async searchAcupointsPaginated(q, page = 1, limit = 10) {
    return AcupointRepository.searchAcupointsPaginated(q, page, limit);
  }

  static async getAcupointsByMeridianPaginated(meridianId, page = 1, limit = 10) {
    return AcupointRepository.getAcupointsByMeridianPaginated(meridianId, page, limit);
  }
}

module.exports = AcupointService;
