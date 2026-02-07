/**
 * HRMS - Dashboard page only
 */
(function () {
  async function getEmployeeCount() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/user/get-employees-count",
      );
      const data = await res.json();
      const result = data.total;
      return result;
    } catch (err) {
      console.error("Count fetch error:", err);
      return 0;
    }
  }

  async function updateDashboardStats() {
    var totalEl = document.getElementById("totalEmployees");
    var presentEl = document.getElementById("presentToday");
    var onLeaveEl = document.getElementById("onLeave");
    var pendingEl = document.getElementById("pendingRequests");
    const total = await getEmployeeCount();
    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = 0;
    if (onLeaveEl) onLeaveEl.textContent = 0;
    if (pendingEl) pendingEl.textContent = 0;
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateDashboardStats();
  });
})();
