document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const employeeInput = document.getElementById("regEmployee");
  const suggestionsList = document.getElementById("employeeSuggestions");
  const employeeIdHidden = document.getElementById("regEmployeeId");
  const fromTime = document.getElementById("regFromTime");
  const toTime = document.getElementById("regToTime");
  const totalHours = document.getElementById("regTotalHours");
  const form = document.getElementById("regularizationForm");
  
  employeeInput.addEventListener("input", debounce(async (e) => {
    const q = e.target.value.trim();

    if (q.length < 2) {
      suggestionsList.style.display = "none";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/user/get-employee?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      suggestionsList.innerHTML = "";
      if (data.length === 0) {
        suggestionsList.style.display = "none";
        return;
      }

      data.forEach((emp) => {
        const item = document.createElement("div");
        item.classList.add("suggestion-item");

        // Show ID + full name (first middle last)
        const fullName = [emp.first_name, emp.middle_name, emp.last_name]
          .filter(Boolean)
          .join(' ');

        item.textContent = `${emp.employee_id} - ${fullName}`;

        // When suggestion is clicked → fill input + hidden ID
        item.addEventListener("click", () => {
          employeeInput.value = fullName;               // Show only name in visible input
          employeeIdHidden.value = emp.employee_id;     // Set hidden ID for submit
          suggestionsList.style.display = "none";       // Hide dropdown
        });

        suggestionsList.appendChild(item);
      });

      suggestionsList.style.display = "block";
    } catch (err) {
      console.error("Employee search error:", err);
      suggestionsList.style.display = "none";
    }
  }, 300));

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!suggestionsList.contains(e.target) && e.target !== employeeInput) {
      suggestionsList.style.display = "none";
    }
  });

  // Auto-calculate total hours
  const calculateHours = () => {
    if (fromTime.value && toTime.value) {
      const from = new Date(`2000-01-01T${fromTime.value}`);
      const to = new Date(`2000-01-01T${toTime.value}`);
      if (to > from) {
        const hours = ((to - from) / 3600000).toFixed(2);
        totalHours.value = hours;
      } else {
        totalHours.value = "";
      }
    } else {
      totalHours.value = "";
    }
  };

  fromTime.addEventListener("change", calculateHours);
  toTime.addEventListener("change", calculateHours);

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      employee_id: employeeIdHidden.value.trim(),
      from_date: document.getElementById("regFromDate").value,
      to_date: document.getElementById("regToDate").value,
      from_time: fromTime.value || null,
      to_time: toTime.value || null,
      total_hours: totalHours.value || null,
      remarks: document.getElementById("regReason")?.value?.trim() || null,
    };

    // Validation
    if (!payload.employee_id) {
      alert("Please select an employee from the suggestions");
      employeeInput.focus();
      return;
    }
    if (!payload.from_date || !payload.to_date || !payload.remarks.trim()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/user/attendance-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload)

      if (res.ok) {
        alert("Regularization request submitted successfully!");
        form.reset();
        totalHours.value = "";
        employeeInput.value = "";
        employeeIdHidden.value = "";
      } else {
        const error = await res.text();
        alert("Submission failed: " + error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error connecting to server");
    }
  });
});

// Debounce helper
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}