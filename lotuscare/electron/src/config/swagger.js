const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LotusCare API',
      version: '1.0.0',
      description: 'API documentation for LotusCare application'
    },
  },
  // Ensure we use forward slashes for Windows compatibility with glob patterns
  apis: [path.join(__dirname, '../modules/**/*.js').replace(/\\/g, '/')], 
};

const swaggerSpec = swaggerJsdoc(options);
console.log('Swagger Spec Components:', Object.keys(swaggerSpec.components?.schemas || {}));

module.exports = swaggerSpec;