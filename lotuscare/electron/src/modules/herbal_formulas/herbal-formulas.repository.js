const HerbalFormulaModel = require('./herbal-formulas.model');

class HerbalFormulaRepository {
  static getAllFormulas() {
    try {
      return HerbalFormulaModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching herbal formulas: ${error.message}`);
    }
  }

  static getFormulaById(id) {
    try {
      const formula = HerbalFormulaModel.getById(id);
      if (!formula) {
        throw new Error(`Herbal formula with ID ${id} not found`);
      }
      return formula;
    } catch (error) {
      throw new Error(`Error fetching herbal formula: ${error.message}`);
    }
  }

  static createFormula(data) {
    try {
      if (!data.code || !data.name || data.price === undefined) {
        throw new Error('Code, Name, and Price are required');
      }
      const id = HerbalFormulaModel.create(data);
      return HerbalFormulaModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating herbal formula: ${error.message}`);
    }
  }

  static updateFormula(id, data) {
    try {
      const updated = HerbalFormulaModel.update(id, data);
      if (!updated) {
        throw new Error(`Herbal formula with ID ${id} not found`);
      }
      return HerbalFormulaModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating herbal formula: ${error.message}`);
    }
  }

  static deleteFormula(id) {
    try {
      const deleted = HerbalFormulaModel.delete(id);
      if (!deleted) {
        throw new Error(`Herbal formula with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting herbal formula: ${error.message}`);
    }
  }
}

module.exports = HerbalFormulaRepository;
