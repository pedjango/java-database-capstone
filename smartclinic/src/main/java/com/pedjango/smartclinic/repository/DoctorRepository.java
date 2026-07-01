package com.pedjango.smartclinic.repository;

import com.pedjango.smartclinic.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Doctor findByEmail(String email);
    List<Doctor> findByNameLike(String name);
    List<Doctor> findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(String name, String specialty);
    List<Doctor> findBySpecialtyIgnoreCase(String specialty);
    boolean existsByEmail(String email);
    @Query(
        value = """
            SELECT d.id
            FROM Doctor d
            WHERE d.email = :email
        """
    )
    Long findIdByEmail(String email);
}
