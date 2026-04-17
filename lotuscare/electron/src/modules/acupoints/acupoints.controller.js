const AcupointService = require('./acupoints.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     AcupointInput:
 *       type: object
 *       required:
 *         - code
 *         - name_vi
 *         - meridian_id
 *       properties:
 *         code:
 *           type: string
 *           description: Acupoint code (e.g., "LU1", "LI4")
 *           example: "LI4"
 *         name_vi:
 *           type: string
 *           description: Vietnamese name of the acupoint
 *           example: "Hợp Cốc"
 *         meridian_id:
 *           type: integer
 *           description: Meridian ID this acupoint belongs to
 *           example: 2
 *         location:
 *           type: string
 *           description: Location description
 *           example: "Giữa công ngón cái và ngón trỏ"
 *         indication:
 *           type: string
 *           description: Indication/conditions this point treats
 *           example: "Đau đầu, mặt mủ, sốt, mệt"
 *     Acupoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         code:
 *           type: string
 *         name_vi:
 *           type: string
 *         meridian_id:
 *           type: integer
 *         location:
 *           type: string
 *         indication:
 *           type: string
 *         is_deleted:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Acupoints
 *   description: Acupoints (Huyệt) managing API
 */

/**
 * @swagger
 * /api/acupoints:
 *   get:
 *     summary: Get all acupoints
 *     tags: [Acupoints]
 *     responses:
 *       200:
 *         description: List of all acupoints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Acupoint'
 *   post:
 *     summary: Create a new acupoint
 *     tags: [Acupoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcupointInput'
 *     responses:
 *       200:
 *         description: Created acupoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Acupoint'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/acupoints/{id}:
 *   get:
 *     summary: Get acupoint by ID
 *     tags: [Acupoints]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Acupoint details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Acupoint'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update acupoint by ID
 *     tags: [Acupoints]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcupointInput'
 *     responses:
 *       200:
 *         description: Updated acupoint
 *   delete:
 *     summary: Delete acupoint by ID
 *     tags: [Acupoints]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Deletion successful
 */

/**
 * @swagger
 * /api/acupoints/code/{code}:
 *   get:
 *     summary: Get acupoint by code
 *     tags: [Acupoints]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Acupoint details
 */

/**
 * @swagger
 * /api/acupoints/meridian/{meridianId}:
 *   get:
 *     summary: Get acupoints by meridian
 *     tags: [Acupoints]
 *     parameters:
 *       - in: path
 *         name: meridianId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of acupoints for the meridian
 */

/**
 * @swagger
 * /api/acupoints/search?q=query:
 *   get:
 *     summary: Search acupoints by code, name, or indication
 *     tags: [Acupoints]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Search results
 */

class AcupointController {
  static async getAll(req, res) {
    try {
      const acupoints = await AcupointService.getAllAcupoints();
      res.json(acupoints);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const acupoint = await AcupointService.getAcupointById(req.params.id);
      res.json(acupoint);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getByCode(req, res) {
    try {
      const acupoint = await AcupointService.getAcupointByCode(req.params.code);
      res.json(acupoint);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getByMeridian(req, res) {
    try {
      const acupoints = await AcupointService.getAcupointsByMeridian(req.params.meridianId);
      res.json(acupoints);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required' });
      }
      const acupoints = await AcupointService.searchAcupoints(q);
      res.json(acupoints);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const acupoint = await AcupointService.createAcupoint(req.body);
      res.json(acupoint);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const acupoint = await AcupointService.updateAcupoint(req.params.id, req.body);
      res.json(acupoint);
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
      const result = await AcupointService.deleteAcupoint(req.params.id);
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

module.exports = AcupointController;
