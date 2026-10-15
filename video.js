/* Click-to-play YouTube embeds.
   Each .video-feature[data-yt] shows a local thumbnail and links to YouTube. On click,
   the thumbnail is swapped for YouTube's privacy-enhanced player, which starts playing
   in place. Nothing from YouTube loads until the visitor asks for the video, and
   without JavaScript the link still opens the video on YouTube. */
(function () {
  // YouTube rejects embeds that send no referrer (Error 153), which is always the case for
  // pages opened straight from disk. There, leave the plain link to YouTube in place.
  if (location.protocol === 'file:') return;
  document.querySelectorAll('.video-feature[data-yt]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var frame = link.querySelector('.video-feature__frame');
      if (!frame) return;
      e.preventDefault();
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.dataset.yt + '?autoplay=1&rel=0';
      iframe.title = link.dataset.ytTitle || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.innerHTML = '';
      frame.appendChild(iframe);
      frame.classList.add('is-playing');
      // The wrapper is a link; once the player is in, it must stop acting like one
      var wrapper = document.createElement('div');
      wrapper.className = link.className;
      while (link.firstChild) wrapper.appendChild(link.firstChild);
      link.replaceWith(wrapper);
    });
  });
})();
