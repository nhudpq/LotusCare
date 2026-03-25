const PatientModel = require('./patient.model');

class PatientRepository {
  static getAllPatients() {
    try {
      return PatientModel.getAll();
    } catch (error) {
      throw new Error(`Error fetching patients: ${error.message}`);
    }
  }

  static getPatientById(id) {
    try {
      const patient = PatientModel.getById(id);
      if (!patient) {
        throw new Error(`Patient with ID ${id} not found`);
      }
      return patient;
    } catch (error) {
      throw new Error(`Error fetching patient: ${error.message}`);
    }
  }

  static createPatient(patientData) {
    try {
      if (!patientData.ma_bn || !patientData.ho_ten) {
        throw new Error('Mã bệnh nhân and Họ tên are required');
      }
      const id = PatientModel.create(patientData);
      return PatientModel.getById(id);
    } catch (error) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  }

  static updatePatient(id, patientData) {
    try {
      if (!patientData.ho_ten) {
        throw new Error('Họ tên is required');
      }
      const updated = PatientModel.update(id, patientData);
      if (!updated) {
        throw new Error(`Patient with ID ${id} not found`);
      }
      return PatientModel.getById(id);
    } catch (error) {
      throw new Error(`Error updating patient: ${error.message}`);
    }
  }

  static deletePatient(id) {
    try {
      const deleted = PatientModel.delete(id);
      if (!deleted) {
        throw new Error(`Patient with ID ${id} not found`);
      }
      return { success: true, id };
    } catch (error) {
      throw new Error(`Error deleting patient: ${error.message}`);
    }
  }

  static searchPatients(query) {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query cannot be empty');
      }
      return PatientModel.search(query);
    } catch (error) {
      throw new Error(`Error searching patients: ${error.message}`);
    }
  }
}

module.exports = PatientRepository;
