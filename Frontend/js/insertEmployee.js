document.addEventListener("DOMContentLoaded", async () => {
  const employeeIdInput = document.getElementById("employeeId");
  const form = document.getElementById("employeeSignupForm");

  // 1️⃣ Fetch next employee_id
  try {
    const res = await fetch("http://localhost:3000/api/employee/next-id");
    const data = await res.json();
    employeeIdInput.value = data.employee_id;
  } catch (err) {
    console.error("Failed to fetch employee ID", err);
  }

  // 2️⃣ Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      external_id: externalId.value,
      first_name: firstName.value.trim(),
      middle_name: middleName.value.trim() || null,  // Optional
      last_name: lastName.value.trim(),
      email: email.value,
      mobile: mobile.value,
      department: department.value,
      designation: designation.value,
      employment_type: employmentType.value,
      hire_date: hireDate.value,
      base_salary: baseSalary.value || null,
      hourly_rate: hourlyRate.value || null,
      assigned_shift: assignedShift.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/employee/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      alert(`Employee Created: ${data.employee_id}`);
      // window.location.href = "employees.html";
    } catch (err) {
      console.error("Create employee failed", err);
      alert("Failed to create employee");
    }
  });
});
