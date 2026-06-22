import {API_BASE_URL} from "../config/config.js";

const PATIENT_API = API_BASE_URL + "/patient";

export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    return {
      success: response.ok,
      message: result.message || "Signup successful"
    };
  } catch (error) {
    console.error("Patient signup error:", error);

    return {
      success: false,
      message: "Unable to complete signup"
    };
  }
}

export async function patientLogin(data) {
  try {
    return await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Patient login error:", error);
    throw error;
  }
}

export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patient data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}

export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(
      `${PATIENT_API}/appointments/${user}/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const queryParams = new URLSearchParams();

    if (condition) {
      queryParams.append("condition", condition);
    }

    if (name) {
      queryParams.append("name", name);
    }

    const response = await fetch(
      `${PATIENT_API}/appointments/filter?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to filter appointments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Unable to filter appointments at this time.");
    return [];
  }
}
