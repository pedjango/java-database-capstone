package com.pedjango.smartclinic.controller;

import com.pedjango.smartclinic.dto.Login;
import com.pedjango.smartclinic.service.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final Service service;

    public AdminController(Service service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Login login) {
        return service.validateAdmin(login.getUsername(), login.getPassword());
    }
}
