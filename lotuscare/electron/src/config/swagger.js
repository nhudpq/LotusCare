const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient API',
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, '../modules/patients/patient.controller.js')], 
};

const swaggerSpec = swaggerJsdoc(options);
console.log('Swagger Spec Components:', Object.keys(swaggerSpec.components?.schemas || {}));

module.exports = swaggerSpec;