// ===================== Lottie Loader (delayed to after 'load') =====================
(function() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_PLAYING = 2; // cap simultaneous
  const playing = new Set();
  const queue = new Set();
  let readyToAnimate = false;

  async function loadLottieFromDotLottie(path) {
    // NOTE: still uses JSZip, but we run only after 'load' and on intersection
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Failed to load ${path} (${response.status})`);
    const buf = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    const manifest = JSON.parse(await zip.file("manifest.json").async("string"));
    const firstAnimId = manifest.animations[0].id;
    const animPath = `animations/${firstAnimId}.json`;

    const animData = JSON.parse(await zip.file(animPath).async("string"));

    // Inline images to avoid extra requests
    if (animData.assets) {
      for (let asset of animData.assets) {
        if (asset.p) {
          const imgFile = zip.file(`images/${asset.p}`);
          if (imgFile) {
            const b64 = await imgFile.async("base64");
            asset.u = `data:image/${asset.p.split('.').pop()};base64,`;
            asset.p = b64;
          }
        }
      }
    }
    return animData;
  }

  function tryStart(el) {
    if (!readyToAnimate || prefersReduced || !el.animInstance) return;
    if (playing.has(el)) return;
    if (playing.size < MAX_PLAYING) {
      el.animInstance.play();
      playing.add(el);
    } else {
      queue.add(el);
    }
  }

  function stop(el) {
    if (!el.animInstance) return;
    el.animInstance.pause();
    playing.delete(el);
    queue.delete(el);
    if (queue.size > 0) {
      const next = queue.values().next().value;
      queue.delete(next);
      tryStart(next);
    }
  }

  function initAll() {
    const allAnimEls = document.querySelectorAll(".lottie-anim");
    if (!allAnimEls.length) return;

    const loaderIO = new IntersectionObserver((entries) => {
      entries.forEach(async (e) => {
        const el = e.target;
        if (!e.isIntersecting || el.dataset.loaded) return;

        el.dataset.loaded = "true";
        const path = el.dataset.src;
        const loop = el.dataset.loop === "true";
        const renderer = el.dataset.renderer || "canvas"; // default to canvas

        try {
          const data = await loadLottieFromDotLottie(path);
          const inst = lottie.loadAnimation({
            container: el,
            renderer,
            loop,
            autoplay: false,
            animationData: data
          });
          el.animInstance = inst;
          el.hidden = false; // reveal once ready

          if (el.dataset.autoplay === "true") tryStart(el);
        } catch (err) {
          console.error("[Lottie] init failed:", err);
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
  }

  // Gate all animation work until the page is fully loaded (improves LCP/TBT)
  window.addEventListener('load', () => {
    readyToAnimate = true;

    // If your hero had a poster + hidden lottie, reveal container now
    const heroLottie = document.querySelector('.hero .lottie-anim');
    if (heroLottie) heroLottie.hidden = false;

    initAll();
  });
})();