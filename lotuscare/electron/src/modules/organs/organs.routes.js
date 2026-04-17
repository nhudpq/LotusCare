const { ipcMain } = require('electron');
const OrganService = require('./organs.service');

function registerOrganRoutes() {
  // Get all organs
  ipcMain.handle('organs:getAll', async () => {
    return OrganService.getAllOrgans();
  });

  // Get organ by ID
  ipcMain.handle('organs:getById', async (event, id) => {
    return OrganService.getOrganById(id);
  });

  // Get organs by type
  ipcMain.handle('organs:getByType', async (event, type) => {
    return OrganService.getOrgansByType(type);
  });

  // Create organ
  ipcMain.handle('organs:create', async (event, organData) => {
    return OrganService.createOrgan(organData);
  });

  // Update organ
  ipcMain.handle('organs:update', async (event, id, organData) => {
    return OrganService.updateOrgan(id, organData);
  });

  // Delete organ
  ipcMain.handle('organs:delete', async (event, id) => {
    return OrganService.deleteOrgan(id);
  });
}

module.exports = { registerOrganRoutes };
