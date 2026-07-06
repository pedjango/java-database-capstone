export function createPatientRow({
                                   rowNumber,
                                   appointmentId,
                                   patientId,
                                   patientName,
                                   patientPhone,
                                   patientEmail
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
            <button class="view-btn dashboard-btn-secondary" data-id="${appointmentId}">
                View
            </button>

            <button class="delete-btn dashboard-btn-delete" data-id="${appointmentId}">
                Delete
            </button>
        </div>
    </td>
  `;

  const viewBtn = tr.querySelector(".view-btn");
  const deleteBtn = tr.querySelector(".delete-btn");

  viewBtn.addEventListener("click", () => {
    alert(`Appointment ID: ${appointmentId}`);
    // TODO | openModal("appointmentDetails", appointmentId)
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this appointment?");

    if (!confirmDelete) return;

    console.log("DELETE appointment:", appointmentId);

    // TODO await deleteAppointment(appointmentId)
    // tr.remove()
  });

  return tr;
}

export function createAppointmentRowForPatient({
                                   rowNumber,
                                   doctor,
                                   specialty,
                                   appointmentDate,
                                   appointmentTime,
                                   appointmentId
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
            <button class="view-btn dashboard-btn-secondary" data-id="${appointmentId}">
                View
            </button>

            <button class="delete-btn dashboard-btn-delete" data-id="${appointmentId}">
                Delete
            </button>
        </div>
    </td>
  `;

  const viewBtn = tr.querySelector(".view-btn");
  const deleteBtn = tr.querySelector(".delete-btn");

  viewBtn.addEventListener("click", () => {
    alert(`Appointment ID: ${appointmentId}`);
    // TODO | openModal("appointmentDetails", appointmentId)
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this appointment?");

    if (!confirmDelete) return;

    console.log("DELETE appointment:", appointmentId);

    // TODO await deleteAppointment(appointmentId)
    // tr.remove()
  });

  return tr;
}
