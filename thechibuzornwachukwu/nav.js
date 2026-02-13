(function () {
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');
  var overlay = document.querySelector('.mobile-menu-overlay');
  var savedScrollY = 0;

  // --- Scroll: add .scrolled to navbar ---
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // --- Mobile menu open/close ---
  function openMenu() {
    savedScrollY = window.scrollY;
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.classList.add('menu-open');
    toggle.classList.add('active');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    toggle.classList.remove('active');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
    toggle.setAttribute('aria-expanded', 'false');
    // Close all mobile submenus
    overlay.querySelectorAll('.mobile-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
      d.querySelector('.mobile-dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
  }

  toggle.addEventListener('click', function () {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on overlay background tap
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (overlay.classList.contains('open')) {
        closeMenu();
        return;
      }
      closeAllDesktopDropdowns();
    }
  });

  // Close mobile menu when any link inside is clicked
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // --- Mobile accordion ---
  overlay.querySelectorAll('.mobile-dropdown-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var parent = btn.closest('.mobile-dropdown');
      var isOpen = parent.classList.contains('open');

      // Accordion: close others
      overlay.querySelectorAll('.mobile-dropdown.open').forEach(function (d) {
        if (d !== parent) {
          d.classList.remove('open');
          d.querySelector('.mobile-dropdown-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // --- Desktop dropdowns ---
  var desktopDropdowns = nav.querySelectorAll('.nav-item--has-dropdown');

  function closeAllDesktopDropdowns() {
    desktopDropdowns.forEach(function (dd) {
      dd.classList.remove('open');
      var trigger = dd.querySelector('.dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  desktopDropdowns.forEach(function (dd) {
    var trigger = dd.querySelector('.dropdown-trigger');
    var menu = dd.querySelector('.dropdown-menu');

    dd.addEventListener('mouseenter', function () {
      closeAllDesktopDropdowns();
      dd.classList.add('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    });

    dd.addEventListener('mouseleave', function () {
      dd.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    // Keyboard navigation
    if (trigger) {
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || (e.key === 'Enter' && !dd.classList.contains('open'))) {
          e.preventDefault();
          dd.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          var firstItem = menu.querySelector('a');
          if (firstItem) firstItem.focus();
        }
      });
    }

    if (menu) {
      var items = menu.querySelectorAll('a');
      items.forEach(function (item, i) {
        item.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (i + 1 < items.length) items[i + 1].focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (i - 1 >= 0) items[i - 1].focus();
            else trigger.focus();
          } else if (e.key === 'Escape') {
            dd.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
          }
        });
      });
    }
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item--has-dropdown')) {
      closeAllDesktopDropdowns();
    }
  });
})();
