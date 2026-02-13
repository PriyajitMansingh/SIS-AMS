// let allEmployees = [];
// let currentFilter = "Active";

// /***********************
//  * DEBOUNCE HELPER
//  ***********************/
// function debounce(fn, delay = 500) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }

// /***********************
//  * LOAD ALL EMPLOYEES
//  ***********************/
// async function loadEmployees() {
//   try {
//     const res = await fetch("http://localhost:3000/api/user/get-all-employees");
//     const data = await res.json();
//     allEmployees = data;
//     renderTable(data);
//   } catch (err) {
//     console.error("Load employees error:", err);
//   }
// }

// /***********************
//  * RENDER TABLE
//  ***********************/
// function renderTable(list) {
//   const tbody = document.getElementById("employeeTableBody");
//   tbody.innerHTML = "";
//   if (!list || !list.length) {
//     tbody.innerHTML = `<tr><td colspan="9">No employees found</td></tr>`;
//     return;
//   }

//   list.forEach((emp) => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td>${emp.employee_id}</td>
//       <td>${emp.full_name}</td>
//       <td>${emp.email}</td>
//       <td>${emp.department}</td>
//       <td>${emp.designation}</td>
//       <td>${emp.employment_type}</td>
//       <td>${emp.assigned_shift}</td>
//       <td>${emp.status || "Active"}</td>
// <td class="actions-cell">
//   <div class="actions-buttons">
//     <button class="icon-btn view-btn" title="View" onclick="viewEmployee('${emp.employee_id}')">
//       <i class="fas fa-eye"></i>
//     </button>
//     <button class="icon-btn edit-btn" title="Edit" onclick="editEmployee('${emp.employee_id}')">
//       <i class="fas fa-pen"></i>
//     </button>
//   </div>
// </td>
//     `;
//     tbody.appendChild(row);
//   });
// }

// /***********************
//  * SEARCH (DEBOUNCED)
//  ***********************/
// const searchInput = document.getElementById("searchInput");
// const handleSearch = debounce(async (e) => {
//   const q = e.target.value.trim();
//   if (!q) {
//     loadEmployees();
//     return;
//   }
//   try {
//     const res = await fetch(
//       `http://localhost:3000/api/user/get-employee?q=${encodeURIComponent(q)}`,
//     );
//     const data = await res.json();
//     renderTable(data);
//   } catch (err) {
//     console.error("Search error:", err);
//   }
// }, 500);
// searchInput.addEventListener("input", handleSearch);

// /***********************
//  * FILTER BUTTONS
//  ***********************/
// document.querySelectorAll(".filter-btn").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     document
//       .querySelectorAll(".filter-btn")
//       .forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//     currentFilter = btn.dataset.status;
//     if (currentFilter === "All") {
//       renderTable(allEmployees);
//     } else {
//       const filtered = allEmployees.filter(
//         (emp) => emp.status === currentFilter,
//       );
//       renderTable(filtered);
//     }
//   });
// });

// /***********************
//  * 3-DOT MENU TOGGLE
//  ***********************/
// // document.addEventListener("click", (e) => {
// //   const menuWrapper = e.target.closest(".menu-wrapper");
// //   document.querySelectorAll(".menu-wrapper").forEach((m) => {
// //     if (m !== menuWrapper) m.classList.remove("open");
// //   });
// //   if (menuWrapper) {
// //     e.stopPropagation();
// //     menuWrapper.classList.toggle("open");
// //   }
// // });

// /***********************
//  * FORM HELPER FUNCTIONS
//  ***********************/
// function populateEmployeeForm(emp) {
//   document.getElementById("empEmployeeId").value = emp.employee_id || "";
//   document.getElementById('empExternalId').value = emp.external_id || '';
//   document.getElementById("empFullName").value = emp.full_name || "";
//   document.getElementById("empEmail").value = emp.email || "";
//   document.getElementById("empMobile").value = emp.mobile || "";
//   document.getElementById("empDepartment").value = emp.department || "";
//   document.getElementById("empDesignation").value = emp.designation || "";
//   document.getElementById("empType").value = emp.employment_type || "";
//   document.getElementById("empShift").value = emp.assigned_shift || "";
//   // document.getElementById('empHireDate').value = emp.hire_date || '';
//   //for date format time zone
//   if (emp.hire_date) {
//     const d = new Date(emp.hire_date);

//     document.getElementById("empHireDate").value =
//       d.getFullYear() +
//       "-" +
//       String(d.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(d.getDate()).padStart(2, "0");
//   } else {
//     document.getElementById("empHireDate").value = "";
//   }

//   document.getElementById("empBaseSalary").value = emp.base_salary || "";
//   document.getElementById("empHourlyRate").value = emp.hourly_rate || "";
//   document.getElementById("empStatus").value = emp.status || "Active";
// }

// function showEmployeeForm(mode, emp) {
//   // mode: 'view' or 'edit'
//   populateEmployeeForm(emp);
 

//   document.getElementById("formTitle").textContent =
//     mode === "view" ? "View Employee Details" : "Edit Employee";

//   // Text/number/date inputs
//   document
//     .querySelectorAll('#employeeForm input:not([type="hidden"])')
//     .forEach((input) => {
//       input.readOnly = mode === "view";
//     });

//   // Selects
//   document.querySelectorAll("#employeeForm select").forEach((select) => {
//     select.disabled = mode === "view";
//   });

//   // Employee ID always readonly
//   document.getElementById("empEmployeeId").readOnly = true;

//   // Buttons
//   document.getElementById("saveBtn").style.display =
//     mode === "view" ? "none" : "block";
//     document.getElementById("deleteBtn").style.display = mode === "view" ? "none" : "block";
//   document.getElementById("cancelBtn").textContent =
//     mode === "view" ? "Close" : "Cancel";
    

//   // Show form, hide table
//   document.querySelector(".card").style.display = "none";
//   document.getElementById("employeeFormWrapper").style.display = "flex";
// }

// function hideEmployeeForm() {
//   document.querySelector(".card").style.display = "block";
//   document.getElementById("employeeFormWrapper").style.display = "none";
//   document.getElementById("employeeForm").reset();
// }

// /***********************
//  * ACTION HANDLERS
//  ***********************/
// function viewEmployee(id) {
//   const emp = allEmployees.find((e) => e.employee_id === id);
//   if (!emp) return alert("Employee not found");
//   showEmployeeForm("view", emp);
// }

// function editEmployee(id) {
//   const emp = allEmployees.find((e) => e.employee_id === id);
//   if (!emp) return alert("Employee not found");
//   showEmployeeForm("edit", emp);
// }

// // function deactivateEmployee(id) {
// //   const emp = allEmployees.find((e) => e.employee_id === id);
// //   if (!emp) return alert("Employee not found");

// //   if (!confirm(`Deactivate employee ${emp.employee_id} - ${emp.full_name}?`))
// //     return;

// //   fetch("http://localhost:3000/api/user/update-employee", {
// //     method: "PUT",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ employee_id: id, status: "Inactive" }),
// //   })
// //     .then((res) =>
// //       res.ok
// //         ? loadEmployees()
// //         : res.text().then((txt) => alert("Failed: " + txt)),
// //     )
// //     .catch(() => alert("Error deactivating employee"));
// // }

// document.getElementById("deleteBtn").addEventListener("click", () => {
//   const empId = document.getElementById("empEmployeeId").value.trim();
//   const empName = document.getElementById("empFullName").value.trim();

//   if (!empId) {
//     alert("Employee ID not found");
//     return;
//   }

//   if (!confirm(`Permanently delete employee ${empId} - ${empName}?\nThis cannot be undone!`)) {
//     return;
//   }

//   fetch("http://localhost:3000/api/user/delete-employee", {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ employee_id: empId }),
//   })
//   .then((res) => {
//     if (res.ok) {
//       alert("Employee deleted successfully");
//       loadEmployees();  // Refresh table
//       hideEmployeeForm();  // Close form
//     } else {
//       res.text().then((txt) => alert("Delete failed: " + txt));
//     }
//   })
//   .catch(() => alert("Error deleting employee"));
// });

// /***********************
//  * INIT (DOMContentLoaded)
//  ***********************/
// document.addEventListener("DOMContentLoaded", () => {
//   loadEmployees();

//   // Form listeners (safe after DOM load)
//   document
//     .getElementById("cancelBtn")
//     .addEventListener("click", hideEmployeeForm);

//   document
//     .getElementById("employeeForm")
//     .addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const updatedData = {
//         employee_id: document.getElementById("empEmployeeId").value.trim(),
//         external_id: document.getElementById('empExternalId').value.trim() || null,
//         full_name: document.getElementById("empFullName").value.trim(),
//         email: document.getElementById("empEmail").value.trim(),
//         mobile: document.getElementById("empMobile").value.trim() || null,
//         department: document.getElementById("empDepartment").value.trim(),
//         designation: document.getElementById("empDesignation").value.trim(),
//         employment_type: document.getElementById("empType").value,
//         assigned_shift:
//           document.getElementById("empShift").value.trim() || null,
//         hire_date: document.getElementById("empHireDate").value || null,
//         base_salary: document.getElementById("empBaseSalary").value
//           ? parseFloat(document.getElementById("empBaseSalary").value) || null
//           : null,
//         hourly_rate: document.getElementById("empHourlyRate").value
//           ? parseFloat(document.getElementById("empHourlyRate").value) || null
//           : null,
//         status: document.getElementById("empStatus").value,
//       };

//       try {
//         const res = await fetch(
//           "http://localhost:3000/api/user/update-employee",
//           {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedData),
//           },
//         );

//         if (res.ok) {
//           alert("Employee updated successfully!");
//           await loadEmployees();
//           hideEmployeeForm();
//         } else {
//           const error = await res.text();
//           alert("Update failed:duplicate key ! ");
//         }
//       } catch (err) {
//         console.error("Update error:", err);
//         alert("Error connecting to server");
//       }
//     });
// });



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
        <div class="actions-buttons">
          <button class="icon-btn view-btn" title="View" onclick="viewEmployee('${emp.employee_id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="icon-btn edit-btn" title="Edit" onclick="editEmployee('${emp.employee_id}')">
            <i class="fas fa-pen"></i>
          </button>
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
    const res = await fetch(`http://localhost:3000/api/user/get-employee?q=${encodeURIComponent(q)}`);
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
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.status;
    if (currentFilter === "All") {
      renderTable(allEmployees);
    } else {
      const filtered = allEmployees.filter((emp) => emp.status === currentFilter);
      renderTable(filtered);
    }
  });
});

/***********************
 * FORM HELPER FUNCTIONS
 ***********************/
function populateEmployeeForm(emp) {
  document.getElementById("empEmployeeId").value = emp.employee_id || "";
  document.getElementById('empExternalId').value = emp.external_id || '';
  document.getElementById("empFullName").value = emp.full_name || "";
  document.getElementById("empEmail").value = emp.email || "";
  document.getElementById("empMobile").value = emp.mobile || "";
  document.getElementById("empDepartment").value = emp.department || "";
  document.getElementById("empDesignation").value = emp.designation || "";
  document.getElementById("empType").value = emp.employment_type || "";
  document.getElementById("empShift").value = emp.assigned_shift || "";
  
  if (emp.hire_date) {
    const d = new Date(emp.hire_date);
    document.getElementById("empHireDate").value =
      d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  } else {
    document.getElementById("empHireDate").value = "";
  }

  document.getElementById("empBaseSalary").value = emp.base_salary || "";
  document.getElementById("empHourlyRate").value = emp.hourly_rate || "";
  document.getElementById("empStatus").value = emp.status || "Active";
}

function showEmployeeForm(mode, emp) {
  populateEmployeeForm(emp);

  document.getElementById("formTitle").textContent =
    mode === "view" ? "View Employee Details" : "Edit Employee";

  document.querySelectorAll('#employeeForm input:not([type="hidden"])').forEach((input) => {
    input.readOnly = mode === "view";
  });

  document.querySelectorAll("#employeeForm select").forEach((select) => {
    select.disabled = mode === "view";
  });

  document.getElementById("empEmployeeId").readOnly = true;

  // Buttons visibility
  document.getElementById("saveBtn").style.display = mode === "view" ? "none" : "block";
  document.getElementById("deleteBtn").style.display = mode === "view" ? "none" : "block";
  document.getElementById("cancelBtn").textContent = mode === "view" ? "Close" : "Cancel";

  document.querySelector(".card").style.display = "none";
  document.getElementById("employeeFormWrapper").style.display = "flex";
}

function hideEmployeeForm() {
  document.querySelector(".card").style.display = "block";
  document.getElementById("employeeFormWrapper").style.display = "none";
  document.getElementById("employeeForm").reset();
}

/***********************
 * ACTION HANDLERS
 ***********************/
function viewEmployee(id) {
  const emp = allEmployees.find((e) => e.employee_id === id);
  if (!emp) return alert("Employee not found");
  showEmployeeForm("view", emp);
}

function editEmployee(id) {
  const emp = allEmployees.find((e) => e.employee_id === id);
  if (!emp) return alert("Employee not found");
  showEmployeeForm("edit", emp);
}

/***********************
 * INIT (DOMContentLoaded)
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();

  // Cancel/Close button
  document.getElementById("cancelBtn").addEventListener("click", hideEmployeeForm);

  // Delete button (in Edit mode)
  document.getElementById("deleteBtn").addEventListener("click", () => {
    const empId = document.getElementById("empEmployeeId").value.trim();
    const empName = document.getElementById("empFullName").value.trim();

    if (!empId) {
      alert("Employee ID not found");
      return;
    }

    if (!confirm(`Permanently delete employee ${empId} - ${empName}?\nThis cannot be undone!`)) {
      return;
    }

    fetch("http://localhost:3000/api/user/delete-employee", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: empId }),
    })
    .then((res) => {
      if (res.ok) {
        alert("Employee deleted successfully");
        loadEmployees();
        hideEmployeeForm();
      } else {
        res.text().then((txt) => alert("Delete failed: " + txt));
      }
    })
    .catch(() => alert("Error deleting employee"));
  });

  // Form submit (Save Changes)
  document.getElementById("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      employee_id: document.getElementById("empEmployeeId").value.trim(),
      external_id: document.getElementById('empExternalId').value.trim() || null,
      full_name: document.getElementById("empFullName").value.trim(),
      email: document.getElementById("empEmail").value.trim(),
      mobile: document.getElementById("empMobile").value.trim() || null,
      department: document.getElementById("empDepartment").value.trim(),
      designation: document.getElementById("empDesignation").value.trim(),
      employment_type: document.getElementById("empType").value,
      assigned_shift: document.getElementById("empShift").value.trim() || null,
      hire_date: document.getElementById("empHireDate").value || null,
      base_salary: document.getElementById("empBaseSalary").value ? parseFloat(document.getElementById("empBaseSalary").value) || null : null,
      hourly_rate: document.getElementById("empHourlyRate").value ? parseFloat(document.getElementById("empHourlyRate").value) || null : null,
      status: document.getElementById("empStatus").value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/user/update-employee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert("Employee updated successfully!");
        await loadEmployees();
        hideEmployeeForm();
      } else {
        const error = await res.text();
        alert("Update failed: " + error);  // Shows actual backend error (duplicate external_id, etc.)
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error connecting to server");
    }
  });
});