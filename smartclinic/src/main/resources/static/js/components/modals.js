export function openModal(type) {
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
  }

  document.getElementById('modal-body').innerHTML = modalContent;
  document.getElementById('modal').style.display = 'block';

  document.getElementById('closeModal').onclick = () => {
    document.getElementById('modal').style.display = 'none';
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

  if (type === 'adminLogin') {
    document.getElementById('adminLoginBtn').addEventListener('click', adminLoginHandler);
  }

  if (type === 'doctorLogin') {
    document.getElementById('doctorLoginBtn').addEventListener('click', doctorLoginHandler);
  }
}
