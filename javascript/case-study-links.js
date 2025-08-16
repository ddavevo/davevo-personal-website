document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".main-container section");

  // ===================== Video Observer =====================
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.muted) {
          video.play().catch(err => {
            console.warn("Autoplay failed:", err);
          });
        }
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0
  });

  function revealSection(section) {
    if (section.classList.contains("visible")) return;
    section.classList.add("visible");

    // Lazy-load <img>
    section.querySelectorAll("img[data-src]").forEach(img => {
      img.src = img.dataset.src;
    });

    // Lazy-load <picture> sources
    section.querySelectorAll("source[data-srcset]").forEach(source => {
      source.srcset = source.dataset.srcset;
    });

    // Lazy-load <video> sources
    section.querySelectorAll("video").forEach(video => {
      const sources = video.querySelectorAll("source[data-src]");

      // Only replace sources if they haven’t already been set
      sources.forEach(source => {
        if (source.dataset.src && !source.src) {
          source.src = source.dataset.src;
        }
      });

      // Force video to recognize new sources
      video.load();

      // Observe video for play/pause
      videoObserver.observe(video);
    });
  }

  // IntersectionObserver for main reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealSection(entry.target);
      }
    });
  }, {
    rootMargin: "100px 0px", // preload before entering
    threshold: 0
  });

  sections.forEach(sec => {
    revealObserver.observe(sec);

    // Immediate check
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      revealSection(sec);
    }
  });

  // Scroll fallback
  window.addEventListener("scroll", () => {
    sections.forEach(sec => {
      if (!sec.classList.contains("visible")) {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          revealSection(sec);
        }
      }
    });
  });

  // ===================== TOC Section Highlight =====================
  window.addEventListener('DOMContentLoaded', () => {
    const tocLinks = Array.from(document.querySelectorAll('.table-of-contents li a'));
    if (!tocLinks.length) return;

    const tocTargets = tocLinks
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    let allowObserverUpdates = true;

    function setActive(id) {
      if (!allowObserverUpdates) return;
      tocLinks.forEach(a => {
        a.parentElement.classList.toggle(
          'active',
          a.getAttribute('href') === `#${id}`
        );
      });
    }

    // --- IntersectionObserver: pick section closest to top ---
    const tocObserver = new IntersectionObserver(entries => {
      if (!allowObserverUpdates) return;

      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

      if (visible.length > 0) {
        const id = visible[0].target.getAttribute('id');
        setActive(id);
      }
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    tocTargets.forEach(el => tocObserver.observe(el));

    // --- Click handler: smooth scroll with header offset ---
    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;

      const headerOffset = 128;
      const elementPos = el.getBoundingClientRect().top + window.scrollY;
      const offsetPos = elementPos - headerOffset;

      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    }

    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href').substring(1);

        // temporarily disable observer while scrolling
        allowObserverUpdates = false;

        tocLinks.forEach(a => a.parentElement.classList.remove('active'));
        link.parentElement.classList.add('active');

        scrollToSection(id);

        // re-enable observer after scroll finishes
        setTimeout(() => { allowObserverUpdates = true; }, 900);
      });
    });
  });
});