/**
 * HRMS - Shared: nav active state, header date, menu toggle
 */
(function () {
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    if (file === 'index.html' || file === '') return 'index.html';
    return file;
  }

  function initNavActive() {
    const current = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(function (a) {
      const href = a.getAttribute('href');
      const isActive = href === current || (current === 'index.html' && (href === 'index.html' || href === '.'));
      a.classList.toggle('active', isActive);
    });
  }

  function initCurrentDate() {
    const el = document.getElementById('currentDate');
    if (el) {
      el.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  }

  function initMenuToggle() {
    const btn = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (btn && sidebar) {
      btn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavActive();
    initCurrentDate();
    initMenuToggle();
  });
})();
