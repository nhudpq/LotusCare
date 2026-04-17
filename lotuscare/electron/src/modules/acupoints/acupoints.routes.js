const { ipcMain } = require('electron');
const AcupointService = require('./acupoints.service');

function registerAcupointRoutes() {
  // Get all acupoints
  ipcMain.handle('acupoints:getAll', async () => {
    return AcupointService.getAllAcupoints();
  });

  // Get acupoint by ID
  ipcMain.handle('acupoints:getById', async (event, id) => {
    return AcupointService.getAcupointById(id);
  });

  // Get acupoint by code
  ipcMain.handle('acupoints:getByCode', async (event, code) => {
    return AcupointService.getAcupointByCode(code);
  });

  // Get acupoints by meridian
  ipcMain.handle('acupoints:getByMeridian', async (event, meridianId) => {
    return AcupointService.getAcupointsByMeridian(meridianId);
  });

  // Search acupoints
  ipcMain.handle('acupoints:search', async (event, q) => {
    return AcupointService.searchAcupoints(q);
  });

  // Create acupoint
  ipcMain.handle('acupoints:create', async (event, acupointData) => {
    return AcupointService.createAcupoint(acupointData);
  });

  // Update acupoint
  ipcMain.handle('acupoints:update', async (event, id, acupointData) => {
    return AcupointService.updateAcupoint(id, acupointData);
  });

  // Delete acupoint
  ipcMain.handle('acupoints:delete', async (event, id) => {
    return AcupointService.deleteAcupoint(id);
  });
}

module.exports = { registerAcupointRoutes };
