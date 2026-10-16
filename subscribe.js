/* Email signup (homepage and essay pages).
   Posts to Formspree without leaving the page. On success, everything inside the section
   (heading, line, form) fades out and a confirmation with its own heading fades in; the
   wine background and the section's height stay fixed. On failure the visitor can retry. */
(function () {
  var FADE_MS = 300;

  document.querySelectorAll('.essay-subscribe').forEach(function (box) {
    var form = box.querySelector('.essay-subscribe__form');
    var done = box.querySelector('.essay-subscribe__done');
    if (!form) return;
    var btn = form.querySelector('button');
    var input = form.querySelector('input[type="email"]');
    var label = btn.textContent;

    function showError() {
      btn.disabled = false;
      btn.textContent = label;
      form.classList.remove('is-sending');
      if (!done) return;
      done.textContent = 'That did not go through. Please try again.';
      done.hidden = false;
      requestAnimationFrame(function () { done.classList.add('is-shown'); });
    }

    function showSuccess(email) {
      // Hold the current height so the page below does not jump
      box.style.minHeight = box.offsetHeight + 'px';
      box.classList.add('is-leaving');

      setTimeout(function () {
        Array.prototype.forEach.call(box.children, function (el) {
          if (el.tagName !== 'SCRIPT') el.hidden = true;
        });

        var success = document.createElement('div');
        success.className = 'essay-subscribe__success';
        success.setAttribute('role', 'status');

        var heading = document.createElement('h2');
        heading.className = 'essay-subscribe__heading';
        heading.textContent = 'You are subscribed';

        var line = document.createElement('p');
        line.className = 'essay-subscribe__text';
        line.textContent = 'New essays will go to ' + email + '.';

        success.appendChild(heading);
        success.appendChild(line);
        box.appendChild(success);
        box.classList.remove('is-leaving');
        box.classList.add('is-subscribed');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { success.classList.add('is-shown'); });
        });
      }, FADE_MS);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      btn.disabled = true;
      btn.textContent = 'Sending...';
      form.classList.add('is-sending');
      if (done) { done.hidden = true; done.classList.remove('is-shown'); }

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad response');
          showSuccess(email);
        })
        .catch(showError);
    });
  });
})();
