document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".main-container section");

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
      let loaded = false;

      sources.forEach(source => {
        if (source.dataset.src) {
          source.src = source.dataset.src;
          loaded = true;
        }
      });

      if (loaded) {
        video.load();
        if (video.muted) {
          video.play().catch(err => {
            console.warn("Autoplay failed:", err);
          });
        }
      }
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
  const tocLinks = Array.from(document.querySelectorAll('.table-of-contents li a'));
  if (tocLinks.length) {
    const tocTargets = tocLinks
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const setActive = (id) => {
      tocLinks.forEach(a => {
        a.parentElement.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    };

    const tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.isIntersecting) setActive(id);
      });
    }, {
      rootMargin: '0px 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    tocTargets.forEach(el => tocObserver.observe(el));
  }

  // ===================== Hero Poster → Lottie Swap =====================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroPoster = document.querySelector('.hero-poster');
  const heroLottie = document.querySelector('.hero .lottie-anim');

  if (heroPoster && heroLottie && !prefersReducedMotion) {
    window.addEventListener('load', () => {
      // dynamically load lottie script
      const script = document.createElement('script');
      script.src = '/lottie-player/lottie_light.min.js';
      script.async = true;
      script.onload = () => {
        const inst = window.lottie.loadAnimation({
          container: heroLottie,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: heroLottie.dataset.src
        });

        inst.addEventListener("DOMLoaded", () => {
          heroPoster.style.display = "none";   // hide poster
          heroLottie.hidden = false;           // reveal Lottie
        });
      };
      document.head.appendChild(script);
    });
  }
});
