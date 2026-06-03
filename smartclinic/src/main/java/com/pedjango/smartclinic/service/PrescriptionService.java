package com.pedjango.smartclinic.service;

import com.pedjango.smartclinic.models.Prescription;
import com.pedjango.smartclinic.repository.PrescriptionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public ResponseEntity<?> savePrescription(Prescription prescription) {
        try {
            List<Prescription> existing = prescriptionRepository.findByAppointmentId(prescription.getAppointmentId());

            if (!existing.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Prescription already exists for this appointment.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            prescriptionRepository.save(prescription);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Prescription saved successfully.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to save prescription.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> getPrescription(Long appointmentId) {
        try {
            List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);

            if (prescriptions.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No prescription found for this appointment.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            Prescription prescription = prescriptions.get(0);
            Map<String, Object> response = new HashMap<>();
            response.put("prescription", prescription);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error retrieving prescription.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
