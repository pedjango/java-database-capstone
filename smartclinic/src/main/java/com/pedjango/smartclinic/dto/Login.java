package com.pedjango.smartclinic.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class Login implements Serializable {
    private String email;
    private String password;
}
