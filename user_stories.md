# User Stories

## User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]

---

## Admin User Stories

### Admin User Story 1

**Title:**  
_As an admin, I want to log into the portal using my username and password, so that I can securely manage the Smart Clinic Management System._

**Acceptance Criteria:**
1. The admin can access the login page.
2. The system validates the username and password credentials.
3. Successful authentication grants access to the admin dashboard.
4. Invalid credentials return an appropriate error message.
5. JWT authentication is generated after successful login.

**Priority:** High

**Story Points:** 5

**Notes:**
- JWT authentication will be used for protected routes.

---

### Admin User Story 2

**Title:**  
_As an admin, I want to log out of the portal, so that unauthorized users cannot access the system from my session._

**Acceptance Criteria:**
1. The admin can click a logout action from the dashboard.
2. The current authenticated session is invalidated.
3. JWT tokens are removed or expired after logout.
4. The admin is redirected to the login page.
5. Protected pages cannot be accessed after logout.

**Priority:** High

**Story Points:** 3

**Notes:**
- Logout functionality should follow secure session handling practices.
- Unauthorized access after logout must be prevented.

---

### Admin User Story 3

**Title:**  
_As an admin, I want to add doctors to the portal, so that doctors can manage appointments and patient interactions._

**Acceptance Criteria:**
1. The admin can access the doctor creation form.
2. The admin can enter doctor information such as name, specialization, email, and availability.
3. The system validates all required fields before saving.
4. Doctor information is persisted in the MySQL database.
5. The newly created doctor profile becomes visible in the doctor management dashboard.

**Priority:** High

**Story Points:** 5

**Notes:**
- Doctor data should be stored using Spring Data JPA entities.
- Validation annotations should be applied to required fields.

---

### Admin User Story 4

**Title:**  
_As an admin, I want to delete a doctor profile from the portal, so that outdated or inactive doctor accounts can be removed from the system._

**Acceptance Criteria:**
1. The admin can select a doctor profile for deletion.
2. The system requests confirmation before deletion.
3. The selected doctor record is removed from the database.
4. Deleted doctor profiles no longer appear in the dashboard.
5. The system handles invalid or missing doctor IDs gracefully.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Referential integrity should be considered before deletion.
- Soft delete functionality may be considered in future enhancements.

---

### Admin User Story 5

**Title:**  
_As an admin, I want to execute a stored procedure to retrieve monthly appointment statistics, so that I can monitor clinic activity and system usage trends._

**Acceptance Criteria:**
1. A stored procedure exists in MySQL for calculating monthly appointment totals.
2. The procedure can be executed successfully through MySQL CLI.
3. The system returns the total number of appointments grouped by month.
4. The query results are accurate based on stored appointment data.
5. The stored procedure execution is documented in the project repository.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- The stored procedure should support reporting and analytics use cases.
- Sample appointment data should exist for testing the procedure.

---

## Patient User Stories

### Patient User Story 1

**Title:**  
_As a patient, I want to view a list of doctors without logging in, so that I can explore available doctors before creating an account._

**Acceptance Criteria:**
1. Patients can access the doctor listing page without authentication.
2. The system displays doctor information such as name and specialization.
3. The doctor list is retrieved successfully from the backend.
4. The page is accessible to unauthenticated users.
5. The system handles empty doctor lists gracefully.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Public endpoints should not expose sensitive doctor information.
- The doctor list should support future filtering functionality.

---

### Patient User Story 2

**Title:**  
_As a patient, I want to sign up using my email and password, so that I can book and manage appointments through the portal._

**Acceptance Criteria:**
1. Patients can access the registration page.
2. The system validates required fields such as email and password.
3. Duplicate email registrations are prevented.
4. Passwords are securely encrypted before persistence.
5. A new patient account is stored successfully in the database.

**Priority:** High

**Story Points:** 5

**Notes:**
- Email validation should follow standard formatting rules.

---

### Patient User Story 3

**Title:**  
_As a patient, I want to log into the portal, so that I can manage my appointments and access my healthcare information._

**Acceptance Criteria:**
1. Patients can log in using valid credentials.
2. Invalid login attempts display appropriate error messages.
3. Successful authentication redirects the patient to the dashboard.
4. JWT authentication tokens are generated after successful login.
5. Protected patient endpoints require authentication.

**Priority:** High

**Story Points:** 5

**Notes:**
- Patient sessions must remain secure across requests.

---

### Patient User Story 4

**Title:**  
_As a patient, I want to log out of the portal, so that my account remains secure after using the system._

**Acceptance Criteria:**
1. Patients can trigger logout from the dashboard.
2. The authenticated session is invalidated after logout.
3. JWT tokens are removed or expired.
4. Patients are redirected to the login page after logout.
5. Protected resources are inaccessible after logout.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Logout functionality should follow secure authentication practices.
- Session invalidation should prevent unauthorized reuse.

---

### Patient User Story 5

**Title:**  
_As a patient, I want to book an hour-long appointment with a doctor, so that I can schedule a medical consultation online._

**Acceptance Criteria:**
1. Patients can select a doctor and appointment date/time.
2. The system validates doctor availability before booking.
3. Appointment duration is fixed to one hour.
4. Successfully booked appointments are persisted in the database.
5. Patients receive confirmation after successful booking.

**Priority:** High

**Story Points:** 8

**Notes:**
- Appointment scheduling should prevent overlapping bookings.
- Future enhancements may include appointment cancellation and rescheduling.

---

### Patient User Story 6

**Title:**  
_As a patient, I want to view my upcoming appointments, so that I can prepare for scheduled consultations._

**Acceptance Criteria:**
1. Patients can access an upcoming appointments page.
2. The system displays future appointments associated with the authenticated patient.
3. Appointment details include doctor name, date, and appointment time.
4. Appointment data is retrieved successfully from the backend.
5. Empty appointment states are handled gracefully.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- Appointment data should only be accessible to the authenticated patient.
- Future enhancements may include appointment reminders and notifications.

---

## Doctor User Stories

### Doctor User Story 1

**Title:**  
_As a doctor, I want to log into the portal, so that I can manage my appointments and patient interactions._

**Acceptance Criteria:**
1. Doctors can log in using valid credentials.
2. Invalid authentication attempts display an appropriate error message.
3. Successful authentication redirects doctors to the dashboard.
4. JWT authentication tokens are generated after successful login.
5. Protected doctor resources require authentication.

**Priority:** High

**Story Points:** 5

**Notes:**
- Doctor sessions must remain secure across requests.

---

### Doctor User Story 2

**Title:**  
_As a doctor, I want to log out of the portal, so that unauthorized users cannot access my account or patient information._

**Acceptance Criteria:**
1. Doctors can trigger logout from the dashboard.
2. The authenticated session is invalidated after logout.
3. JWT tokens are removed or expired.
4. Doctors are redirected to the login page.
5. Protected resources cannot be accessed after logout.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Logout functionality should follow secure session handling practices.
- Unauthorized reuse of sessions must be prevented.

---

### Doctor User Story 3

**Title:**  
_As a doctor, I want to view my appointment calendar, so that I can stay organized and manage my schedule effectively._

**Acceptance Criteria:**
1. Doctors can access a calendar or appointment schedule view.
2. The system displays upcoming appointments associated with the authenticated doctor.
3. Appointment details include patient name, date, and appointment time.
4. Appointment data is retrieved successfully from the backend.
5. Empty appointment schedules are handled gracefully.

**Priority:** High

**Story Points:** 5

**Notes:**
- Calendar functionality should support future scheduling enhancements.
- Only appointments assigned to the authenticated doctor should be visible.

---

### Doctor User Story 4

**Title:**  
_As a doctor, I want to mark my unavailability, so that patients can only book available appointment slots._

**Acceptance Criteria:**
1. Doctors can define unavailable dates and time ranges.
2. The system prevents patients from booking unavailable time slots.
3. Availability updates are persisted successfully in the database.
4. Doctors can view and manage their unavailable periods.
5. Scheduling conflicts are validated before saving changes.

**Priority:** High

**Story Points:** 8

**Notes:**
- Availability management should integrate with appointment scheduling logic.
- Future enhancements may include recurring availability rules.

---

### Doctor User Story 5

**Title:**  
_As a doctor, I want to update my profile information, so that patients can view accurate specialization and contact details._

**Acceptance Criteria:**
1. Doctors can access a profile management page.
2. Doctors can update specialization and contact information.
3. The system validates required fields before saving.
4. Updated information is persisted successfully in the database.
5. Updated profile information is visible to patients.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- Profile updates should only be accessible to the authenticated doctor.
- Validation should ensure correct contact information formatting.

---

### Doctor User Story 6

**Title:**  
_As a doctor, I want to view patient details for upcoming appointments, so that I can prepare for consultations in advance._

**Acceptance Criteria:**
1. Doctors can access patient information for scheduled appointments.
2. Patient details are limited to authorized appointment relationships.
3. Appointment details include date, time, and patient information.
4. Data is retrieved securely from the backend.
5. Unauthorized access to patient data is prevented.

**Priority:** High

**Story Points:** 5

**Notes:**
- Access to patient information must comply with role-based authorization.
- Sensitive patient data should be protected through secure backend validation.
