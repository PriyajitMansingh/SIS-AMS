/**
 * HRMS - Shift Management page
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var addBtn = document.getElementById('addShiftBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        alert('Add Shift – connect to backend to add new shifts.');
      });
    }
  });
})();
