import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

const ADMIN_BASE_API = API_BASE_URL + "/admin";
const DOCTOR_BASE_API = API_BASE_URL + "/doctor";
const PATIENT_BASE_API = API_BASE_URL + "/patient";

window.selectRole = function(role) {
  localStorage.setItem("userRole", role);
};

window.onload = function () {
  const adminBtn = document.getElementById("adminLogin");
  const doctorBtn = document.getElementById("doctorLogin");
  const patientBtn = document.getElementById("patientLogin");
  const patientSignupBtn = document.getElementById("patientSignup");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      openModal("adminLogin", null);
    });
  }

  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => {
      openModal("doctorLogin", null);
    });
  }

  if (patientBtn) {
    patientBtn.addEventListener("click", () => {
      openModal("patientLogin", null);
    });
  }

  if (patientSignupBtn) {
    patientSignupBtn.addEventListener("click", () => {
      openModal("patientSignup", null);
    });
  }
};

window.adminLoginHandler = async function () {
  const username = document.getElementById("adminUsername")?.value;
  const password = document.getElementById("adminPassword")?.value;

  const admin = {
    username,
    password
  };

  try {
    const response = await fetch(ADMIN_BASE_API + '/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(admin)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      selectRole("admin");
      window.location.href = `/adminDashboard/${data.token}`;
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Admin login error:", error);
    alert("An unexpected error occurred.");
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById("doctorEmail")?.value;
  const password = document.getElementById("doctorPassword")?.value;

  const doctor = {
    email,
    password
  };

  try {
    const response = await fetch(DOCTOR_BASE_API + '/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      selectRole("doctor");
      window.location.href = `/doctorDashboard/${data.token}`;
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Doctor login error:", error);
    alert("An unexpected error occurred.");
  }
};

export async function patientLogin(data) {
  try {
    return await fetch(`${PATIENT_BASE_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Patient login error:", error);
    throw error;
  }
}

window.patientLoginHandler = async function () {
  try {
    const email = document.getElementById("patientEmail")?.value;
    const password = document.getElementById("patientPassword")?.value;

    const response = await patientLogin({
      email,
      password
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/pages/loggedPatientDashboard.html";
    } else {
      alert(data?.message || "Invalid credentials!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Unexpected error during login.");
  }
};

export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_BASE_API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to delete doctor");
    }

    return {
      success: response.ok,
      message: response.message || "Signup successful"
    };
  } catch (error) {
    console.error("Patient signup error:", error);

    return {
      success: false,
      message: "Unable to complete signup"
    };
  }
}

window.patientSignupHandler = async function () {
  try {
    const name = document.getElementById("signupName")?.value;
    const email = document.getElementById("signupEmail")?.value;
    const password = document.getElementById("signupPassword")?.value;
    const phone = document.getElementById("signupPhone")?.value;
    const emergencyContact = document.getElementById("signupEmergencyContact")?.value;
    const address = document.getElementById("signupAddress")?.value;
    const dateOfBirth = document.getElementById("signupDateOfBirth")?.value;
    const insuranceProvider = document.getElementById("signupInsuranceProvider")?.value;

    const response = await patientSignup({
      name,
      email,
      password,
      phone,
      emergencyContact,
      address,
      dateOfBirth,
      insuranceProvider
    });

    if (response?.success) {
      alert(response.message || "Signup successful!");
      window.location.reload();
    } else {
      alert(response?.message || "Signup failed!");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Unexpected error during signup.");
  }
};

async function loadDoctorPreview() {
  try {
    const res = await fetch(API_BASE_URL + "/doctor");

    const data = await res.json();

    const doctors = data.doctors.slice(0, 4);

    const container = document.getElementById("doctorsPreview");

    if (!container) return;

    container.innerHTML = doctors.map(d => `
            <div class="doctor-card-mini">
                <h4>${d.name}</h4>
                <p>${d.specialty}</p>
            </div>
        `).join("");

  } catch (err) {
    console.error("Failed to load preview", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDoctorPreview);
