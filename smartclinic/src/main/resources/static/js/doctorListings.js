import { openModal } from "./components/modals.js";

import {
  getDoctors,
  filterDoctors,
} from "./services/doctorServices.js";

import { createDoctorCard } from "./components/doctorCard.js";

window.addEventListener("DOMContentLoaded", async () => {
  await loadDoctorCards();
  setupEventListeners();
});

function setupEventListeners() {
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
