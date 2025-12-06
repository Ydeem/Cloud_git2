// ========= CONFIG =========
const API_BASE_URL = "https://5eeivz2isa.execute-api.us-east-1.amazonaws.com/tests";
// ==========================

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

// Generic handlers
function handleSuccess(action, res, data) {
  console.log(`${action} response:`, data);
  if (res.ok) {
    showToast(`${action}: Success (HTTP ${res.status})`, "success");
  } else {
    showToast(`${action}: Failed (HTTP ${res.status})`, "error");
  }
}

function handleError(action, err) {
  console.error(`${action} error:`, err);
  showToast(`${action}: Network error`, "error");
}

// Add Employee (POST /employee)
document.getElementById("addEmployeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee_id = document.getElementById("addEmployeeId").value.trim();
  const name = document.getElementById("addEmployeeName").value.trim();
  const department = document.getElementById("addEmployeeDept").value.trim();
  const role = document.getElementById("addEmployeeRole").value.trim();

  const body = { employee_id, name };
  if (department) body.department = department;
  if (role) body.role = role;

  try {
    const res = await fetch(`${API_BASE_URL}/employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    handleSuccess("Add Employee", res, data);
  } catch (err) {
    handleError("Add Employee", err);
  }
});

// Get One Employee (GET /employee?employee_id=ID)
document.getElementById("getEmployeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee_id = document.getElementById("getEmployeeId").value.trim();
  if (!employee_id) return;

  const url = `${API_BASE_URL}/employee?employee_id=${encodeURIComponent(employee_id)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    handleSuccess("Get Employee", res, data);
  } catch (err) {
    handleError("Get Employee", err);
  }
});

// Get All Employees (GET /employees)
document.getElementById("getAllEmployeesBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/employees`);
    const data = await res.json();
    handleSuccess("Get All Employees", res, data);
  } catch (err) {
    handleError("Get All Employees", err);
  }
});

// Update Employee (PATCH /employee)
document.getElementById("updateEmployeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee_id = document.getElementById("updateEmployeeId").value.trim();
  const updateKey = document.getElementById("updateKey").value.trim();
  const updateValue = document.getElementById("updateValue").value.trim();

  if (!employee_id || !updateKey) return;

  const body = { employee_id, updateKey, updateValue };

  try {
    const res = await fetch(`${API_BASE_URL}/employee`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    handleSuccess("Update Employee", res, data);
  } catch (err) {
    handleError("Update Employee", err);
  }
});

// Delete Employee (DELETE /employee)
document.getElementById("deleteEmployeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee_id = document.getElementById("deleteEmployeeId").value.trim();
  if (!employee_id) return;

  const body = { employee_id };

  try {
    const res = await fetch(`${API_BASE_URL}/employee`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    handleSuccess("Delete Employee", res, data);
  } catch (err) {
    handleError("Delete Employee", err);
  }
});


