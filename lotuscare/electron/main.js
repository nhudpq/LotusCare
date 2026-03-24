const { app: electronApp, BrowserWindow } = require("electron");
const express = require("express");
const db = require("./src/config/db");
const { registerPatientRoutes } = require("./src/modules/patients/patient.routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Create Express app for API/Swagger
const server = express();
const PORT = 3000;

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Optional: If you want to expose API endpoints over HTTP too
// server.get('/api/patients', ...);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadURL("http://localhost:5173");
}

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