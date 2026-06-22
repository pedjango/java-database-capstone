package com.pedjango.smartclinic.service;

import com.pedjango.smartclinic.dto.AppointmentDTO;
import com.pedjango.smartclinic.models.Appointment;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.models.Patient;
import com.pedjango.smartclinic.repository.AppointmentRepository;
import com.pedjango.smartclinic.repository.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("unused")
@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public PatientService(PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          TokenService tokenService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Transactional
    public List<AppointmentDTO> getPatientAppointment(Long patientId) {
        try {
            List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
            return appointments.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    public List<AppointmentDTO> filterByCondition(Long patientId, String condition) {
        try {
            int status = condition.equalsIgnoreCase("past") ? 1 : condition.equalsIgnoreCase("future") ? 0 : -1;
            if (status == -1) throw new IllegalArgumentException("Invalid condition: must be 'past' or 'future'");
            List<Appointment> list = appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(patientId, status);
            return list.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    public List<AppointmentDTO> filterByDoctor(String doctorName, Long patientId) {
        try {
            List<Appointment> list = appointmentRepository.filterByDoctorNameAndPatientId(doctorName, patientId);
            return list.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    public List<AppointmentDTO> filterByDoctorAndCondition(String doctorName, Long patientId, String condition) {
        try {
            int status = condition.equalsIgnoreCase("past") ? 1 : condition.equalsIgnoreCase("future") ? 0 : -1;
            if (status == -1) throw new IllegalArgumentException("Invalid condition: must be 'past' or 'future'");

            List<Appointment> list = appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(doctorName, patientId, status);
            return list.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public Patient getPatientDetails(String token) {
        try {
            String email = tokenService.extractSubject(token);
            return patientRepository.findByEmail(email);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private AppointmentDTO convertToDTO(Appointment appointment) {
        Doctor doctor = appointment.getDoctor();
        Patient patient = appointment.getPatient();

        return new AppointmentDTO(
                appointment.getId(),
                doctor.getId(),
                doctor.getName(),
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getPhone(),
                patient.getAddress(),
                appointment.getAppointmentTime(),
                appointment.getStatus()
        );
    }
}
