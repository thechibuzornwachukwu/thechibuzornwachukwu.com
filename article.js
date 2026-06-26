(function () {
  var heartBtn = document.getElementById('article-heart');
  var countEl = document.getElementById('heart-count');
  if (!heartBtn || !countEl) return;

  var slug = heartBtn.getAttribute('data-slug');
  var storageKey = 'heart_' + slug;
  var liked = localStorage.getItem(storageKey) === 'true';

  if (liked) {
    heartBtn.classList.add('liked');
    countEl.textContent = '1';
  } else {
    countEl.textContent = '0';
  }

  heartBtn.addEventListener('click', function () {
    if (liked) return;
    liked = true;
    localStorage.setItem(storageKey, 'true');
    heartBtn.classList.add('liked');
    countEl.textContent = '1';
  });
})();
