import { openModal } from "./components/modals.js";

import {
  getDoctors,
  filterDoctors,
  saveDoctor
} from "./services/doctorServices.js";

import { createDoctorCard } from "./components/doctorCard.js";

window.addEventListener("DOMContentLoaded", async () => {
  await loadDoctorCards();
  setupEventListeners();
});

function setupEventListeners() {
  const addDoctorBtn = document.getElementById("addDocBtn");

  if (addDoctorBtn) {
    addDoctorBtn.addEventListener("click", () => {
      openModal("addDoctor", null);
    });
  }

  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) {
    searchBar.addEventListener("input", filterDoctorsOnChange);
  }

  if (filterTime) {
    filterTime.addEventListener("change", filterDoctorsOnChange);
  }

  if (filterSpecialty) {
    filterSpecialty.addEventListener("change", filterDoctorsOnChange);
  }

  const addDoctorForm = document.getElementById("addDoctorForm");

  if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await adminAddDoctor();
    });
  }
}

async function loadDoctorCards() {
  const response = await getDoctors();
  renderDoctorCards(response.doctors);
}

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");

  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = `
            <p class="no-results">No doctors found</p>
        `;
    return;
  }

  doctors.forEach((doctor) => {
    const doctorCard = createDoctorCard(doctor);
    contentDiv.appendChild(doctorCard);
  });
}

async function filterDoctorsOnChange() {
  const name =
    document.getElementById("searchBar")?.value || "";

  const time =
    document.getElementById("filterTime")?.value || "";

  const specialty =
    document.getElementById("filterSpecialty")?.value || "";

  const filteredDoctorsResponse = await filterDoctors(
    name,
    time,
    specialty
  );

  renderDoctorCards(filteredDoctorsResponse.doctors);
}

window.adminAddDoctor = async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized access. Please login again.");
    return;
  }

  const name =
    document.getElementById("doctorName")?.value;

  const specialty =
    document.getElementById("doctorSpecialty")?.value;

  const email =
    document.getElementById("doctorEmail")?.value;

  const password =
    document.getElementById("doctorPassword")?.value;

  const phone =
    document.getElementById("doctorPhone")?.value;

  const clinicAddress =
    document.getElementById("doctorClinicAddress")?.value;

  const availabilityCheckboxes =
    document.querySelectorAll(
      'input[name="availability"]:checked'
    );

  const availableTimes = Array.from(
    availabilityCheckboxes
  ).map((checkbox) => checkbox.value);

  const doctor = {
    name,
    specialty,
    email,
    password,
    phone,
    clinicAddress,
    availableTimes
  };

  try {
    const response = await saveDoctor(
      doctor,
      token
    );

    if (response.success) {
      alert("Doctor added successfully.");

      const modal = document.getElementById("modal");

      if (modal) {
        modal.style.display = "none";
      }

      await loadDoctorCards();
    } else {
      alert(
        response.message ||
        "Failed to add doctor."
      );
    }
  } catch (error) {
    console.error(
      "Error adding doctor:",
      error
    );

    alert(
      "An unexpected error occurred."
    );
  }
};
