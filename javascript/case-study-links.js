// Handling webp vs. png loading
/*
// Improved: Only set src/srcset for supported format after checking WebP support
function supportsWebP(callback) {
  const img = new window.Image();
  img.onload = function () { callback(img.width > 0 && img.height > 0); };
  img.onerror = function () { callback(false); };
  img.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4TAYAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
}

document.addEventListener('DOMContentLoaded', () => {
  supportsWebP(function (isWebP) {
    document.querySelectorAll('picture').forEach(picture => {
      const source = picture.querySelector('source');
      const img = picture.querySelector('img');
      if (!source || !img) return;

      // Store data attributes for both formats
      const webpSrcset = source.getAttribute('data-webp-srcset') || source.getAttribute('srcset');
      const pngSrcset = img.getAttribute('data-png-srcset');
      const pngSrc = img.getAttribute('data-png-src') || img.getAttribute('src');

          if (isWebP) {
            // Only set webp srcset on <source>; do NOT set img src/srcset
            if (webpSrcset) source.setAttribute('srcset', webpSrcset);
            // Remove any src/srcset from <img> to avoid forcing PNG
            img.removeAttribute('src');
            img.removeAttribute('srcset');
          } else {
            // Remove <source> so only <img> loads (png)
            source.remove();
            if (pngSrc) img.setAttribute('src', pngSrc);
            if (pngSrcset) img.setAttribute('srcset', pngSrcset);
          }
    });
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
*/

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