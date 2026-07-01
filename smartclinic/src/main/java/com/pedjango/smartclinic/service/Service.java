package com.pedjango.smartclinic.service;

import com.pedjango.smartclinic.dto.AppointmentDTO;
import com.pedjango.smartclinic.models.Admin;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.models.Patient;
import com.pedjango.smartclinic.repository.AdminRepository;
import com.pedjango.smartclinic.repository.DoctorRepository;
import com.pedjango.smartclinic.repository.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@org.springframework.stereotype.Service
public class Service {
    public final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Service(TokenService tokenService,
                   AdminRepository adminRepository,
                   DoctorRepository doctorRepository,
                   PatientRepository patientRepository,
                   DoctorService doctorService,
                   PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public boolean validateToken(String token, String role) {
        try {
            return !tokenService.validateToken(token, role);
        } catch (Exception e) {
            log.error(e.getMessage());
            return true;
        }
    }

    public ResponseEntity<?> validateAdmin(String username, String password) {
        try {
            Admin admin = adminRepository.findByUsername(username);
            if (admin == null || !admin.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password.");
            }
            String token = tokenService.generateToken(admin.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed due to an internal error.");
        }
    }

    public List<Doctor> filterDoctor(String name, String specialty, String time) {
        if (name != null && specialty != null && time != null) {
            return doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
        } else if (name != null && specialty != null) {
            return doctorService.filterDoctorByNameAndSpecialty(name, specialty);
        } else if (name != null && time != null) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        } else if (specialty != null && time != null) {
            return doctorService.filterDoctorByTimeAndSpecialty(specialty, time);
        } else if (name != null) {
            return doctorService.findDoctorByName(name);
        } else if (specialty != null) {
            return doctorService.filterDoctorBySpecialty(specialty);
        } else if (time != null) {
            return doctorService.filterDoctorsByTime(time);
        } else {
            return doctorService.getDoctors();
        }
    }

    @SuppressWarnings("unlikely-arg-type")
    public int validateAppointment(Long doctorId, LocalDate date, LocalTime time) {
        Optional<Doctor> optional = doctorRepository.findById(doctorId);
        if (optional.isEmpty()) return -1;

        List<String> availableSlots = doctorService.getDoctorAvailability(doctorId, java.sql.Date.valueOf(date));
        return availableSlots.contains(String.valueOf(time)) ? 1 : 0;
    }

    public boolean validatePatient(Patient patient) {
        return patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null;
    }

    public ResponseEntity<?> validatePatientLogin(String email, String password) {
        try {
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null || !patient.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password.");
            }
            String token = tokenService.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed due to an internal error.");
        }
    }

    public List<AppointmentDTO> filterPatient(String token, String condition, String doctorName) {
        try {
            String email = tokenService.extractSubject(token);
            Patient patient = patientRepository.findByEmail(email);

            if (patient == null) return List.of();

            Long patientId = patient.getId();

            if (condition != null && doctorName != null) {
                return patientService.filterByDoctorAndCondition(doctorName, patientId, condition);
            } else if (doctorName != null) {
                return patientService.filterByDoctor(doctorName, patientId);
            } else if (condition != null) {
                return patientService.filterByCondition(patientId, condition);
            } else {
                return patientService.getPatientAppointment(patientId);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public Long validateDoctorId(String subject) {
        String extracted = tokenService.extractSubject(subject);
        try {
            return doctorRepository.findIdByEmail(extracted.substring(7));
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
}
