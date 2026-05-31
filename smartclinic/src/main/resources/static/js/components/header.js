function renderHeader() {
  const headerDiv = document.getElementById("header");

  if (!headerDiv) return;

  let headerContent = "";

  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (
    (role === "loggedPatient" || role === "admin" || role === "doctor") &&
    !token
  ) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  if (role === "admin") {
    headerContent += `
            <nav class="header-nav">
                <button id="addDocBtn" class="adminBtn">Add Doctor</button>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>
        `;
  }

  else if (role === "doctor") {
    headerContent += `
            <nav class="header-nav">
                <a href="/doctorDashboard">Home</a>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>
        `;
  }

  else if (role === "patient") {
    headerContent += `
            <nav class="header-nav">
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
            </nav>
        `;
  }

  else if (role === "loggedPatient") {
    headerContent += `
            <nav class="header-nav">
                <a href="/patientDashboard">Home</a>
                <a href="/appointments">Appointments</a>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>
        `;
  }

  else {
    headerContent += `
            <nav class="header-nav">
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
            </nav>
        `;
  }

  headerDiv.innerHTML = headerContent;

  attachHeaderButtonListeners();
}


function attachHeaderButtonListeners() {

  const addDocBtn = document.getElementById("addDocBtn");
  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      openModal("addDoctor");
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");

  window.location.href = "/";
}


function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");

  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", renderHeader);
