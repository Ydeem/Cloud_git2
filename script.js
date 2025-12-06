// ========= CONFIG =========
const API_BASE_URL = "https://5eeivz2isa.execute-api.us-east-1.amazonaws.com/tests";
// =========================

// Small helper to safely join base URL + path + query params
function buildUrl(path, queryParams = {}) {
  // remove trailing slashes from base
  let base = API_BASE_URL.replace(/\/+$/, "");
  // remove leading slashes from path
  let cleanPath = path.replace(/^\/+/, "");
  let url = `${base}/${cleanPath}`;

  const params = new URLSearchParams(queryParams);
  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }
  return url;
}

const toastContainer = document.getElementById("toastContainer");

// Toast helper
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = document.createElement("span");
  icon.className = "toast-icon";

  if (type === "success") icon.textContent = "✅";
  else if (type === "error") icon.textContent = "⚠️";
  else icon.textContent = "ℹ️";

  const msg = document.createElement("span");
  msg.className = "toast-message";
  msg.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(msg);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-4px)";
    setTimeout(() => toast.remove(), 200);
  }, 3800);
}

function handleSuccess(action, res, data, url) {
  console.log(`✅ ${action} | URL: ${url} | HTTP ${res.status}`, data);
  if (res.ok) {
    showToast(`${action}: Success (HTTP ${res.status})`, "success");
  } else {
    showToast(`${action}: Failed (HTTP ${res.status})`, "error");
  }
}

function handleError(action, err, url) {
  console.error(`❌ ${action} | URL: ${url} | Error:`, err);
  showToast(`${action}: Network / CORS error`, "error");
}

/* ----------------- ADD EMPLOYEE (POST /employee) ----------------- */

document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee_id = document
      .getElementById("addEmployeeId")
      .value.trim();
    const name = document.getElementById("addEmployeeName").value.trim();
    const department = document
      .getElementById("addEmployeeDept")
      .value.trim();
    const role = document.getElementById("addEmployeeRole").value.trim();

    const body = { employee_id, name };
    if (department) body.department = department;
    if (role) body.role = role;

    const url = buildUrl("employee");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      handleSuccess("Add Employee", res, data, url);
    } catch (err) {
      handleError("Add Employee", err, url);
    }
  });

/* -------- GET ONE EMPLOYEE (GET /employee?employee_id=ID) -------- */

document
  .getElementById("getEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee_id = document
      .getElementById("getEmployeeId")
      .value.trim();
    if (!employee_id) return;

    const url = buildUrl("employee", { employee_id });

    try {
      const res = await fetch(url);
      const data = await res.json();
      handleSuccess("Get Employee", res, data, url);
    } catch (err) {
      handleError("Get Employee", err, url);
    }
  });

/* ------------- GET ALL EMPLOYEES (GET /employees) ------------- */

document
  .getElementById("getAllEmployeesBtn")
  .addEventListener("click", async () => {
    const url = buildUrl("employees");

    try {
      const res = await fetch(url);
      const data = await res.json();
      handleSuccess("Get All Employees", res, data, url);
    } catch (err) {
      handleError("Get All Employees", err, url);
    }
  });

/* ------------- UPDATE EMPLOYEE (PATCH /employee) ------------- */

document
  .getElementById("updateEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee_id = document
      .getElementById("updateEmployeeId")
      .value.trim();
    const updateKey = document.getElementById("updateKey").value.trim();
    const updateValue = document.getElementById("updateValue").value.trim();

    if (!employee_id || !updateKey) return;

    const body = { employee_id, updateKey, updateValue };
    const url = buildUrl("employee");

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      handleSuccess("Update Employee", res, data, url);
    } catch (err) {
      handleError("Update Employee", err, url);
    }
  });

/* ------------- DELETE EMPLOYEE (DELETE /employee) ------------- */

document
  .getElementById("deleteEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee_id = document
      .getElementById("deleteEmployeeId")
      .value.trim();
    if (!employee_id) return;

    const body = { employee_id };
    const url = buildUrl("employee");

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      handleSuccess("Delete Employee", res, data, url);
    } catch (err) {
      handleError("Delete Employee", err, url);
    }
  });

/* ----------------- OPTIONAL: LOG BASE URL ON LOAD ----------------- */

console.log("API_BASE_URL in frontend is:", API_BASE_URL);

