import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

const patientTableBody = document.getElementById("patientTableBody");

let selectedDate = new Date().toISOString().split("T")[0];
let token = localStorage.getItem("token");
let patientName = null;
const searchBar = document.getElementById("searchBar");

if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const value = e.target.value.trim();

    patientName = value === "" ? "null" : value;

    loadAppointments();
  });
}

const todayButton = document.getElementById("todayButton");

if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];

    const datePicker = document.getElementById("datePicker");

    if (datePicker) {
      datePicker.value = selectedDate;
    }

    loadAppointments();
  });
}

const datePicker = document.getElementById("datePicker");

if (datePicker) {
  datePicker.value = selectedDate;
  datePicker.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadAppointments();
  });
}

async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(
      selectedDate,
      patientName,
      token
    );

    patientTableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      patientTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="noPatientRecord">
                        No Appointments found for today
                    </td>
                </tr>
            `;
      return;
    }

    appointments.forEach((appointment) => {
      const patient = appointment.patient || {};

      const row = createPatientRow({
        appointmentId: appointment.id,
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        prescription: appointment.prescription || "No Prescription"
      });

      patientTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);

    patientTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="noPatientRecord">
                    Failed to load appointments
                </td>
            </tr>
        `;
  }
}

// Initial page load
document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
});
