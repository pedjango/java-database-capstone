package com.pedjango.smartclinic.service;


import com.pedjango.smartclinic.models.Admin;
import com.pedjango.smartclinic.models.Doctor;
import com.pedjango.smartclinic.models.Patient;
import com.pedjango.smartclinic.repository.AdminRepository;
import com.pedjango.smartclinic.repository.DoctorRepository;
import com.pedjango.smartclinic.repository.PatientRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    public TokenService(AdminRepository adminRepository,
                        DoctorRepository doctorRepository,
                        PatientRepository patientRepository) {
        this.adminRepository=adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository=patientRepository;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String subject) {
        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractSubject(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token,String user) {
        try {
            String extracted = extractSubject(token);
            switch (user) {
                case "admin" -> {
                    Admin admin = adminRepository.findByUsername(extracted);
                    return admin != null;
                }
                case "doctor" -> {
                    Doctor doctor = doctorRepository.findByEmail(extracted);
                    return doctor != null;
                }
                case "patient" -> {
                    Patient patient = patientRepository.findByEmail(extracted);
                    return patient != null;
                }
                default -> {
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }
    }
}
