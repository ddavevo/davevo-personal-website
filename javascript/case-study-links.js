// ===================== Video Lazy Play/Pause =====================
window.addEventListener('DOMContentLoaded', () => {
  const vids = document.querySelectorAll('video');
  if (!vids.length) return;

  vids.forEach(v => {
    v.setAttribute('preload', 'none');
    v.removeAttribute('autoplay'); // we'll control via IO
    v.pause();
  });

  const vObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        // start playing only when visible
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0; // optional: free up decoder
      }
    });
  }, { threshold: 0.25 });

  vids.forEach(v => vObserver.observe(v));
});