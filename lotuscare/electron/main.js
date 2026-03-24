const { app, BrowserWindow } = require("electron");
const db = require("./src/config/db");
const { registerPatientRoutes } = require("./src/modules/patients/patient.routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadURL("http://localhost:5173");
}
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.whenReady().then(() => {
  // Initialize database
  console.log("Database initialized");
  
  // Register IPC routes
  registerPatientRoutes();
  
  // Create window
  createWindow();
});