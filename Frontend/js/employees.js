let allEmployees = [];
let currentFilter = "Active";

/***********************
 * DEBOUNCE HELPER
 ***********************/
function debounce(fn, delay = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/***********************
 * LOAD ALL EMPLOYEES
 ***********************/
async function loadEmployees() {
  try {
    const res = await fetch("http://localhost:3000/api/user/get-all-employees");
    const data = await res.json();
    allEmployees = data;
    renderTable(data);
  } catch (err) {
    console.error("Load employees error:", err);
  }
}

/***********************
 * RENDER TABLE
 ***********************/
function renderTable(list) {
  const tbody = document.getElementById("employeeTableBody");
  tbody.innerHTML = "";

  if (!list || !list.length) {
    tbody.innerHTML = `<tr><td colspan="9">No employees found</td></tr>`;
    return;
  }

  list.forEach((emp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${emp.employee_id}</td>
  <td>${emp.full_name}</td>
  <td>${emp.email}</td>
  <td>${emp.department}</td>
  <td>${emp.designation}</td>
  <td>${emp.employment_type}</td>
  <td>${emp.assigned_shift}</td>
  <td>${emp.status || "Active"}</td>
  <td class="actions-cell">
    <div class="menu-wrapper">
      <i class="fas fa-ellipsis-v menu-btn"></i>
      <div class="menu-dropdown">
        <div class="menu-item" onclick="viewEmployee('${emp.employee_id}')">
          <i class="fas fa-eye"></i> View
        </div>
        <div class="menu-item" onclick="editEmployee('${emp.employee_id}')">
          <i class="fas fa-pen"></i> Edit
        </div>
        <div class="menu-item menu-deactivate" onclick="deactivateEmployee('${emp.employee_id}')">
          <i class="fas fa-ban"></i> Deactivate
        </div>
        <div class="menu-item menu-delete" onclick="deleteEmployee('${emp.employee_id}')">
        <i class="fas fa-trash-alt"></i> Delete
      </div>
      </div>
    </div>
  </td>
`;

    tbody.appendChild(row);
  });
}

/***********************
 * SEARCH (DEBOUNCED)
 ***********************/
const searchInput = document.getElementById("searchInput");

const handleSearch = debounce(async (e) => {
  const q = e.target.value.trim();

  if (!q) {
    loadEmployees();
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/user/get-employee?q=${encodeURIComponent(q)}`,
    );
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error("Search error:", err);
  }
}, 500);

searchInput.addEventListener("input", handleSearch);

/***********************
 * FILTER BUTTONS
 ***********************/
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    currentFilter = btn.dataset.status;

    if (currentFilter === "All") {
      renderTable(allEmployees);
    } else {
      const filtered = allEmployees.filter(
        (emp) => emp.status === currentFilter,
      );
      renderTable(filtered);
    }
  });
});

/***********************
 * 3-DOT MENU TOGGLE
 ***********************/
document.addEventListener("click", (e) => {
  const menuWrapper = e.target.closest(".menu-wrapper");

  document.querySelectorAll(".menu-wrapper").forEach((m) => {
    if (m !== menuWrapper) m.classList.remove("open");
  });

  if (menuWrapper) {
    e.stopPropagation();
    menuWrapper.classList.toggle("open");
  }
});

/***********************
 * ACTION HANDLERS
 ***********************/
function viewEmployee(id) {
  alert("View employee " + id);
}

function editEmployee(id) {
  alert("Edit employee " + id);
}

function deactivateEmployee(id) {
  alert("Deactivate employee " + id);
}

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", loadEmployees);

let editingEmployee = null; // Track the employee being edited

/***********************
 * SHOW / HIDE FORM
 ***********************/
function showEditForm() {
  document.querySelector(".card").style.display = "none"; // Hide table card
  document.getElementById("employeeFormWrapper").style.display = "flex"; // Show form
}

function hideEditForm() {
  document.querySelector(".card").style.display = "block"; // Show table again
  document.getElementById("employeeFormWrapper").style.display = "none"; // Hide form
  document.getElementById("employeeForm").reset(); // Clear form
  editingEmployee = null;
}

/***********************
 * EDIT EMPLOYEE
 ***********************/
function editEmployee(id) {
  // Find employee from cached allEmployees (fast & no extra API call needed)
  const emp = allEmployees.find((e) => String(e.employee_id) === String(id));

  if (!emp) {
    alert("Employee not found");
    return;
  }

  editingEmployee = emp;

  // Populate form with existing values
  document.getElementById("empExternalId").value = emp.external_id;
  document.getElementById("empEmployeeId").value = emp.employee_id || "";
  document.getElementById("empFullName").value = emp.full_name || "";
  document.getElementById("empEmail").value = emp.email || "";
  document.getElementById("empDepartment").value = emp.department || "";
  document.getElementById("empDesignation").value = emp.designation || "";
  document.getElementById("empType").value = emp.employment_type || "";
  document.getElementById("empShift").value = emp.assigned_shift || "";
  document.getElementById("empStatus").value = emp.status || "Active";

  showEditForm();
}

/***********************
 * CANCEL BUTTON
 ***********************/
document.getElementById("cancelEditBtn").addEventListener("click", () => {
  hideEditForm();
});

/***********************
 * SAVE (UPDATE) EMPLOYEE
 ***********************/
document
  .getElementById("employeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      employee_id: document.getElementById("empEmployeeId").value.trim(), // prefilled readonly value
      full_name: document.getElementById("empFullName").value.trim(),
      email: document.getElementById("empEmail").value.trim(),
      department: document.getElementById("empDepartment").value.trim(),
      designation: document.getElementById("empDesignation").value.trim(),
      employment_type: document.getElementById("empType").value,
      assigned_shift: document.getElementById("empShift").value.trim(),
      status: document.getElementById("empStatus").value,
    };

    try {
      const res = await fetch(
        "http://localhost:3000/api/user/update-employee",
        {
          method: "PUT", // or 'POST' if your backend uses POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      if (res.ok) {
        alert("Employee updated successfully!");
        await loadEmployees(); // Refresh table with new data
        hideEditForm();
      } else {
        const error = await res.text();
        alert("Update failed: " + error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error connecting to server");
    }
  });

/*********************** 
 * DELETE EMPLOYEE 
 ***********************/
function deleteEmployee(id) {
  const emp = allEmployees.find(e => e.employee_id === id);
  if (!emp) {
    return alert("Employee not found");
  }

  if (!confirm(`Permanently delete employee ${emp.employee_id} - ${emp.full_name}?\nThis action CANNOT be undone!`)) {
    return;
  }

  fetch('http://localhost:3000/api/user/delete-employee', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id: id })
  })
  .then(res => {
    if (res.ok) {
      alert('Employee deleted successfully');
      loadEmployees(); // Refresh table (removed row will disappear)
    } else {
      res.text().then(txt => alert('Delete failed: ' + txt));
    }
  })
  .catch(err => {
    console.error('Delete error:', err);
    alert('Error connecting to server');
  });
}
