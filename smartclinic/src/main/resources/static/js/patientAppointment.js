import {getAppointmentsForPatient} from "./services/appointmentRecordService.js";
import {createAppointmentRowForPatient} from "./components/patientRows.js";

const appointmentTableBody = document.getElementById("appointmentTableBody");
let selectedDate = new Date().toISOString().split("T")[0];
let token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  loadAppointmentsForPatient();
});

const allAppointmentsButton = document.getElementById("showAllAppointmentsBtn");

if (allAppointmentsButton) {
  allAppointmentsButton.addEventListener("click", () => {
    selectedDate = null;

    const datePicker = document.getElementById("appointmentDate");

    if (datePicker) {
      datePicker.value = selectedDate;
    }

    loadAppointmentsForPatient();
  });
}

const todayButton = document.getElementById("todayAppointmentsBtn");

if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];

    const datePicker = document.getElementById("appointmentDate");

    if (datePicker) {
      datePicker.value = selectedDate;
    }

    loadAppointmentsForPatient();
  });
}

const datePicker = document.getElementById("appointmentDate");

if (datePicker) {
  datePicker.value = selectedDate;
  datePicker.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadAppointmentsForPatient();
  });
}

async function loadAppointmentsForPatient() {
  try {
    const appointments = await getAppointmentsForPatient(
      selectedDate,
      token
    );

    appointmentTableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      appointmentTableBody.innerHTML = `
          <tr>
              <td colspan="5" class="noPatientRecord">
                  No Appointments found for today
              </td>
          </tr>
      `;
      return;
    }

    let rowNumber = 1;
    appointments.forEach((appointment) => {
      const doctor = appointment.doctor || {};

      const row = createAppointmentRowForPatient({
        rowNumber,
        doctor: doctor.name,
        specialty: doctor.specialty,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTimeOnly,
        appointmentId: appointment.id,
        appointment: appointment
      });

      rowNumber++;
      appointmentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);

    appointmentTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="noPatientRecord">
                Failed to load appointments
            </td>
        </tr>
    `;
  }
}
