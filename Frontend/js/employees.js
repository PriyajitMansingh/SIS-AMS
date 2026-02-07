/***********************
 * GLOBAL STATE
 ***********************/

// const addEmployeeBtn = document.getElementById("addEmployeeBtn");
// const formWrapper = document.getElementById("employeeFormWrapper");
// const cancelFormBtn = document.getElementById("cancelFormBtn");

// addEmployeeBtn.addEventListener("click", () => {
//   formWrapper.style.display = "block";
//   formWrapper.scrollIntoView({ behavior: "smooth" });
// });

// cancelFormBtn.addEventListener("click", () => {
//   formWrapper.style.display = "none";
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
      <td>${emp.external_id}</td>
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
            <div onclick="viewEmployee(${emp.external_id})">View</div>
            <div onclick="editEmployee(${emp.external_id})">Edit</div>
            <div onclick="deactivateEmployee(${emp.external_id})">Deactivate</div>
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
      `http://localhost:3000/api/user/get-employees?q=${encodeURIComponent(q)}`,
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
