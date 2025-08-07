// 🍔 Hamburger menu logic
const hamburgerL = document.querySelector(".hamburger");
const menuL = document.querySelector(".menu");

function myFunction(x) {
  x.classList.toggle("active");
}

// 🌀 Lazy-load lightweight Lottie player only when needed
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_PLAYING = 2;
  const playing = new Set();

  const allDotLotties = document.querySelectorAll("dotlottie-player");
  if (allDotLotties.length === 0) return;

  const heroLottie = document.querySelector("#hero-lottie");

  if (heroLottie) {
    loadAndPlayLottie(heroLottie, true);
  }

  const lazyPlayers = Array.from(allDotLotties).filter(p => p !== heroLottie);

  // 👀 Lazy-load .lottie files into src
  const loaderIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (el.dataset.src && !el.getAttribute("src")) {
        if (e.isIntersecting || el.getBoundingClientRect().top < window.innerHeight) {
          const fullSrc = "/" + el.dataset.src.replace(/^\/+/, "");
          el.setAttribute("src", fullSrc);
          loadAndPlayLottie(el);
          loaderIO.unobserve(el);
        }
      }
    }
  }, { rootMargin: "200px 0px", threshold: 0.01 });

  lazyPlayers.forEach(p => {
    if (p.dataset.src) loaderIO.observe(p);
  });

  // ▶ Load and play Lottie when needed
  async function loadAndPlayLottie(player, isHero = false) {
    if (prefersReduced) return;
    if (!document.body.contains(player)) return;

    try {
      if (!player.ready) {
        await new Promise(resolve =>
          player.addEventListener("ready", resolve, { once: true })
        );
      }

      await player.play();
      playing.add(player);
      enforceCap();
    } catch (err) {
      console.warn("[Lottie] Could not play:", err);
    }
  }

  function pause(player) {
    try {
      if (player.ready) player.pause();
    } catch (_) {}
    playing.delete(player);
  }

  function enforceCap() {
    if (playing.size <= MAX_PLAYING) return;

    const center = window.scrollY + window.innerHeight / 2;
    const arr = Array.from(playing);
    arr.sort((a, b) => {
      const aY = window.scrollY + a.getBoundingClientRect().top + a.offsetHeight / 2;
      const bY = window.scrollY + b.getBoundingClientRect().top + b.offsetHeight / 2;
      return Math.abs(bY - center) - Math.abs(aY - center); // ← sort furthest last
    });

    while (arr.length && playing.size > MAX_PLAYING) pause(arr.pop());
  }

  const playerIO = new IntersectionObserver((entries) => {
    entries.sort((a, b) => Number(b.isIntersecting) - Number(a.isIntersecting));
    for (const e of entries) {
      const p = e.target;
      if (p.hasAttribute("hover")) continue;

      if (e.isIntersecting) {
        loadAndPlayLottie(p);
      } else {
        pause(p);
      }
    }
  }, { threshold: 0.25 });

  allDotLotties.forEach(p => {
    if (p !== heroLottie) {
      playerIO.observe(p);
    }
  });

  document.addEventListener("scroll", enforceCap, { passive: true });
  window.addEventListener("resize", enforceCap);
});
