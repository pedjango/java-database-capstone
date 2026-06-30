package com.pedjango.smartclinic.service;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.models.Appointment;
import com.pedjango.smartclinic.repository.AppointmentRepository;
import com.pedjango.smartclinic.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public DoctorService(DoctorRepository doctorRepository,
                         AppointmentRepository appointmentRepository,
                         TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public List<String> getDoctorAvailability(Long doctorId, Date date) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);
        if (optionalDoctor.isEmpty()) return Collections.emptyList();

        Doctor doctor = optionalDoctor.get();
        List<String> allSlots = doctor.getAvailableTimes();

        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(
                        doctorId,
                        new java.sql.Timestamp(date.getTime()).toLocalDateTime().withHour(0).withMinute(0),
                        new java.sql.Timestamp(date.getTime()).toLocalDateTime().withHour(23).withMinute(59)
                );

        Set<LocalTime> bookedSlots = bookedAppointments.stream()
                .map(appointment -> appointment.getAppointmentTime().toLocalTime())
                .collect(Collectors.toSet());

        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .sorted()
                .toList();
    }

    @Transactional
    public int saveDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
            return -1;
        }
        try {
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public int updateDoctor(Long id, Doctor updated) {
        Optional<Doctor> optional = doctorRepository.findById(id);
        if (optional.isEmpty()) return -1;

        Doctor doctor = optional.get();
        doctor.setName(updated.getName());
        doctor.setEmail(updated.getEmail());
        doctor.setPhone(updated.getPhone());
        doctor.setSpecialty(updated.getSpecialty());
        doctor.setClinicAddress(updated.getClinicAddress());
        doctor.setYearsOfExperience(updated.getYearsOfExperience());
        doctor.setAvailableTimes(updated.getAvailableTimes());
        if (updated.getPassword() != null) {
            doctor.setPassword(updated.getPassword());
        }

        doctorRepository.save(doctor);
        return 1;
    }

    @Transactional
    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional
    public int deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) return -1;
        try {
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public String validateDoctor(String email, String password) {
        Doctor doctor = doctorRepository.findByEmail(email);
        if (doctor == null || !doctor.getPassword().equals(password)) {
            return "Invalid email or password";
        }
        return tokenService.generateToken("doctor");
    }

    @Transactional
    public List<Doctor> findDoctorByName(String name) {
        return doctorRepository.findByNameLike("%" + name + "%");
    }

    @Transactional
    public List<Doctor> filterDoctorsByNameSpecialtyAndTime(String name, String specialty, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        return filterDoctorsByTime(doctors, timePeriod);
    }

    public List<Doctor> filterDoctorsByTime(List<Doctor> doctors, String timePeriod) {
        return doctors.stream()
                .filter(doctor ->
                        doctor.getAvailableTimes().stream().anyMatch(timeStr -> {
                            String startTimeStr = timeStr.split("-")[0];
                            LocalTime time = LocalTime.parse(startTimeStr);
                            return timePeriod.equalsIgnoreCase("AM")
                                    ? time.isBefore(LocalTime.NOON)
                                    : time.isAfter(LocalTime.NOON);
                        })
                ).toList();
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndTime(String name, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findByNameLike("%" + name + "%");
        return filterDoctorsByTime(doctors, timePeriod);
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndSpecialty(String name, String specialty) {
        return doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorByTimeAndSpecialty(String specialty, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        return filterDoctorsByTime(doctors, timePeriod);
    }

    @Transactional
    public List<Doctor> filterDoctorBySpecialty(String specialty) {
        return doctorRepository.findBySpecialtyIgnoreCase(specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorsByTime(String timePeriod) {
        List<Doctor> allDoctors = doctorRepository.findAll();
        return filterDoctorsByTime(allDoctors, timePeriod);
    }
}
