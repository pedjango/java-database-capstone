package com.pedjango.smartclinic.controller;

import com.pedjango.smartclinic.models.Appointment;
import com.pedjango.smartclinic.service.AppointmentService;
import com.pedjango.smartclinic.service.Service;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String patientName,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        Long doctorId = service.validateDoctorId(token);
        if (doctorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Doctor ID missing or invalid.");
        }

        List<Appointment> appointments = appointmentService.getAppointmentsForDoctorOnDate(doctorId, date, patientName);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient")
    public ResponseEntity<?> getAppointmentsForPatient(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        String patientName = service.extractPatientName(token);
        if (patientName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Patient isn't authorized.");
        }

        List<Appointment> appointments = appointmentService.getAppointmentsForPatient(patientName, date);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{appointmentId}/details")
    public ResponseEntity<?> getAppointmentDetails(
            @PathVariable("appointmentId") Long appointmentId,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        Long doctorId = service.validateDoctorId(token);
        if (doctorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Doctor ID missing or invalid.");
        }

        Appointment appointment = appointmentService.getAppointmentById(appointmentId, doctorId, null);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/patient/{appointmentId}/details")
    public ResponseEntity<?> getAppointmentDetailsForPatient(
            @PathVariable("appointmentId") Long appointmentId,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        String patientName = service.extractPatientName(token);
        if (patientName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Patient isn't authorized.");
        }

        Appointment appointment = appointmentService.getAppointmentById(appointmentId, null, patientName);
        return ResponseEntity.ok(appointment);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(
            @RequestBody Appointment appointment,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        int validationCode = service.validateAppointment(appointment.getDoctor().getId(), appointment.getAppointmentTime().toLocalDate(), appointment.getAppointmentTime().toLocalTime());

        if (validationCode == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Doctor not found.");
        } else if (validationCode == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Appointment slot is not available.");
        }

        int result = appointmentService.bookAppointment(appointment, token);
        return result == 1
                ? ResponseEntity.status(HttpStatus.CREATED).body("Appointment booked successfully.")
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to book appointment.");
    }

    @PutMapping("/update/{appointmentId}/{patientId}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long patientId,
            @RequestBody Appointment updatedAppointment,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient") && service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        String result = appointmentService.updateAppointment(appointmentId, updatedAppointment, patientId);

        return result.equals("Appointment updated successfully")
                ? ResponseEntity.ok(result)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @DeleteMapping("/cancel/{appointmentId}/{patientId}")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long patientId,
            @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing authorization token.");
        }

        String token = authorizationHeader.substring(7);

        if (service.validateToken(token, "patient") && service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        String result = appointmentService.cancelAppointment(appointmentId, patientId);
        return result.equals("Appointment canceled successfully")
                ? ResponseEntity.ok(result)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
