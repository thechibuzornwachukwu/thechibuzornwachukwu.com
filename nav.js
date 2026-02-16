(function () {
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');
  var overlay = document.querySelector('.mobile-menu-overlay');
  var savedScrollY = 0;

  // ========================================
  // Utility Functions
  // ========================================

  /**
   * Sets aria-expanded attribute on an element
   * @param {HTMLElement} element - The element to update
   * @param {boolean} isExpanded - Whether the element is expanded
   */
  function setAriaExpanded(element, isExpanded) {
    if (element) {
      element.setAttribute('aria-expanded', String(isExpanded));
    }
  }

  /**
   * Closes all dropdown elements matching a selector within a container
   * @param {string} selector - CSS selector for dropdown elements
   * @param {HTMLElement} container - Container element to search within
   */
  function closeAllDropdowns(selector, container) {
    container.querySelectorAll(selector).forEach(function (dropdown) {
      dropdown.classList.remove('open');
      var trigger = dropdown.querySelector('.mobile-dropdown-trigger') || dropdown.querySelector('.dropdown-trigger');
      setAriaExpanded(trigger, false);
    });
  }

  /**
   * Locks body scroll and saves current scroll position
   */
  function lockBodyScroll() {
    savedScrollY = window.scrollY;
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.classList.add('menu-open');
  }

  /**
   * Unlocks body scroll and restores scroll position
   */
  function unlockBodyScroll() {
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  // --- Scroll: add .scrolled to navbar ---
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // --- Mobile menu open/close ---
  function openMenu() {
    lockBodyScroll();
    toggle.classList.add('active');
    overlay.classList.add('open');
    setAriaExpanded(toggle, true);
  }

  function closeMenu() {
    toggle.classList.remove('active');
    overlay.classList.remove('open');
    unlockBodyScroll();
    setAriaExpanded(toggle, false);
    // Close all mobile submenus
    closeAllDropdowns('.mobile-dropdown.open', overlay);
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
      overlay.querySelectorAll('.mobile-dropdown.open').forEach(function (dropdown) {
        if (dropdown !== parent) {
          dropdown.classList.remove('open');
          var trigger = dropdown.querySelector('.mobile-dropdown-trigger');
          setAriaExpanded(trigger, false);
        }
      });

      parent.classList.toggle('open', !isOpen);
      setAriaExpanded(btn, !isOpen);
    });
  });

  // --- Desktop dropdowns ---
  var desktopDropdowns = nav.querySelectorAll('.nav-item--has-dropdown');

  function closeAllDesktopDropdowns() {
    desktopDropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('open');
      var trigger = dropdown.querySelector('.dropdown-trigger');
      setAriaExpanded(trigger, false);
    });
  }

  desktopDropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.dropdown-trigger');
    var menu = dropdown.querySelector('.dropdown-menu');

    dropdown.addEventListener('mouseenter', function () {
      closeAllDesktopDropdowns();
      dropdown.classList.add('open');
      setAriaExpanded(trigger, true);
    });

    dropdown.addEventListener('mouseleave', function () {
      dropdown.classList.remove('open');
      setAriaExpanded(trigger, false);
    });

    // Keyboard navigation
    if (trigger) {
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || (e.key === 'Enter' && !dropdown.classList.contains('open'))) {
          e.preventDefault();
          dropdown.classList.add('open');
          setAriaExpanded(trigger, true);
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
            dropdown.classList.remove('open');
            setAriaExpanded(trigger, false);
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
