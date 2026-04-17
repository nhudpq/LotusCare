const MeridianService = require('./meridians.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     MeridianInput:
 *       type: object
 *       required:
 *         - name_vi
 *       properties:
 *         name_vi:
 *           type: string
 *           description: Vietnamese name of the meridian
 *           example: "Kinh Thái Âm Phế"
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Meridian type - 0=Primary meridians, 1=Extra meridians
 *           example: 0
 *         organ_id:
 *           type: integer
 *           description: Related organ ID
 *           example: 1
 *     Meridian:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: The auto-generated id of the meridian
 *         name_vi:
 *           type: string
 *           description: Vietnamese name of the meridian
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Meridian type (0=Primary, 1=Extra)
 *         organ_id:
 *           type: integer
 *           description: Related organ ID
 *         is_deleted:
 *           type: integer
 *           description: Soft delete flag
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
 *   name: Meridians
 *   description: TCM Meridians managing API
 */

/**
 * @swagger
 * /api/meridians:
 *   get:
 *     summary: Returns the list of all meridians
 *     tags: [Meridians]
 *     responses:
 *       200:
 *         description: The list of all meridians
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meridian'
 *   post:
 *     summary: Create a new meridian
 *     tags: [Meridians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeridianInput'
 *     responses:
 *       200:
 *         description: The created meridian
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meridian'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/meridians/{id}:
 *   get:
 *     summary: Get the meridian by id
 *     tags: [Meridians]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The meridian id
 *     responses:
 *       200:
 *         description: The meridian by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meridian'
 *       404:
 *         description: The meridian was not found
 *   put:
 *     summary: Update the meridian by id
 *     tags: [Meridians]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The meridian id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeridianInput'
 *     responses:
 *       200:
 *         description: The updated meridian
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meridian'
 *       404:
 *         description: The meridian was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the meridian by id
 *     tags: [Meridians]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The meridian id
 *     responses:
 *       200:
 *         description: The meridian was deleted
 *       404:
 *         description: The meridian was not found
 */

/**
 * @swagger
 * /api/meridians/organ/{organId}:
 *   get:
 *     summary: Get meridians by organ id
 *     tags: [Meridians]
 *     parameters:
 *       - in: path
 *         name: organId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The organ id
 *     responses:
 *       200:
 *         description: The list of meridians for the organ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meridian'
 */

class MeridianController {
  static async getAll(req, res) {
    try {
      const meridians = await MeridianService.getAllMeridians();
      res.json(meridians);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const meridian = await MeridianService.getMeridianById(req.params.id);
      res.json(meridian);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getByOrgan(req, res) {
    try {
      const meridians = await MeridianService.getMeridiansByOrgan(req.params.organId);
      res.json(meridians);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const meridian = await MeridianService.createMeridian(req.body);
      res.json(meridian);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const meridian = await MeridianService.updateMeridian(req.params.id, req.body);
      res.json(meridian);
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
      const result = await MeridianService.deleteMeridian(req.params.id);
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

module.exports = MeridianController;
