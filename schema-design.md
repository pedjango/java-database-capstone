# Smart Clinic Management System - Database Schema Design

## Overview

The Smart Clinic Management System uses a hybrid database architecture that combines the strengths of relational and 
document-oriented databases. MySQL is used for structured transactional data such as patients, doctors, appointments, 
and administrators, while MongoDB is used for flexible and evolving healthcare documents such as prescriptions and 
medical notes.

This design improves scalability, maintainability, and flexibility by ensuring that each type of data is stored using 
the most appropriate persistence strategy.

---

## MySQL Database Design

### Design Considerations

The relational database is responsible for storing structured clinic data with strong relationships and constraints.

The design focuses on:
- Maintaining referential integrity
- Preventing invalid appointment relationships
- Supporting secure authentication and authorization
- Enabling future reporting and analytics
- Supporting appointment scheduling workflows

The following entities represent the core operational data of the Smart Clinic Management System.

---

### Table: `Admin`

Stores administrator accounts responsible for managing the system.

| Column Name | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(120) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| role | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### Notes
- Passwords will be encrypted using Spring Security.
- Emails must remain unique across administrator accounts.

---

### Table: `DOCTORS`

Stores doctor information and specialization details.

| Column Name | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| specialization | VARCHAR(100) | NOT NULL |
| email | VARCHAR(120) | UNIQUE, NOT NULL |
| phone_number | VARCHAR(20) | UNIQUE |
| available | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### Notes
- Doctors may later support availability schedules and working hour management.
- Email and phone number uniqueness prevents duplicate accounts.

---

### Table: `PATIENTS`

Stores patient account and profile information.

| Column Name | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(120) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| phone_number | VARCHAR(20) | UNIQUE |
| date_of_birth | DATE | NOT NULL |
| gender | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### Notes
- Passwords will be securely hashed before storage.
- Patient history should remain preserved even after account deactivation.

---

### Table: `APPOINTMENTS`

Stores appointment scheduling information between doctors and patients.

| Column Name | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, AUTO_INCREMENT |
| doctor_id | INT | Foreign Key → doctors(id), NOT NULL |
| patient_id | INT | Foreign Key → patients(id), NOT NULL |
| appointment_time | DATETIME | NOT NULL |
| duration_minutes | INT | DEFAULT 60 |
| status | VARCHAR(30) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### Notes
- Appointments should prevent overlapping bookings for doctors.
- Appointment duration is initially fixed to one hour.
- Appointment history should remain stored for audit and medical purposes.
- Suggested statuses:
    - SCHEDULED
    - COMPLETED
    - CANCELLED

---

### Table: `DOCTOR_AVAILABILITY`

Stores doctor availability and unavailable scheduling periods.

| Column Name | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, AUTO_INCREMENT |
| doctor_id | INT | Foreign Key → doctors(id), NOT NULL |
| available_date | DATE | NOT NULL |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |
| is_available | BOOLEAN | DEFAULT TRUE |

#### Notes
- This table allows future scheduling enhancements.
- Availability validation should prevent invalid overlapping time ranges.

---

### Relational Database Relationships

| Relationship                      | Description |
|-----------------------------------|---|
| `DOCTORS` → `APPOINTMENTS`        | One doctor can have many appointments |
| `PATIENTS` → `APPOINTMENTS`       | One patient can have many appointments |
| `DOCTORS` → `DOCTOR_AVAILABILITY` | One doctor can define multiple availability slots |

---

## MongoDB Collection Design

### Design Considerations

MongoDB is used for flexible and evolving healthcare-related documents that may not fit well into rigid relational schemas.

The design supports:
- Nested document structures
- Optional metadata fields
- Flexible prescription formats
- Rapid schema evolution
- Future support for attachments and medical notes

The collection below complements the MySQL relational design.

---

### Collection: `prescriptions`

Stores prescription records associated with patient appointments.

#### Example MongoDB Document

```json
{
  "_id": "ObjectId('682f1a7c9b1f3e21d8a12345')",
  "appointmentId": 12,
  "patientId": 5,
  "doctorId": 2,
  "prescribedAt": "2026-05-25T10:30:00Z",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "durationDays": 7
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "As needed",
      "durationDays": 5
    }
  ],
  "doctorNotes": "Patient should rest and increase fluid intake.",
  "tags": [
    "infection",
    "antibiotics",
    "follow-up-required"
  ],
  "pharmacy": {
    "name": "CityCare Pharmacy",
    "location": "London"
  },
  "refillAllowed": true,
  "refillCount": 1
}
```

#### Design Decisions
- The prescription document stores only `patientId`, `doctorId`, and `appointmentId` references instead of embedding complete relational objects.
- Core patient and doctor data already exists in MySQL and should remain normalized to avoid duplication.
- MongoDB is used here specifically for flexible prescription structures, nested medication arrays, metadata, and doctor notes.
- The schema is intentionally extensible and can support future additions such as:
  - file attachments
  - prescription history
  - AI-generated recommendations
  - patient feedback
  - audit logs

#### Notes
- MongoDB allows prescriptions to contain flexible medication structures.
- Embedded medication arrays reduce the need for multiple relational tables.
- Additional metadata fields can be added later without schema migrations.
- The document references relational entities using IDs rather than embedding entire patient or doctor objects.

---

## SQL vs NoSQL Design Decisions

| Data Type | Database Choice | Reason |
|---|---|---|
| Patients | MySQL | Structured relational data with validations |
| Doctors | MySQL | Requires strong relationships and constraints |
| Appointments | MySQL | Transactional scheduling data |
| Authentication Data | MySQL | Secure and normalized relational storage |
| Prescriptions | MongoDB | Flexible nested document structure |
| Medical Notes | MongoDB | Schema flexibility and extensibility |
| Logs / Messages | MongoDB | High-volume semi-structured data |

---

## Summary

The Smart Clinic Management System uses a hybrid persistence strategy to combine the reliability of relational 
databases with the flexibility of document-oriented storage.

MySQL manages structured operational data and entity relationships, while MongoDB handles flexible healthcare 
documents and evolving prescription data structures. This architecture supports scalability, maintainability, 
and future expansion of the clinic management platform.
