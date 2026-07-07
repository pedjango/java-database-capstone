import { API_BASE_URL } from "../config/config.js";

const APPOINTMENT_BASE_API = API_BASE_URL + "/appointments";

export async function getAppointments(date, patientName, token) {
  try {
    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    if (patientName && patientName !== "null") {
      params.append("patientName", patientName);
    }

    const response = await fetch(
      `${APPOINTMENT_BASE_API}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function getAppointmentsForPatient(date, token) {
  try {
    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    const response = await fetch(
      `${APPOINTMENT_BASE_API}/patient?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function submitAppointment(doctor) {
  const token = localStorage.getItem("token");
  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("appointmentTime").value;
  const reasonForVisit = document.getElementById("reasonForVisit").value;

  if (!date || !time) {
    alert("Please select date and time.");
    return;
  }

  const startTime = time.split("-")[0];
  const appointmentTime = `${date}T${startTime}:00`;

  const appointment = {
    doctor: {
      id: doctor.id,
    },
    status: 0,
    appointmentTime,
    reasonForVisit
  };

  try {
    const response = await fetch(
      `${APPOINTMENT_BASE_API}/book`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          appointment
        )
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    alert("Appointment booked successfully.");

    document.getElementById("modal").style.display = "none";
  } catch (error) {
    console.error(error);
    alert("Unable to book appointment.");
  }
}

export async function viewAppointmentDetails(appointmentId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${APPOINTMENT_BASE_API}/${appointmentId}/details`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    alert("Unable to view appointment.");
  }
}

export async function cancelAppointment(appointmentId, patientId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${APPOINTMENT_BASE_API}/cancel/${appointmentId}/${patientId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    alert("Appointment deleted successfully.");

    document.getElementById("modal").style.display = "none";
  } catch (error) {
    console.error(error);
    alert("Unable to delete appointment.");
  }
}
