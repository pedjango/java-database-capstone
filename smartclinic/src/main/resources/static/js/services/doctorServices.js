import {API_BASE_URL} from "../config/config.js";

const DOCTOR_BASE_API = API_BASE_URL + "/doctor";

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_BASE_API);

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_BASE_API}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete doctor");
    }

    return {
      success: response.ok,
      message: response.message || "Doctor deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);

    return {
      success: false,
      message: "Failed to delete doctor"
    };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_BASE_API + "/register", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    if (!response.ok) {
      throw new Error("Failed to create doctor");
    }

    return {
      success: response.ok,
      message: response.message || "Doctor created successfully",
    };
  } catch (error) {
    console.error("Error creating doctor:", error);

    return {
      success: false,
      message: "Failed to creat doctor"
    };
  }
}

export async function updateDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_BASE_API + "/update/" + doctor.id, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    if (!response.ok) {
      throw new Error("Failed to update doctor");
    }

    return {
      success: response.ok,
      message: response.message || "Doctor updated successfully",
    };
  } catch (error) {
    console.error("Error updating doctor:", error);

    return {
      success: false,
      message: "Failed to update doctor"
    };
  }
}

export async function filterDoctors(name = "", time = "", specialty = "") {
  try {
    const queryParams = new URLSearchParams();

    if (name) {
      queryParams.append("name", name);
    }

    if (time) {
      queryParams.append("time", time);
    }

    if (specialty) {
      queryParams.append("specialty", specialty);
    }

    const response = await fetch(
      `${DOCTOR_BASE_API}/filter?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to filter doctors");
    }

    return await response.json();
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("Unable to filter doctors at this time.");
    return [];
  }
}
