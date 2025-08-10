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
  const MAX_PLAYING = 2;
  const playing = new Set();

  const allAnimEls = document.querySelectorAll(".lottie-anim");

  // Load and unpack a .lottie file
  async function loadLottieFile(path) {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const manifestData = await zip.file("manifest.json").async("string");
    const manifest = JSON.parse(manifestData);
    const firstAnimId = manifest.animations[0].id;
    const animPath = `animations/${firstAnimId}.json`;

    let animData = JSON.parse(await zip.file(animPath).async("string"));

    // Inline images as base64
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
    const autoplay = el.dataset.autoplay === "true";
    const renderer = el.dataset.renderer || "svg";

    const animData = await loadLottieFile(path);

    const animInstance = lottie.loadAnimation({
      container: el,
      renderer,
      loop,
      autoplay: autoplay && !prefersReduced,
      animationData: animData
    });

    el.animInstance = animInstance;
    if (autoplay && !prefersReduced) playing.add(el);
  }

  function playIfPossible(el) {
    if (prefersReduced) return;
    if (playing.size < MAX_PLAYING) {
      el.animInstance.play();
      playing.add(el);
    }
  }

  function pause(el) {
    el.animInstance.pause();
    playing.delete(el);
  }

  function enforceCap() {
    if (playing.size <= MAX_PLAYING) return;
    const center = window.scrollY + window.innerHeight / 2;
    const arr = Array.from(playing);
    arr.sort((elA, elB) => {
      const yA = window.scrollY + elA.getBoundingClientRect().top + elA.offsetHeight / 2;
      const yB = window.scrollY + elB.getBoundingClientRect().top + elB.offsetHeight / 2;
      return Math.abs(yB - center) - Math.abs(yA - center);
    });
    while (arr.length && playing.size > MAX_PLAYING) {
      pause(arr.pop());
    }
  }

  // Observer for lazy-loading animations
  const loaderIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting || e.target.getBoundingClientRect().top < window.innerHeight) {
        initAnimation(e.target);
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.01 });

  // Observer for play/pause control
  const playerIO = new IntersectionObserver((entries) => {
    entries.sort((a, b) => Number(b.isIntersecting) - Number(a.isIntersecting));
    entries.forEach(e => {
      const el = e.target;
      if (!el.animInstance) return;
      if (e.isIntersecting) {
        playIfPossible(el);
      } else {
        pause(el);
      }
    });
  }, { threshold: 0.25 });

  allAnimEls.forEach(el => {
    loaderIO.observe(el);
    playerIO.observe(el);
  });

  document.addEventListener("scroll", enforceCap, { passive: true });
  window.addEventListener("resize", enforceCap);
});

/* ========================================================== */

/*
// 🌀 Lazy-load Lottie player only when needed
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_PLAYING = 2;
  const playing = new Set();

  const allDotLotties = document.querySelectorAll("dotlottie-player");
  if (allDotLotties.length === 0) return;

  let playerLoaded = false;

  const loadLottiePlayer = async () => {
    if (playerLoaded) return;

    try {
      console.log("[Lottie] Importing player...");
      await import("/lottie-player/dotlottie-player.js");
      await customElements.whenDefined("dotlottie-player");
      console.log("[Lottie] Player ready");
      playerLoaded = true;

      const allPlayers = Array.from(document.querySelectorAll("dotlottie-player"));
      const lazyPlayers = allPlayers.filter(p => p.dataset.src);

      // 💤 Lazy-load .lottie files into src
      const loaderIO = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const el = e.target;
          const alreadyHasSrc = el.getAttribute("src");

          if (el.dataset.src && !alreadyHasSrc) {
            if (e.isIntersecting || el.getBoundingClientRect().top < window.innerHeight) {
              const fullSrc = "/" + el.dataset.src.replace(/^\/+/, "");
              console.log("[Lottie] Setting src (forced):", fullSrc);
              el.setAttribute("src", fullSrc);
            }
          }
        }
      }, { rootMargin: "200px 0px", threshold: 0.01 });

      lazyPlayers.forEach(p => {
        loaderIO.observe(p);

        if (p.dataset.src && !p.getAttribute("src")) {
          const rect = p.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const fullSrc = "/" + p.dataset.src.replace(/^\/+/, "");
            console.log("[Lottie] Forcing immediate src:", fullSrc);
            p.setAttribute("src", fullSrc);
          }
        }
      });

      // ▶ Attempt playback — ✅ waits for player to be ready
      async function playIfPossible(p) {
        if (prefersReduced) return;
        if (!p.getAttribute("src")) return;

        try {
          if (!p.ready) {
            await new Promise(resolve =>
              p.addEventListener("ready", resolve, { once: true })
            );
          }

          if (playing.size < MAX_PLAYING) {
            await p.play();
            playing.add(p);
          }
        } catch (_) {}
      }

      function pause(p) {
        try {
          if (p.ready) p.pause(); // Only pause if the player is ready
        } catch (_) {}
        playing.delete(p);
      }

      const playerIO = new IntersectionObserver((entries) => {
        entries.sort((a, b) => Number(b.isIntersecting) - Number(a.isIntersecting));
        for (const e of entries) {
          const p = e.target;
          if (p.hasAttribute("hover")) continue;
          if (e.isIntersecting) {
            playIfPossible(p);
          } else {
            pause(p);
          }
        }
      }, { threshold: 0.25 });

      allPlayers.forEach(p => playerIO.observe(p));

      function enforceCap() {
        if (playing.size <= MAX_PLAYING) return;
        const center = window.scrollY + window.innerHeight / 2;
        const arr = Array.from(playing);
        arr.sort((pA, pB) => {
          const rA = pA.getBoundingClientRect();
          const rB = pB.getBoundingClientRect();
          const yA = window.scrollY + rA.top + rA.height / 2;
          const yB = window.scrollY + rB.top + rB.height / 2;
          return Math.abs(yB - center) - Math.abs(yA - center);
        });
        while (arr.length && playing.size > MAX_PLAYING) pause(arr.pop());
      }

      document.addEventListener("scroll", enforceCap, { passive: true });
      window.addEventListener("resize", enforceCap);
    } catch (err) {
      console.error("[Lottie] Failed to load player:", err);
    }
  };

  // 👀 Observe dotlottie-player presence in viewport
  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        console.log("[Lottie] Element entered view — loading player");
        loadLottiePlayer();
        obs.disconnect();
        break;
      }
    }
  }, { threshold: 0.01 });

  allDotLotties.forEach((el) => {
    observer.observe(el);

    if (el.getBoundingClientRect().top < window.innerHeight) {
      console.log("[Lottie] Element already in view — forcing load");
      loadLottiePlayer();
    }
  });
});
*/