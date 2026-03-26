const { ipcMain } = require('electron');
const MedicalServiceService = require('./medical-service.service');

function registerMedicalServiceRoutes() {
  // Get all services
  ipcMain.handle('medical-services:getAll', async () => {
    return MedicalServiceService.getAllServices();
  });

  // Get service by ID
  ipcMain.handle('medical-services:getById', async (event, id) => {
    return MedicalServiceService.getServiceById(id);
  });

  // Create service
  ipcMain.handle('medical-services:create', async (event, serviceData) => {
    return MedicalServiceService.createService(serviceData);
  });

  // Update service
  ipcMain.handle('medical-services:update', async (event, id, serviceData) => {
    return MedicalServiceService.updateService(id, serviceData);
  });

  // Delete service
  ipcMain.handle('medical-services:delete', async (event, id) => {
    return MedicalServiceService.deleteService(id);
  });
}

module.exports = { registerMedicalServiceRoutes };
