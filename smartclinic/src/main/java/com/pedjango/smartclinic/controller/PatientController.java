package com.pedjango.smartclinic.controller;

import com.pedjango.smartclinic.dto.AppointmentDTO;
import com.pedjango.smartclinic.dto.Login;
import com.pedjango.smartclinic.models.Patient;
import com.pedjango.smartclinic.service.PatientService;
import com.pedjango.smartclinic.service.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getPatient(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        Patient patient = patientService.getPatientDetails(token);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found.");
        }

        return ResponseEntity.ok(patient);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        if (!service.validatePatient(patient)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Patient already exists with given email or phone.");
        }

        int result = patientService.createPatient(patient);
        return switch (result) {
            case 1 -> ResponseEntity.status(HttpStatus.CREATED).body("Patient registered successfully.");
            case 0 -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving patient.");
            default -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unexpected error.");
        };
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return service.validatePatientLogin(login.getEmail(), login.getPassword());
    }

    @GetMapping("/appointments/{patientId}/{user}/{token}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId,
                                                    @PathVariable String user,
                                                    @PathVariable String token) {
        if (service.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        List<AppointmentDTO> appointments = patientService.getPatientAppointment(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/filter")
    public ResponseEntity<?> filterPatientAppointment(@RequestParam(required = false) String condition,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam String token) {
        if (service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        List<AppointmentDTO> filtered = service.filterPatient(token, condition, name);
        return ResponseEntity.ok(filtered);
    }
}
