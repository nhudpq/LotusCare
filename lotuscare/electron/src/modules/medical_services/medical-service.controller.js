const MedicalServiceService = require('./medical-service.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalServiceInput:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - price
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code of the medical service
 *         name:
 *           type: string
 *           description: The name of the medical service
 *         description:
 *           type: string
 *           description: The description of the medical service
 *         price:
 *           type: number
 *           description: The price of the medical service
 *         duration_minutes:
 *           type: integer
 *           description: The duration of the medical service in minutes
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the medical service
 *       example:
 *         code: "SRV001"
 *         name: "General Checkup"
 *         description: "Basic general health checkup"
 *         price: 150000
 *         duration_minutes: 30
 *         status: "active"
 *     MedicalService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *           description: The auto-generated id of the medical service
 *         code:
 *           type: string
 *           description: The unique code of the medical service
 *         name:
 *           type: string
 *           description: The name of the medical service
 *         description:
 *           type: string
 *           description: The description of the medical service
 *         price:
 *           type: number
 *           description: The price of the medical service
 *         duration_minutes:
 *           type: integer
 *           description: The duration of the medical service in minutes
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the medical service
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: The date the medical service was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: The date the medical service was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Medical Services
 *   description: The medical services managing API
 */

/**
 * @swagger
 * /api/medical-services:
 *   get:
 *     summary: Returns the list of all the medical services
 *     tags: [Medical Services]
 *     responses:
 *       200:
 *         description: The list of the medical services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MedicalService'
 *   post:
 *     summary: Create a new medical service
 *     tags: [Medical Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalServiceInput'
 *     responses:
 *       200:
 *         description: The created medical service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalService'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/medical-services/{id}:
 *   get:
 *     summary: Get the medical service by id
 *     tags: [Medical Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The medical service id
 *     responses:
 *       200:
 *         description: The medical service description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalService'
 *       404:
 *         description: The medical service was not found
 *   put:
 *     summary: Update the medical service by the id
 *     tags: [Medical Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The medical service id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalServiceInput'
 *     responses:
 *       200:
 *         description: The medical service was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalService'
 *       404:
 *         description: The medical service was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the medical service by id
 *     tags: [Medical Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The medical service id
 *     responses:
 *       200:
 *         description: The medical service was deleted
 *       404:
 *         description: The medical service was not found
 */

class MedicalServiceController {
  static async getAll(req, res) {
    try {
      const services = await MedicalServiceService.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const service = await MedicalServiceService.getServiceById(req.params.id);
      res.json(service);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async create(req, res) {
    try {
      const service = await MedicalServiceService.createService(req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const service = await MedicalServiceService.updateService(req.params.id, req.body);
      res.json(service);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async delete(req, res) {
    try {
      const result = await MedicalServiceService.deleteService(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = MedicalServiceController;
