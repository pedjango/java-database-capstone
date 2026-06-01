package com.pedjango.smartclinic.mvc;

import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {
    public boolean validateToken(String token, String role) {
        if ("admin".equals(role) && "admin-token".equals(token)) {
            return true;
        }
        if ("doctor".equals(role) && "doctor-token".equals(token)) {
            return true;
        }
        return false;
    }
}
