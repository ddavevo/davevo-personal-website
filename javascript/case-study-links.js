// /javascript/case-study-links.js

// ===============
// 🍔 Hamburger
// ===============
function myFunction(x) { x.classList.toggle("active"); }

// ===============
// 🌀 dotlottie lazy loader
// ===============
(function () {
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_PLAYING = 2;
  const playing = new Set();
  let playerDefined = false;

  async function ensurePlayerDefined() {
    if (playerDefined) return;
    // Use your local module. If you have CSP issues, swap to the CDN:
    // await import('https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs');
    await import('/lottie-player/dotlottie-player.mjs');
    playerDefined = true;
    // console.log('[dotlottie] custom element defined');
  }

  function waitReady(el) {
    if (el.ready) return Promise.resolve();
    return new Promise(res => el.addEventListener('ready', res, { once: true }));
  }

  function safePlay(el) {
    try { typeof el.play === 'function' && el.play(); } catch {}
  }
  function safePause(el) {
    try { typeof el.pause === 'function' && el.pause(); } catch {}
  }
  function paintFirstFrame(el) {
    try { typeof el.goToAndStop === 'function' && el.goToAndStop(0, true); } catch {}
  }

  function enforceCap() {
    if (playing.size <= MAX_PLAYING) return;
    const center = scrollY + innerHeight / 2;
    const arr = Array.from(playing);
    arr.sort((a, b) => {
      const aY = a.getBoundingClientRect().top + a.offsetHeight / 2;
      const bY = b.getBoundingClientRect().top + b.offsetHeight / 2;
      return Math.abs(bY - center) - Math.abs(aY - center);
    });
    while (arr.length && playing.size > MAX_PLAYING) {
      const p = arr.pop();
      safePause(p);
      playing.delete(p);
    }
  }

  // Grab all players present at DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const players = Array.from(document.querySelectorAll('dotlottie-player'));

    // Eager players (have src right away, e.g., hero/above-the-fold)
    const eager = players.filter(p => p.getAttribute('src'));
    if (eager.length) {
      ensurePlayerDefined().then(() => {
        eager.forEach(async el => {
          el.addEventListener('error', ev => {
            console.error('[dotlottie] error (eager)', { src: el.getAttribute('src'), detail: ev?.detail });
          }, { once: true });
          await waitReady(el);
          if (prefersReduced) paintFirstFrame(el);
          else {
            safePlay(el);
            playing.add(el);
            enforceCap();
          }
        });
      });
    }

    // Lazy players (data-src → src on intersection)
    const lazy = players.filter(p => p.dataset.src && !p.getAttribute('src'));
    if (lazy.length) {
      const loaderIO = new IntersectionObserver(async entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          loaderIO.unobserve(el);

          // Define component before setting src
          await ensurePlayerDefined();

          el.addEventListener('error', ev => {
            console.error('[dotlottie] error (lazy)', { src: el.dataset.src, detail: ev?.detail });
          }, { once: true });

          // Set src to trigger the network request
          const fullSrc = '/' + el.dataset.src.replace(/^\/+/, '');
          el.setAttribute('src', fullSrc);

          await waitReady(el);
          if (prefersReduced) paintFirstFrame(el);
          else {
            safePlay(el);
            playing.add(el);
            enforceCap();
          }
        }
      }, { rootMargin: '200px 0px', threshold: 0.01 });

      lazy.forEach(el => loaderIO.observe(el));
    }

    // Play/pause based on visibility (after src is set)
    const visIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const el = e.target;
        // Only bother once a src exists
        if (!el.getAttribute('src')) return;

        if (e.isIntersecting && !prefersReduced) {
          safePlay(el);
          playing.add(el);
          enforceCap();
        } else {
          safePause(el);
          playing.delete(el);
        }
      });
    }, { threshold: 0.25 });

    players.forEach(p => visIO.observe(p));

    addEventListener('scroll', enforceCap, { passive: true });
    addEventListener('resize', enforceCap);
  });
})();
