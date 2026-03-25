const PatientService = require('./patient.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientInput:
 *       type: object
 *       required:
 *         - ma_bn
 *         - ho_ten
 *       properties:
 *         ma_bn:
 *           type: string
 *           description: Mã bệnh nhân (Unique)
 *         ho_ten:
 *           type: string
 *           description: Họ và tên
 *         gioi_tinh:
 *           type: integer
 *           description: Giới tính (1: Nam, 0: Nữ)
 *         ngay_sinh:
 *           type: string
 *           format: date
 *           description: Ngày sinh (YYYYMMDD or similar)
 *         ma_quoc_tich:
 *           type: string
 *           description: Mã quốc tịch
 *         so_cmnd:
 *           type: string
 *           description: Số CMND/CCCD
 *         ho_ten_cha:
 *           type: string
 *           description: Họ tên cha
 *         ho_ten_ncs:
 *           type: string
 *           description: Họ tên người chăm sóc
 *         phone:
 *           type: string
 *           description: Số điện thoại
 *         father_phone:
 *           type: string
 *           description: Số điện thoại cha
 *         email:
 *           type: string
 *           description: Email
 *         tinh:
 *           type: string
 *           description: Mã tỉnh/thành phố
 *         huyen:
 *           type: string
 *           description: Mã quận/huyện
 *         xa:
 *           type: string
 *           description: Mã xã/phường
 *         dia_chi:
 *           type: string
 *           description: Địa chỉ chi tiết
 *         tien_su_benh:
 *           type: string
 *           description: Tiền sử bệnh
 *         di_ung:
 *           type: string
 *           description: Dị ứng
 *         hinh_anh:
 *           type: string
 *           description: Hình ảnh
 *         ghi_chu:
 *           type: string
 *           description: Ghi chú
 *     Patient:
 *       type: object
 *       required:
 *         - ma_bn
 *         - ho_ten
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: The auto-generated id of the patient
 *         ma_bn:
 *           type: string
 *           description: Mã bệnh nhân (Unique)
 *         ho_ten:
 *           type: string
 *           description: Họ và tên
 *         gioi_tinh:
 *           type: integer
 *           description: Giới tính (1: Nam, 0: Nữ)
 *         ngay_sinh:
 *           type: string
 *           format: date
 *           description: Ngày sinh (YYYYMMDD or similar)
 *         ma_quoc_tich:
 *           type: string
 *           description: Mã quốc tịch
 *         so_cmnd:
 *           type: string
 *           description: Số CMND/CCCD
 *         ho_ten_cha:
 *           type: string
 *           description: Họ tên cha
 *         ho_ten_ncs:
 *           type: string
 *           description: Họ tên người chăm sóc
 *         phone:
 *           type: string
 *           description: Số điện thoại
 *         father_phone:
 *           type: string
 *           description: Số điện thoại cha
 *         email:
 *           type: string
 *           description: Email
 *         tinh:
 *           type: string
 *           description: Mã tỉnh/thành phố
 *         huyen:
 *           type: string
 *           description: Mã quận/huyện
 *         xa:
 *           type: string
 *           description: Mã xã/phường
 *         dia_chi:
 *           type: string
 *           description: Địa chỉ chi tiết
 *         tien_su_benh:
 *           type: string
 *           description: Tiền sử bệnh
 *         di_ung:
 *           type: string
 *           description: Dị ứng
 *         hinh_anh:
 *           type: string
 *           description: Hình ảnh
 *         ghi_chu:
 *           type: string
 *           description: Ghi chú
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Update timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: The patients managing API
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Returns the list of all the patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: The list of the patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       200:
 *         description: The created patient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get the patient by id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient id
 *     responses:
 *       200:
 *         description: The patient description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: The patient was not found
 *   put:
 *     summary: Update the patient by the id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       200:
 *         description: The patient was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: The patient was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the patient by id
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient id
 *     responses:
 *       200:
 *         description: The patient was deleted
 *       404:
 *         description: The patient was not found
 */

class PatientController {
  static async getAll(req, res) {
    try {
      const patients = await PatientService.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);
      res.json(patient);
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
      const patient = await PatientService.createPatient(req.body);
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const patient = await PatientService.updatePatient(req.params.id, req.body);
      res.json(patient);
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
      const result = await PatientService.deletePatient(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
  
  static async search(req, res) {
      try {
          const { query } = req.query;
          const patients = await PatientService.searchPatients(query);
          res.json(patients);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }
}

module.exports = PatientController;
