const PatientRepository = require('./patient.repository');

class PatientService {
  static async getAllPatients() {
    return PatientRepository.getAllPatients();
  }

  static async getPatientById(id) {
    return PatientRepository.getPatientById(id);
  }

  static async createPatient(patientData) {
    return PatientRepository.createPatient(patientData);
  }

  static async updatePatient(id, patientData) {
    return PatientRepository.updatePatient(id, patientData);
  }

  static async deletePatient(id) {
    return PatientRepository.deletePatient(id);
  }

  static async searchPatients(query) {
    return PatientRepository.searchPatients(query);
  }
}

module.exports = PatientService;
