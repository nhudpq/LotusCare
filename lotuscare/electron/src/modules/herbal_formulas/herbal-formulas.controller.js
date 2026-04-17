const HerbalFormulaService = require('./herbal-formulas.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     HerbalFormulaInput:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - price
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code of the herbal formula
 *         name:
 *           type: string
 *           description: The name of the herbal formula
 *         description:
 *           type: string
 *           description: The description of the herbal formula
 *         ingredients:
 *           type: string
 *           description: List of ingredients in the herbal formula
 *         usage_instructions:
 *           type: string
 *           description: Instructions on how to use the herbal formula
 *         dosage:
 *           type: string
 *           description: Recommended dosage for the herbal formula
 *         price:
 *           type: number
 *           description: The price of the herbal formula
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the herbal formula
 *       example:
 *         code: "HF001"
 *         name: "Linh Chi Tâm Bình"
 *         description: "Herbal formula for mental relaxation"
 *         ingredients: "Linh chi, Mỏ đất, Lựu hạt"
 *         usage_instructions: "Sử dụng 1 gói mỗi ngày trước khi ngủ"
 *         dosage: "1 gói x 2.5g"
 *         price: 250000
 *         status: "active"
 *     HerbalFormula:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *           description: The auto-generated id of the herbal formula
 *         code:
 *           type: string
 *           description: The unique code of the herbal formula
 *         name:
 *           type: string
 *           description: The name of the herbal formula
 *         description:
 *           type: string
 *           description: The description of the herbal formula
 *         ingredients:
 *           type: string
 *           description: List of ingredients in the herbal formula
 *         usage_instructions:
 *           type: string
 *           description: Instructions on how to use the herbal formula
 *         dosage:
 *           type: string
 *           description: Recommended dosage for the herbal formula
 *         price:
 *           type: number
 *           description: The price of the herbal formula
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the herbal formula
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: The date the herbal formula was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: The date the herbal formula was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Herbal Formulas
 *   description: The herbal formulas managing API
 */

/**
 * @swagger
 * /api/herbal-formulas:
 *   get:
 *     summary: Returns the list of all the herbal formulas
 *     tags: [Herbal Formulas]
 *     responses:
 *       200:
 *         description: The list of the herbal formulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HerbalFormula'
 *   post:
 *     summary: Create a new herbal formula
 *     tags: [Herbal Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HerbalFormulaInput'
 *     responses:
 *       200:
 *         description: The created herbal formula
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HerbalFormula'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/herbal-formulas/{id}:
 *   get:
 *     summary: Get the herbal formula by id
 *     tags: [Herbal Formulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The herbal formula id
 *     responses:
 *       200:
 *         description: The herbal formula description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HerbalFormula'
 *       404:
 *         description: The herbal formula was not found
 *   put:
 *     summary: Update the herbal formula by the id
 *     tags: [Herbal Formulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The herbal formula id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HerbalFormulaInput'
 *     responses:
 *       200:
 *         description: The herbal formula was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HerbalFormula'
 *       404:
 *         description: The herbal formula was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the herbal formula by id
 *     tags: [Herbal Formulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The herbal formula id
 *     responses:
 *       200:
 *         description: The herbal formula was deleted
 *       404:
 *         description: The herbal formula was not found
 */

class HerbalFormulaController {
  static async getAll(req, res) {
    try {
      const formulas = await HerbalFormulaService.getAllFormulas();
      res.json(formulas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const formula = await HerbalFormulaService.getFormulaById(req.params.id);
      res.json(formula);
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
      const formula = await HerbalFormulaService.createFormula(req.body);
      res.json(formula);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const formula = await HerbalFormulaService.updateFormula(req.params.id, req.body);
      res.json(formula);
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
      const result = await HerbalFormulaService.deleteFormula(req.params.id);
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

module.exports = HerbalFormulaController;

