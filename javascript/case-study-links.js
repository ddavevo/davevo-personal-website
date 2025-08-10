// 🍔 Hamburger menu logic
const hamburgerL = document.querySelector(".hamburger");
const menuL = document.querySelector(".menu");
function myFunction(x) {
  x.classList.toggle("active");
}

/* ========================================================== */

// Handling webp vs. png loading
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('picture').forEach(picture => {
    const source = picture.querySelector('source');
    const img = picture.querySelector('img');

    if (source && img) {
      const testImg = new Image();
      testImg.src = source.srcset;

      testImg.onerror = () => {
        // Remove the source so Safari reverts to <img> src
        source.remove();
        img.src = img.getAttribute('src');
        console.warn(`Fallback triggered for: ${img.src}`);
      };
    }
  });
});

/* ========================================================== */

// Handling Table of Contents section detection
window.addEventListener('DOMContentLoaded', () => {
  const tocLinks = Array.from(document.querySelectorAll('.table-of-contents li a'));
  const targets = tocLinks
    .map(a => document.querySelector(a.getAttribute('href'))) // e.g. #background
    .filter(Boolean);

  const setActive = (id) => {
    tocLinks.forEach(a => {
      a.parentElement.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        setActive(id);
      }
    });
  }, {
    root: null,
    // make the highlight switch when the target hits ~middle of the viewport
    rootMargin: '0px 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  // Track only the elements referenced by the TOC links (your .toc-spacer divs)
  targets.forEach(el => observer.observe(el));
});

/* ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_PLAYING = 2; // cap for simultaneous active animations
  const playing = new Set();
  const queue = new Set(); // animations waiting to start

  const allAnimEls = document.querySelectorAll(".lottie-anim");

  async function loadLottieFile(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path} (${response.status})`);

    const arrayBuffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const manifest = JSON.parse(await zip.file("manifest.json").async("string"));
    const firstAnimId = manifest.animations[0].id;
    const animPath = `animations/${firstAnimId}.json`;

    let animData = JSON.parse(await zip.file(animPath).async("string"));

    // Inline images
    if (animData.assets) {
      for (let asset of animData.assets) {
        if (asset.p && !asset.u.startsWith("data:")) {
          const imgFile = zip.file(`images/${asset.p}`);
          if (imgFile) {
            const blob = await imgFile.async("base64");
            asset.u = `data:image/${asset.p.split('.').pop()};base64,`;
            asset.p = blob;
          }
        }
      }
    }

    return animData;
  }

  async function initAnimation(el) {
    if (el.dataset.loaded) return;
    el.dataset.loaded = "true";

    const path = el.dataset.src;
    const loop = el.dataset.loop === "true";
    const renderer = el.dataset.renderer || "svg";

    try {
      const animData = await loadLottieFile(path);
      const animInstance = lottie.loadAnimation({
        container: el,
        renderer,
        loop,
        autoplay: false,
        animationData: animData
      });

      el.animInstance = animInstance;
      if (el.dataset.autoplay === "true" && !prefersReduced) {
        tryStart(el);
      }
    } catch (err) {
      console.error(`[Lottie] Failed to init ${path}:`, err);
    }
  }

  function tryStart(el) {
    if (playing.has(el)) return; // already running
    if (prefersReduced || !el.animInstance) return;

    if (playing.size < MAX_PLAYING) {
      el.animInstance.play();
      playing.add(el);
    } else {
      queue.add(el); // wait until a slot opens
    }
  }

  function stop(el) {
    if (!el.animInstance) return;
    el.animInstance.pause();
    playing.delete(el);
    queue.delete(el);

    // Start next in queue
    if (queue.size > 0) {
      const next = queue.values().next().value;
      queue.delete(next);
      tryStart(next);
    }
  }

  const loaderIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        initAnimation(e.target);
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.01 });

  const playerIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const el = e.target;
      if (!el.animInstance) return;

      if (e.isIntersecting) {
        tryStart(el);
      } else {
        stop(el);
      }
    });
  }, { threshold: 0.25 });

  allAnimEls.forEach(el => {
    loaderIO.observe(el);
    playerIO.observe(el);
  });
});