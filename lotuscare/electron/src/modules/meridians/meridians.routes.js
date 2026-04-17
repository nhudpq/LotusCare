const { ipcMain } = require('electron');
const MeridianService = require('./meridians.service');

function registerMeridianRoutes() {
  // Get all meridians
  ipcMain.handle('meridians:getAll', async () => {
    return MeridianService.getAllMeridians();
  });

  // Get meridian by ID
  ipcMain.handle('meridians:getById', async (event, id) => {
    return MeridianService.getMeridianById(id);
  });

  // Get meridians by organ
  ipcMain.handle('meridians:getByOrgan', async (event, organId) => {
    return MeridianService.getMeridiansByOrgan(organId);
  });

  // Create meridian
  ipcMain.handle('meridians:create', async (event, meridianData) => {
    return MeridianService.createMeridian(meridianData);
  });

  // Update meridian
  ipcMain.handle('meridians:update', async (event, id, meridianData) => {
    return MeridianService.updateMeridian(id, meridianData);
  });

  // Delete meridian
  ipcMain.handle('meridians:delete', async (event, id) => {
    return MeridianService.deleteMeridian(id);
  });
}

module.exports = { registerMeridianRoutes };
