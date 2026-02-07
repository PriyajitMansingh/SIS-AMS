/**
 * HRMS - Leave Management page
 */
(function () {
  var leaveApplications = [];

  function renderLeaveTable() {
    var tbody = document.getElementById('leaveTableBody');
    if (leaveApplications.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No leave applications.</td></tr>';
      return;
    }
    tbody.innerHTML = leaveApplications.map(function (l) {
      return '<tr><td>' + l.from + '</td><td>' + l.to + '</td><td>' + l.type + '</td><td>' + l.days + '</td><td><span class="status-badge ' + l.status.toLowerCase() + '">' + l.status + '</span></td><td>-</td></tr>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('leaveModal');
    var form = document.getElementById('leaveForm');
    var applyBtn = document.getElementById('applyLeaveBtn');
    var closeBtn = document.getElementById('closeLeaveModal');
    var cancelBtn = document.getElementById('cancelLeaveBtn');

    applyBtn.addEventListener('click', function () { modal.classList.add('active'); });
    closeBtn.addEventListener('click', function () { modal.classList.remove('active'); });
    cancelBtn.addEventListener('click', function () { modal.classList.remove('active'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('active'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var from = new Date(document.getElementById('leaveFrom').value);
      var to = new Date(document.getElementById('leaveTo').value);
      var days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      leaveApplications.push({
        from: document.getElementById('leaveFrom').value,
        to: document.getElementById('leaveTo').value,
        type: document.getElementById('leaveType').value,
        days: days,
        reason: document.getElementById('leaveReason').value,
        status: 'Pending'
      });
      renderLeaveTable();
      modal.classList.remove('active');
      form.reset();
    });
  });
})();
