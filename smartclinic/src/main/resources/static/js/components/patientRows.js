export function createPatientRow({
                                   appointmentId,
                                   patientId,
                                   patientName,
                                   patientPhone,
                                   patientEmail,
                                   prescription
                                 }) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${patientName ?? "-"}</td>
    <td>${patientPhone ?? "-"}</td>
    <td>${patientEmail ?? "-"}</td>
    <td>${prescription ?? "-"}</td>
    <td>
        <div class="row-actions">
            <button class="view-btn" data-id="${appointmentId}">
                View
            </button>

            <button class="delete-btn" data-id="${appointmentId}">
                Delete
            </button>
        </div>
    </td>
  `;

  const viewBtn = tr.querySelector(".view-btn");
  const deleteBtn = tr.querySelector(".delete-btn");

  viewBtn.addEventListener("click", () => {
    alert(`Appointment ID: ${appointmentId}`);
    // kasnije: openModal("appointmentDetails", appointmentId)
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    console.log("DELETE appointment:", appointmentId);

    // kasnije:
    // await deleteAppointment(appointmentId)
    // tr.remove()
  });

  return tr;
}
