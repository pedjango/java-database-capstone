import {openModal} from "./modals.js";
import {cancelAppointment, viewAppointmentDetails} from "../services/appointmentRecordService.js";

export function createPatientRow({
                                   rowNumber,
                                   appointmentId,
                                   patientId,
                                   patientName,
                                   patientPhone,
                                   patientEmail,
                                   appointment
                                 }) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${rowNumber ?? "-"}</td>
    <td>${patientId ?? "-"}</td>
    <td>${patientName ?? "-"}</td>
    <td>${patientPhone ?? "-"}</td>
    <td>${patientEmail ?? "-"}</td>
    <td>
        <div class="row-actions">
            <button class="view-btn dashboard-btn-secondary" id="appointmentDetailsDoctorBtn" data-id="${appointmentId}">
                View
            </button>

            <button class="delete-btn dashboard-btn-delete" id="appointmentDeleteDoctorBtn" data-id="${appointmentId}">
                Cancel
            </button>
        </div>
    </td>
  `;

  const viewBtn = tr.querySelector("#appointmentDetailsDoctorBtn");
  const deleteBtn = tr.querySelector("#appointmentDeleteDoctorBtn");

  viewBtn.addEventListener("click", () => {
    openModal("appointmentDetails", appointment);
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to cancel this appointment?");

    if (!confirmDelete) return;

    cancelAppointment(appointmentId).then(() => {
      tr.remove();
    });
  });

  return tr;
}

export function createAppointmentRowForPatient({
                                   rowNumber,
                                   doctor,
                                   specialty,
                                   appointmentDate,
                                   appointmentTime,
                                   appointmentId,
                                   appointment
                                 }) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${rowNumber ?? "-"}</td>
    <td>${doctor ?? "-"}</td>
    <td>${specialty ?? "-"}</td>
    <td>${appointmentDate ?? "-"}</td>
    <td>${appointmentTime ?? "-"}</td>
    <td>
        <div class="row-actions">
            <button class="view-btn dashboard-btn-secondary" id="appointmentDetailsPatientBtn" data-id="${appointmentId}">
                View
            </button>

            <button class="delete-btn dashboard-btn-delete" id="appointmentDeletePatientBtn" data-id="${appointmentId}">
                Cancel
            </button>
        </div>
    </td>
  `;

  const viewBtn = tr.querySelector("#appointmentDetailsPatientBtn");
  const deleteBtn = tr.querySelector("#appointmentDeletePatientBtn");

  viewBtn.addEventListener("click", () => {
    openModal("appointmentDetails", appointment);
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to cancel this appointment?");

    if (!confirmDelete) return;

    cancelAppointment(appointmentId).then(() => {
      tr.remove();
    });
  });

  return tr;
}
