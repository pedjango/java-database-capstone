package com.pedjango.smartclinic.repository;

import com.pedjango.smartclinic.models.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    List<Prescription> findByAppointmentId(Long appointmentId);
}
