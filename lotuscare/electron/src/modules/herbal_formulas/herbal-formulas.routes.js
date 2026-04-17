const { ipcMain } = require('electron');
const HerbalFormulaService = require('./herbal-formulas.service');

function registerHerbalFormulaRoutes() {
  // Get all formulas
  ipcMain.handle('herbal-formulas:getAll', async () => {
    return HerbalFormulaService.getAllFormulas();
  });

  // Get formula by ID
  ipcMain.handle('herbal-formulas:getById', async (event, id) => {
    return HerbalFormulaService.getFormulaById(id);
  });

  // Create formula
  ipcMain.handle('herbal-formulas:create', async (event, formulaData) => {
    return HerbalFormulaService.createFormula(formulaData);
  });

  // Update formula
  ipcMain.handle('herbal-formulas:update', async (event, id, formulaData) => {
    return HerbalFormulaService.updateFormula(id, formulaData);
  });

  // Delete formula
  ipcMain.handle('herbal-formulas:delete', async (event, id) => {
    return HerbalFormulaService.deleteFormula(id);
  });
}

module.exports = { registerHerbalFormulaRoutes };
