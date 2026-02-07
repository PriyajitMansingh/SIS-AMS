/**
 * HRMS - Reports & Analytics page
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll(".page-reports .btn-secondary")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          alert("Generate Report – connect to backend to generate reports.");
        });
      });
  });
})();
