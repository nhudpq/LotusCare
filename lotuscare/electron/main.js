const { app: electronApp, BrowserWindow } = require("electron");
const express = require("express");
const db = require("./src/config/db");
const { registerPatientRoutes } = require("./src/modules/patients/patient.routes");
const PatientController = require("./src/modules/patients/patient.controller"); // Import Controller
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Create Express app for API/Swagger
const server = express();
server.use(express.json()); // Add JSON parsing
const PORT = 3000;

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Endpoints
server.get('/api/patients', PatientController.getAll);
server.get('/api/patients/search', PatientController.search);
server.get('/api/patients/:id', PatientController.getById);
server.post('/api/patients', PatientController.create);
server.put('/api/patients/:id', PatientController.update);
server.delete('/api/patients/:id', PatientController.delete);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadURL("http://localhost:5173");
}

const { app } = require("electron");



electronApp.whenReady().then(() => {
  // Initialize database
  console.log("Database initialized");
  
  // Register IPC routes
  registerPatientRoutes();
  
  // Start Express server
  server.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
  
  // Create window
  createWindow();
});