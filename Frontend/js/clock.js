/**
 * HRMS - Clock In/Out page
 */
(function () {
  var clockedIn = false;
  var attendanceRecords = [];

  function updateClock() {
    var liveClock = document.getElementById('liveClock');
    var liveDate = document.getElementById('liveDate');
    if (!liveClock) return;
    var now = new Date();
    liveClock.textContent = now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (liveDate) liveDate.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderAttendance() {
    var tbody = document.getElementById('attendanceTableBody');
    var today = new Date().toDateString();
    var todayRecords = attendanceRecords.filter(function (r) { return r.in.toDateString() === today; });
    if (todayRecords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No attendance records for today.</td></tr>';
      return;
    }
    tbody.innerHTML = todayRecords.map(function (r) {
      return '<tr><td>' + r.in.toLocaleTimeString() + '</td><td>' + (r.out ? r.out.toLocaleTimeString() : '-') + '</td><td>' + (r.duration != null ? r.duration + ' min' : '-') + '</td></tr>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    setInterval(updateClock, 1000);

    var clockInBtn = document.getElementById('clockInBtn');
    var clockOutBtn = document.getElementById('clockOutBtn');
    var clockStatus = document.getElementById('clockStatus');

    clockInBtn.addEventListener('click', function () {
      clockedIn = true;
      var t = new Date();
      clockInBtn.disabled = true;
      clockOutBtn.disabled = false;
      clockStatus.textContent = 'Clocked in at ' + t.toLocaleTimeString();
      attendanceRecords.push({ in: t, out: null, duration: null });
      renderAttendance();
    });

    clockOutBtn.addEventListener('click', function () {
      if (!clockedIn || !attendanceRecords.length) return;
      var record = attendanceRecords[attendanceRecords.length - 1];
      record.out = new Date();
      record.duration = Math.round((record.out - record.in) / 60000);
      clockedIn = false;
      clockInBtn.disabled = false;
      clockOutBtn.disabled = true;
      clockStatus.textContent = 'Not clocked in';
      renderAttendance();
    });
  });
})();
