const OrganService = require('./organs.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the organ (Vietnamese)
 *           example: "Tâm (Tim)"
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Organ type - 0=Tạng (Organs), 1=Phủ (Bowels)
 *           example: 0
 *     Organ:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: The auto-generated id of the organ
 *         name:
 *           type: string
 *           description: Name of the organ
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Organ type (0=Tạng, 1=Phủ)
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 */

/**
 * @swagger
 * tags:
 *   name: Organs
 *   description: TCM Organs (Tạng Phủ) managing API
 */

/**
 * @swagger
 * /api/organs:
 *   get:
 *     summary: Returns the list of all organs
 *     tags: [Organs]
 *     responses:
 *       200:
 *         description: The list of all organs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organ'
 *   post:
 *     summary: Create a new organ
 *     tags: [Organs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganInput'
 *     responses:
 *       200:
 *         description: The created organ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organ'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/organs/{id}:
 *   get:
 *     summary: Get the organ by id
 *     tags: [Organs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The organ id
 *     responses:
 *       200:
 *         description: The organ by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organ'
 *       404:
 *         description: The organ was not found
 *   put:
 *     summary: Update the organ by id
 *     tags: [Organs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The organ id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganInput'
 *     responses:
 *       200:
 *         description: The updated organ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organ'
 *       404:
 *         description: The organ was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the organ by id
 *     tags: [Organs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The organ id
 *     responses:
 *       200:
 *         description: The organ was deleted
 *       404:
 *         description: The organ was not found
 */

/**
 * @swagger
 * /api/organs/type/{type}:
 *   get:
 *     summary: Get organs by type
 *     tags: [Organs]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         required: true
 *         description: Organ type (0=Tạng, 1=Phủ)
 *     responses:
 *       200:
 *         description: The list of organs for the type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organ'
 */

class OrganController {
  static async getAll(req, res) {
    try {
      const organs = await OrganService.getAllOrgans();
      res.json(organs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const organ = await OrganService.getOrganById(req.params.id);
      res.json(organ);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getByType(req, res) {
    try {
      const organs = await OrganService.getOrgansByType(parseInt(req.params.type));
      res.json(organs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const organ = await OrganService.createOrgan(req.body);
      res.json(organ);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const organ = await OrganService.updateOrgan(req.params.id, req.body);
      res.json(organ);
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
      const result = await OrganService.deleteOrgan(req.params.id);
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

module.exports = OrganController;
