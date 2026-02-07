/**
 * HRMS - Payroll page
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var select = document.getElementById('payrollMonth');
    if (!select) return;
    var now = new Date();
    for (var i = 0; i < 12; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      var option = document.createElement('option');
      option.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      option.textContent = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      select.appendChild(option);
    }
  });
})();
