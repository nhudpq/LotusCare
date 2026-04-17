const HerbalFormulaRepository = require('./herbal-formulas.repository');

class HerbalFormulaService {
  static async getAllFormulas() {
    return HerbalFormulaRepository.getAllFormulas();
  }

  static async getFormulaById(id) {
    return HerbalFormulaRepository.getFormulaById(id);
  }

  static async createFormula(data) {
    return HerbalFormulaRepository.createFormula(data);
  }

  static async updateFormula(id, data) {
    return HerbalFormulaRepository.updateFormula(id, data);
  }

  static async deleteFormula(id) {
    return HerbalFormulaRepository.deleteFormula(id);
  }
}

module.exports = HerbalFormulaService;
