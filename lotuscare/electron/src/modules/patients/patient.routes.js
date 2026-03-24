const { ipcMain } = require('electron');
const PatientService = require('./patient.service');

function registerPatientRoutes() {
  // Get all patients
  ipcMain.handle('patients:getAll', async () => {
    return PatientService.getAllPatients();
  });

  // Get patient by ID
  ipcMain.handle('patients:getById', async (event, id) => {
    return PatientService.getPatientById(id);
  });

  // Create patient
  ipcMain.handle('patients:create', async (event, patientData) => {
    return PatientService.createPatient(patientData);
  });

  // Update patient
  ipcMain.handle('patients:update', async (event, id, patientData) => {
    return PatientService.updatePatient(id, patientData);
  });

  // Delete patient
  ipcMain.handle('patients:delete', async (event, id) => {
    return PatientService.deletePatient(id);
  });

  // Search patients
  ipcMain.handle('patients:search', async (event, query) => {
    return PatientService.searchPatients(query);
  });
}

module.exports = { registerPatientRoutes };
