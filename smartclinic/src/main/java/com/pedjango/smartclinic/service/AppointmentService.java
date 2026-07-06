package com.pedjango.smartclinic.service;

import com.pedjango.smartclinic.models.Appointment;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.models.Patient;
import com.pedjango.smartclinic.repository.AppointmentRepository;
import com.pedjango.smartclinic.repository.DoctorRepository;
import com.pedjango.smartclinic.repository.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final TokenService tokenService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public int bookAppointment(Appointment appointment, String token) {
        try {
            String userEmail = tokenService.extractSubject(token);
            Patient patient = patientRepository.findByEmail(userEmail);
            Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Transactional
    public String updateAppointment(Long appointmentId, Appointment updatedAppointment, Long patientId) {
        Optional<Appointment> optional = appointmentRepository.findById(appointmentId);
        if (optional.isEmpty()) return "Appointment not found";

        Appointment existing = optional.get();
        if (!existing.getPatient().getId().equals(patientId)) {
            return "Unauthorized access";
        }

        LocalDateTime newTime = updatedAppointment.getAppointmentTime();
        Long doctorId = updatedAppointment.getDoctor().getId();

        List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                doctorId,
                newTime.minusMinutes(59),
                newTime.plusMinutes(59)
        );

        if (!conflicts.isEmpty()) return "Doctor is not available at the selected time";

        existing.setDoctor(updatedAppointment.getDoctor());
        existing.setAppointmentTime(updatedAppointment.getAppointmentTime());
        existing.setStatus(updatedAppointment.getStatus());

        appointmentRepository.save(existing);
        return "Appointment updated successfully";
    }

    @Transactional
    public String cancelAppointment(Long appointmentId, Long patientId) {
        Optional<Appointment> optional = appointmentRepository.findById(appointmentId);
        if (optional.isEmpty()) return "Appointment not found";

        Appointment appointment = optional.get();
        if (!appointment.getPatient().getId().equals(patientId)) {
            return "Unauthorized cancellation";
        }

        appointmentRepository.delete(appointment);
        return "Appointment canceled successfully";
    }

    @Transactional
    public List<Appointment> getAppointmentsForDoctorOnDate(Long doctorId, LocalDate date, String patientName) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        if (patientName != null && !patientName.isEmpty()) {
            return appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                    doctorId, patientName, start, end
            );
        } else {
            return appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                    doctorId, start, end
            );
        }
    }

    @Transactional
    public List<Appointment> getAppointmentsForPatient(String patientName, LocalDate date) {
        if (date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = start.plusDays(1);
            return appointmentRepository.findByPatientNameIgnoreCaseAndAppointmentTimeBetween(patientName, start, end);
        }
        return appointmentRepository.findByPatientNameIgnoreCase(patientName);
    }

    @Transactional
    public void changeAppointmentStatus(Long appointmentId, int status) {
        appointmentRepository.updateStatus(status, appointmentId);
    }
}
