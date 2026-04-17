const { app: electronApp, BrowserWindow } = require("electron");
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");
const { registerPatientRoutes } = require("./src/modules/patients/patient.routes");
const { registerMedicalServiceRoutes } = require("./src/modules/medical_services/medical-service.routes");
const { registerHerbalFormulaRoutes } = require("./src/modules/herbal_formulas/herbal-formulas.routes");
const { registerMeridianRoutes } = require("./src/modules/meridians/meridians.routes");
const { registerOrganRoutes } = require("./src/modules/organs/organs.routes");
const { registerAcupointRoutes } = require("./src/modules/acupoints/acupoints.routes");
const PatientController = require("./src/modules/patients/patient.controller");
const MedicalServiceController = require("./src/modules/medical_services/medical-service.controller");
const HerbalFormulaController = require("./src/modules/herbal_formulas/herbal-formulas.controller");
const MeridianController = require("./src/modules/meridians/meridians.controller");
const OrganController = require("./src/modules/organs/organs.controller");
const AcupointController = require("./src/modules/acupoints/acupoints.controller");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Create Express app for API/Swagger
const server = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200,
};

// Enable CORS middleware
server.use(cors(corsOptions));

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

// API Endpoints - Herbal Formulas
server.get('/api/herbal-formulas', HerbalFormulaController.getAll);
server.get('/api/herbal-formulas/:id', HerbalFormulaController.getById);
server.post('/api/herbal-formulas', HerbalFormulaController.create);
server.put('/api/herbal-formulas/:id', HerbalFormulaController.update);
server.delete('/api/herbal-formulas/:id', HerbalFormulaController.delete);

// API Endpoints - Meridians
server.get('/api/meridians', MeridianController.getAll);
server.get('/api/meridians/organ/:organId', MeridianController.getByOrgan);
server.get('/api/meridians/:id', MeridianController.getById);
server.post('/api/meridians', MeridianController.create);
server.put('/api/meridians/:id', MeridianController.update);
server.delete('/api/meridians/:id', MeridianController.delete);

// API Endpoints - Organs
server.get('/api/organs', OrganController.getAll);
server.get('/api/organs/type/:type', OrganController.getByType);
server.get('/api/organs/:id', OrganController.getById);
server.post('/api/organs', OrganController.create);
server.put('/api/organs/:id', OrganController.update);
server.delete('/api/organs/:id', OrganController.delete);

// API Endpoints - Acupoints
server.get('/api/acupoints', AcupointController.getAll);
server.get('/api/acupoints/code/:code', AcupointController.getByCode);
server.get('/api/acupoints/meridian/:meridianId', AcupointController.getByMeridian);
server.get('/api/acupoints/search', AcupointController.search);
server.get('/api/acupoints/:id', AcupointController.getById);
server.post('/api/acupoints', AcupointController.create);
server.put('/api/acupoints/:id', AcupointController.update);
server.delete('/api/acupoints/:id', AcupointController.delete);

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
  registerHerbalFormulaRoutes();
  registerMeridianRoutes();
  registerOrganRoutes();
  registerAcupointRoutes();
  
  // Start Express server
  server.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
  
  // Create window
  createWindow();
});