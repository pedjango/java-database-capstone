import { getPatientData } from "../services/patientServices.js";
import { deleteDoctor } from "../services/doctorServices.js";
import { openModal } from "../components/modals.js";

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  const role = localStorage.getItem("userRole");

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = document.createElement("p");
  specialization.textContent = `Specialty: ${doctor.specialty}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email}`;

  const phone = document.createElement("p");
  phone.textContent = `Phone Number: ${doctor.phone}`;

  const clinicAddress = document.createElement("p");
  clinicAddress.textContent = `Clinic Address: ${doctor.clinicAddress}`;

  const yearsOfExperience = document.createElement("p");
  yearsOfExperience.textContent = `Years of Experience: ${doctor.yearsOfExperience}`;

  const availability = document.createElement("p");
  availability.textContent = `Availability: ${
    Array.isArray(doctor.availableTimes)
      ? doctor.availableTimes.join(", ")
      : doctor.availableTimes
  }`;

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(phone);
  if (doctor.clinicAddress) {
    infoDiv.appendChild(clinicAddress);
  }
  if (doctor.yearsOfExperience) {
    infoDiv.appendChild(yearsOfExperience);
  }
  infoDiv.appendChild(availability);
  card.appendChild(infoDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList = "dashboard-btn-secondary";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList = "dashboard-btn";

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this doctor?"
      );

      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem("token");

        await deleteDoctor(doctor.id, token);

        card.remove();
      } catch (error) {
        console.error("Failed to delete doctor:", error);
        alert("Error deleting doctor.");
      }
    });

    editBtn.addEventListener("click", async () => {
      try {
        openModal("editDoctor", doctor);
      } catch (error) {
        console.error("Failed to edit doctor:", error);
        alert("Error editing doctor.");
      }
    });

    actionsDiv.appendChild(removeBtn);
    actionsDiv.appendChild(editBtn);
    card.appendChild(actionsDiv);
  }

  else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("dashboard-btn-secondary");

    bookNow.addEventListener("click", async (e) => {
      try {
        openModal("bookAppointment", doctor);
      } catch (error) {
        console.error("Booking error:", error);
        alert("Unable to start booking process.");
      }
    });

    actionsDiv.appendChild(bookNow);
    card.appendChild(actionsDiv);
  }

  else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("dashboard-btn-secondary");

    bookNow.addEventListener("click", async (e) => {
      try {
        const token = localStorage.getItem("token");

        const patientData = await getPatientData(token);

        openModal(e, doctor, patientData);
      } catch (error) {
        console.error("Booking error:", error);
        alert("Unable to start booking process.");
      }
    });

    actionsDiv.appendChild(bookNow);
    card.appendChild(actionsDiv);
  }

  return card;
}
