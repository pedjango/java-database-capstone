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
