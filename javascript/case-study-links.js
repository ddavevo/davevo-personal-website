// Handling webp vs. png loading

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('picture').forEach(picture => {
    const source = picture.querySelector('source');
    const img = picture.querySelector('img');

    if (source && img) {
      const testImg = new Image();
      testImg.src = source.srcset.split(',')[0].split(' ')[0];

      testImg.onerror = () => {
        // Remove the source so Safari reverts to <img> src
        source.remove();
        img.src = img.getAttribute('src');
      };
    }
  });
});

// ===================== TOC Section Highlight =====================
window.addEventListener('DOMContentLoaded', () => {
  const tocLinks = Array.from(document.querySelectorAll('.table-of-contents li a'));
  if (!tocLinks.length) return;

  const targets = tocLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    tocLinks.forEach(a => {
      a.parentElement.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) setActive(id);
    });
  }, { rootMargin: '0px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  targets.forEach(el => observer.observe(el));
});

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