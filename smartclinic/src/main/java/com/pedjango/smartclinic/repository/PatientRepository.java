package com.pedjango.smartclinic.repository;

import com.pedjango.smartclinic.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByEmail(String email);
    Patient findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);

    @Query(value = "SELECT p.name FROM Patient p WHERE p.email = :email")
    String findNameByEmail(String email);
}
