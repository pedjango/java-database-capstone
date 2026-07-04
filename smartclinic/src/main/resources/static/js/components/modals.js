import {submitAppointment} from "../services/appointmentRecordService.js";

export function openModal(type, object) {
  let modalContent = '';
  if (type === 'addDoctor') {
    modalContent = `
         <h2 style="margin-bottom: 0.85rem;">Add Doctor</h2>
         <input type="text" id="doctorName" placeholder="Doctor Name" class="input-field">
         <select id="doctorSpecialty" class="input-field select-dropdown">
            <option value="">Specialization</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Orthopedist">Orthopedist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Dentist">Dentist</option>
            <option value="Ophthalmologist">Ophthalmologist</option>
            <option value="ENT">ENT Specialist</option>
            <option value="Urologist">Urologist</option>
            <option value="Oncologist">Oncologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
            <option value="General Physician">General Physician</option>
        </select>
        <input type="email" id="doctorEmail" placeholder="Email" class="input-field">
        <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
        <input type="text" id="doctorPhone" placeholder="Phone Number" class="input-field">
        <input type="text" id="doctorClinicAddress" placeholder="Clinic Address" class="input-field">
        <label class="availabilityLabel">
            Select Availability
        </label>
        <div class="availability-container">
          <div class="availability-grid">
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="09:00-10:00">
                  <span>9:00 AM - 10:00 AM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="10:00-11:00">
                  <span>10:00 AM - 11:00 AM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="11:00-12:00">
                  <span>11:00 AM - 12:00 PM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="12:00-13:00">
                  <span>12:00 PM - 1:00 PM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="13:00-14:00">
                  <span>1:00 PM - 2:00 PM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="14:00-15:00">
                  <span>2:00 PM - 3:00 PM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="15:00-16:00">
                  <span>3:00 PM - 4:00 PM</span>
              </label>
              <label class="time-slot">
                  <input type="checkbox" name="availability" value="16:00-17:00">
                  <span>4:00 PM - 5:00 PM</span>
              </label>
          </div>
        </div>
        <div class="btn-container">
          <button class="dashboard-btn-secondary" id="closeDoctorModal">Cancel</button>
          <button class="dashboard-btn" id="saveDoctorBtn">Save</button>
        </div>
      `;
  } else if (type === "editDoctor") {
    modalContent = `
      <h2 style="margin-bottom: 0.85rem;">Edit Doctor</h2>

      <input
        type="text"
        id="doctorId"
        placeholder="Doctor ID"
        class="input-field"
        value="${object.id ?? ""}"
        hidden
        disabled
      >

      <input
        type="text"
        id="doctorName"
        placeholder="Doctor Name"
        class="input-field"
        value="${object.name ?? ""}"
      >

      <select id="doctorSpecialty" class="input-field select-dropdown">
          <option value="">Specialization</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Orthopedist">Orthopedist</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Psychiatrist">Psychiatrist</option>
          <option value="Dentist">Dentist</option>
          <option value="Ophthalmologist">Ophthalmologist</option>
          <option value="ENT">ENT Specialist</option>
          <option value="Urologist">Urologist</option>
          <option value="Oncologist">Oncologist</option>
          <option value="Gastroenterologist">Gastroenterologist</option>
          <option value="General Physician">General Physician</option>
      </select>

      <input
        type="email"
        id="doctorEmail"
        placeholder="Email"
        class="input-field"
        value="${object.email ?? ""}"
      >

      <input
        type="password"
        id="doctorPassword"
        placeholder="Leave empty to keep current password"
        class="input-field"
      >

      <input
        type="text"
        id="doctorPhone"
        placeholder="Phone Number"
        class="input-field"
        value="${object.phone ?? ""}"
      >

      <input
        type="text"
        id="doctorClinicAddress"
        placeholder="Clinic Address"
        class="input-field"
        value="${object.clinicAddress ?? ""}"
      >

      <input
        type="number"
        id="doctorYearsOfExperience"
        placeholder="Years of Experience"
        class="input-field"
        value="${object.yearsOfExperience ?? ""}"
      >

      <label class="availabilityLabel">
          Select Availability
      </label>

      <div class="availability-container">
          <div class="availability-grid">
              ${
            [
              "09:00-10:00",
              "10:00-11:00",
              "11:00-12:00",
              "12:00-13:00",
              "13:00-14:00",
              "14:00-15:00",
              "15:00-16:00",
              "16:00-17:00"
            ]
              .map(
                (slot) => `
                      <label class="time-slot">
                          <input
                              type="checkbox"
                              name="availability"
                              value="${slot}"
                              ${
                  object.availableTimes?.includes(slot)
                    ? "checked"
                    : ""
                }
                          >
                          <span>${formatTimeSlot(slot)}</span>
                      </label>
                    `
              )
              .join("")
          }
          </div>
      </div>

      <div class="btn-container">
          <button class="dashboard-btn-secondary" id="closeDoctorModal">Cancel</button>
          <button class="dashboard-btn" id="updateDoctorBtn">Update</button>
      </div>
  `;
  } else if (type === 'patientLogin') {
    modalContent = `
        <h2 style="margin-bottom: 0.85rem;">Patient Login</h2>
        <input type="text" id="patientEmail" placeholder="Email" class="input-field">
        <input type="password" id="patientPassword" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="patientLoginBtn">Login</button>
      `;
  }
  else if (type === "patientSignup") {
    modalContent = `
      <h2 style="margin-bottom: 0.85rem;">Patient Signup</h2>
      <input type="text" id="signupName" placeholder="Name" class="input-field">
      <input type="email" id="signupEmail" placeholder="Email" class="input-field">
      <input type="password" id="signupPassword" placeholder="Password" class="input-field">
      <input type="text" id="signupPhone" placeholder="Phone" class="input-field">
      <input type="text" id="signupEmergencyContact" placeholder="Emergency Contact" class="input-field">
      <input type="text" id="signupAddress" placeholder="Address" class="input-field">
      <input type="datetime-local" id="signupDateOfBirth" placeholder="Date of Birth" class="input-field">
      <input type="text" id="signupInsuranceProvider" placeholder="Insurance Provider" class="input-field">
      <button class="dashboard-btn" id="signupBtn">Sign Up</button>
    `;
  } else if (type === 'adminLogin') {
    modalContent = `
        <h2 style="margin-bottom: 0.85rem;">Admin Login</h2>
        <input type="text" id="adminUsername" name="adminUsername" placeholder="Username" class="input-field">
        <input type="password" id="adminPassword" name="adminPassword" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="adminLoginBtn">Login</button>
      `;
  } else if (type === 'doctorLogin') {
    modalContent = `
        <h2 style="margin-bottom: 0.85rem;">Doctor Login</h2>
        <input type="text" id="doctorEmail" placeholder="Email" class="input-field">
        <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="doctorLoginBtn">Login</button>
      `;
  } else if (type === "bookAppointment") {
    const doctor = object;
    const availableOptions =
      doctor.availableTimes
        ?.map(
          (slot) =>
            `<option value="${slot}">${slot}</option>`
        )
        .join("") || "";
    modalContent = `
      <h2 style="margin-bottom: 0.85rem;">Book Appointment</h2>

      <div class="doctor-booking-info">
          <h3>${doctor.name}</h3>
          <p>${doctor.specialty}</p>
      </div>

      <label>Select Date</label>
      <input
          type="date"
          id="appointmentDate"
          class="input-field">

      <label>Available Time</label>
      <select
          id="appointmentTime"
          class="input-field select-dropdown">
          <option value="">
              Select a time slot
          </option>
          ${availableOptions}
      </select>

      <label>Reason for Visit</label>
      <textarea
          id="reasonForVisit"
          class="input-field"
          rows="4"
          placeholder="Describe your symptoms or reason for visit"
      ></textarea>

      <div class="btn-container" style="margin-top: 16px;">
          <button class="dashboard-btn-secondary" id="closeBookingModal">Cancel</button>
          <button class="dashboard-btn" id="bookAppointmentBtn">Book</button>
      </div>
  `;
  }

  document.getElementById('modal-body').innerHTML = modalContent;
  document.getElementById('modal').style.display = 'block';

  document.getElementById('closeModal').onclick = () => {
    document.getElementById('modal').style.display = 'none';
    if (localStorage.getItem("userRole") != null && localStorage.getItem("token") == null) {
      localStorage.removeItem("userRole");
    }
  };

  if (type === "patientSignup") {
    document.getElementById("signupBtn").addEventListener("click", patientSignupHandler);
  }

  if (type === "patientLogin") {
    document.getElementById("patientLoginBtn").addEventListener("click", patientLoginHandler);
  }

  if (type === 'addDoctor') {
    document.getElementById('closeDoctorModal').onclick = () => {
      document.getElementById('modal').style.display = 'none';
    };
    document.getElementById('saveDoctorBtn').addEventListener('click', adminAddDoctor);
  }

  if (type === 'editDoctor') {
    document.getElementById("doctorSpecialty").value =
      object.specialty;

    document.getElementById("closeDoctorModal").onclick = () => {
      document.getElementById("modal").style.display = "none";
    };
    document.getElementById("updateDoctorBtn").addEventListener("click", adminEditDoctor);
  }

  if (type === 'adminLogin') {
    document.getElementById('adminLoginBtn').addEventListener('click', adminLoginHandler);
  }

  if (type === 'doctorLogin') {
    document.getElementById('doctorLoginBtn').addEventListener('click', doctorLoginHandler);
  }

  if (type === 'bookAppointment') {
    document.getElementById('bookAppointmentBtn').addEventListener('click', () => submitAppointment(object));
  }
}

function formatTimeSlot(slot) {
  const [start, end] = slot.split("-");

  const format = (time) => {
    const [hour, minute] = time.split(":");

    const h = Number(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayHour =
      h === 0 ? 12 :
        h > 12 ? h - 12 :
          h;

    return `${displayHour}:${minute} ${suffix}`;
  };

  return `${format(start)} - ${format(end)}`;
}

function getDoctorFormData() {
  const name =
    document.getElementById("doctorName")?.value.trim();

  const specialty =
    document.getElementById("doctorSpecialty")?.value;

  const email =
    document.getElementById("doctorEmail")?.value.trim();

  const password =
    document.getElementById("doctorPassword")?.value;

  const phone =
    document.getElementById("doctorPhone")?.value.trim();

  const clinicAddress =
    document.getElementById("doctorClinicAddress")?.value.trim();

  const yearsOfExperience =
    document.getElementById("doctorYearsOfExperience")?.value;

  const availabilityCheckboxes =
    document.querySelectorAll(
      'input[name="availability"]:checked'
    );

  const availableTimes =
    Array.from(availabilityCheckboxes)
      .map((checkbox) => checkbox.value);

  const doctor = {
    name,
    specialty,
    email,
    phone,
    clinicAddress:
      clinicAddress || null,
    yearsOfExperience:
      yearsOfExperience
        ? Number(yearsOfExperience)
        : null,
    availableTimes
  };

  if (password?.trim()) {
    doctor.password = password;
  }

  return doctor;
}
