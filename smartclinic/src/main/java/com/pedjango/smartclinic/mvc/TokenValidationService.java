package com.pedjango.smartclinic.mvc;

import com.pedjango.smartclinic.service.TokenService;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {
    private final TokenService tokenService;

    public TokenValidationService(final TokenService tokenService) {
        this.tokenService = tokenService;
    }

    public boolean validateToken(String token, String role) {
        String subject = tokenService.extractSubject(token);
        if ("admin".equals(role) && "admin-token".equals(subject)) {
            return true;
        }
        return "doctor".equals(role) && "doctor-token".equals(subject);
    }
}
