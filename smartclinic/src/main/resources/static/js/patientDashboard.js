import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";

const contentDiv = document.getElementById("content");

async function loadDoctorCards() {
  const response = await getDoctors();
  renderDoctorCards(response.doctors);
}

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup", null));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin", null));
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
