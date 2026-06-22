package com.pedjango.smartclinic.controller;

import com.pedjango.smartclinic.dto.Login;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.service.DoctorService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final Service service;

    public DoctorController(DoctorService doctorService, Service service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(
            @PathVariable String user,
            @PathVariable Long doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String token
    ) {
        if (!service.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        List<?> availableSlots = doctorService.getDoctorAvailability(doctorId, Date.valueOf(date));
        return ResponseEntity.ok(Map.of("availableSlots", availableSlots));
    }

    @GetMapping
    public ResponseEntity<?> getDoctor() {
        List<Doctor> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    @PostMapping("/register/{token}")
    public ResponseEntity<?> saveDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }

        int result = doctorService.saveDoctor(doctor);
        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.CONFLICT).body("Doctor with email already exists.");
            case 1 -> ResponseEntity.status(HttpStatus.CREATED).body("Doctor registered successfully.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while registering doctor.");
        };
    }

    @PostMapping("/login")
    public ResponseEntity<?> doctorLogin(@RequestBody Login login) {
        String token = doctorService.validateDoctor(login.getEmail(), login.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PutMapping("/update/{token}/{doctorId}")
    public ResponseEntity<?> updateDoctor(@RequestBody Doctor updatedDoctor,
                                          @PathVariable String token,
                                          @PathVariable Long doctorId) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }

        int result = doctorService.updateDoctor(doctorId, updatedDoctor);
        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found.");
            case 1 -> ResponseEntity.ok("Doctor updated successfully.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating doctor.");
        };
    }

    @DeleteMapping("/delete/{token}/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String token, @PathVariable Long doctorId) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }

        int result = doctorService.deleteDoctor(doctorId);
        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found.");
            case 1 -> ResponseEntity.ok("Doctor and associated appointments deleted successfully.");
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while deleting doctor.");
        };
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterDoctor(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) String specialty
    ) {
        List<Doctor> doctors = service.filterDoctor(name, specialty, time);
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }
}
