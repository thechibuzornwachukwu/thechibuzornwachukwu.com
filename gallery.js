(function () {
  var items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  var currentIndex = 0;

  // ========================================
  // Utility Functions
  // ========================================

  /**
   * Locks body scroll for lightbox
   */
  function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Unlocks body scroll when lightbox closes
   */
  function unlockBodyScroll() {
    document.body.style.overflow = '';
  }

  // --- Build lightbox DOM ---
  var lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Image lightbox');

  lightbox.innerHTML =
    '<button class="gallery-lightbox__close" aria-label="Close lightbox">' +
      '<svg viewBox="0 0 24 24"><path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 005.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"/></svg>' +
    '</button>' +
    '<button class="gallery-lightbox__prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' +
    '</button>' +
    '<button class="gallery-lightbox__next" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>' +
    '</button>' +
    '<div class="gallery-lightbox__inner">' +
      '<img class="gallery-lightbox__img" src="" alt="">' +
      '<div class="gallery-lightbox__info">' +
        '<span class="gallery-lightbox__counter"></span>' +
        '<span class="gallery-lightbox__caption"></span>' +
        '<a class="gallery-lightbox__download" href="" download>' +
          '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>' +
          'Download' +
        '</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(lightbox);

  var img = lightbox.querySelector('.gallery-lightbox__img');
  var counter = lightbox.querySelector('.gallery-lightbox__counter');
  var caption = lightbox.querySelector('.gallery-lightbox__caption');
  var downloadBtn = lightbox.querySelector('.gallery-lightbox__download');
  var closeBtn = lightbox.querySelector('.gallery-lightbox__close');
  var prevBtn = lightbox.querySelector('.gallery-lightbox__prev');
  var nextBtn = lightbox.querySelector('.gallery-lightbox__next');

  function showImage(index) {
    currentIndex = index;
    var item = items[index];
    var itemImg = item.querySelector('img');
    img.src = itemImg.src;
    img.alt = itemImg.alt || '';
    counter.textContent = (index + 1) + ' / ' + items.length;
    caption.textContent = itemImg.alt || '';
    if (downloadBtn) {
      downloadBtn.href = itemImg.src;
      downloadBtn.setAttribute('download', itemImg.alt || 'image');
    }
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('active');
    lockBodyScroll();
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    unlockBodyScroll();
  }

  function prevImage() {
    showImage(currentIndex <= 0 ? items.length - 1 : currentIndex - 1);
  }

  function nextImage() {
    showImage(currentIndex >= items.length - 1 ? 0 : currentIndex + 1);
  }

  // --- Event listeners ---
  items.forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('.gallery-item__download')) return;
      openLightbox(i);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Close on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prevImage();
    else if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });

  // Focus trap
  lightbox.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = lightbox.querySelectorAll('button, a[href]');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
