package com.pedjango.smartclinic.models;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;

    @NotNull(message = "Patient name cannot be null")
    @Size(min = 3, max = 100, message = "Patient name must be between 3 and 100 characters long")
    private String patientName;

    @NotNull(message = "Appointment ID cannot be null")
    private Long appointmentId;

    @NotNull(message = "Medication cannot be null")
    @Size(min = 3, max = 100, message = "Medication must be between 3 and 100 characters long")
    private String medication;

    @NotNull(message = "Dosage cannot be null")
    @Size(min = 3, max = 20, message = "Dosage must be between 3 and 20 characters long")
    private String dosage;

    @Size(max = 200)
    private String doctorNotes;

    @NotNull
    private String refillCount;

    @NotNull
    @Size(min = 3, max = 200)
    private String pharmacyName;
}
