const { app: electronApp, BrowserWindow } = require("electron");
const express = require("express");
const db = require("./src/config/db");
const { registerPatientRoutes } = require("./src/modules/patients/patient.routes");
const { registerMedicalServiceRoutes } = require("./src/modules/medical_services/medical-service.routes");
const PatientController = require("./src/modules/patients/patient.controller"); // Import Controller
const MedicalServiceController = require("./src/modules/medical_services/medical-service.controller");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Create Express app for API/Swagger
const server = express();
server.use(express.json()); // Add JSON parsing
server.use(express.urlencoded({ extended: true })); // Add form parsing for Swagger UI inputs
const PORT = 3000;

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Endpoints - Patients
server.get('/api/patients', PatientController.getAll);
server.get('/api/patients/search', PatientController.search);
server.get('/api/patients/:id', PatientController.getById);
server.post('/api/patients', PatientController.create);
server.put('/api/patients/:id', PatientController.update);
server.delete('/api/patients/:id', PatientController.delete);

// API Endpoints - Medical Services
server.get('/api/medical-services', MedicalServiceController.getAll);
server.get('/api/medical-services/:id', MedicalServiceController.getById);
server.post('/api/medical-services', MedicalServiceController.create);
server.put('/api/medical-services/:id', MedicalServiceController.update);
server.delete('/api/medical-services/:id', MedicalServiceController.delete);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadURL("http://localhost:5173");
  win.setMenuBarVisibility(false)
}



const { app } = require("electron");



electronApp.whenReady().then(() => {
  // Initialize database
  console.log("Database initialized");
  
  // Register IPC routes
  registerPatientRoutes();
  registerMedicalServiceRoutes();
  
  // Start Express server
  server.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
  
  // Create window
  createWindow();
});