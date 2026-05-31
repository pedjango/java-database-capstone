import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

const contentDiv = document.getElementById("content");

async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();

    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
      contentDiv.innerHTML = "<p>No doctors available.</p>";
      return;
    }

    doctors.forEach((doctor) => {
      const card = createDoctorCard(doctor);
      contentDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading doctors:", error);
    contentDiv.innerHTML = "<p>Failed to load doctors.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }
});

const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

function filterDoctorsOnChange() {
  const name = searchBar ? searchBar.value.trim() : "";
  const time = filterTime ? filterTime.value : "";
  const specialty = filterSpecialty ? filterSpecialty.value : "";

  filterDoctors(name, time, specialty)
    .then((doctors) => {
      contentDiv.innerHTML = "";

      if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML =
          "<p>No doctors found with the given filters.</p>";
        return;
      }

      doctors.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Filter error:", err);
      contentDiv.innerHTML = "<p>Error filtering doctors.</p>";
    });
}

if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);

export function renderDoctorCards(doctors) {
  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

window.signupPatient = async function () {
  try {
    const name = document.getElementById("signupName")?.value;
    const email = document.getElementById("signupEmail")?.value;
    const password = document.getElementById("signupPassword")?.value;
    const phone = document.getElementById("signupPhone")?.value;
    const address = document.getElementById("signupAddress")?.value;

    const response = await patientSignup({
      name,
      email,
      password,
      phone,
      address
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

window.loginPatient = async function () {
  try {
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;

    const response = await patientLogin({
      email,
      password
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/loggedPatientDashboard.html";
    } else {
      alert(data?.message || "Invalid credentials!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Unexpected error during login.");
  }
};
