const hamburgerL = document.querySelector(".hamburger");
const menuL = document.querySelector(".menu");

function myFunction(x){
    x.classList.toggle("active");
}

// Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Collect players
  const allPlayers = Array.from(document.querySelectorAll('dotlottie-player'));
  const lazyPlayers = allPlayers.filter(p => p.dataset.src);

  // Load src when near viewport
  const loaderIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (e.isIntersecting && el.dataset.src && !el.getAttribute('src')) {
        el.setAttribute('src', el.dataset.src);
        // Do not auto-play here; let the playerIO decide based on concurrency.
      }
    }
  }, { rootMargin: '200px 0px', threshold: 0.01 });

  lazyPlayers.forEach(p => loaderIO.observe(p));

  // Cap concurrent playback
  const MAX_PLAYING = 2;
  const playing = new Set();

  async function playIfPossible(p) {
    if (prefersReduced) return;           // No auto-play for reduced motion users
    if (!p.getAttribute('src')) return;   // Not loaded yet
    if (playing.size < MAX_PLAYING) {
      try {
        await p.play();
        playing.add(p);
      } catch (_) {}
    }
  }
  function pause(p) {
    try { p.pause(); } catch (_) {}
    playing.delete(p);
  }

  // Observe visibility to play/pause
  const playerIO = new IntersectionObserver((entries) => {
    // Sort so entries entering the viewport get processed first
    entries.sort((a,b) => Number(b.isIntersecting) - Number(a.isIntersecting));
    for (const e of entries) {
      const p = e.target;
      if (p.hasAttribute('hover')) continue; // hover-only, don't auto-play
      if (e.isIntersecting) {
        playIfPossible(p);
      } else {
        pause(p);
      }
    }
  }, { threshold: 0.25 });

  allPlayers.forEach(p => playerIO.observe(p));

  // If too many are playing (e.g., fast scroll), pause extras
  function enforceCap() {
    if (playing.size <= MAX_PLAYING) return;
    // Pause the ones farthest from viewport center
    const center = window.scrollY + window.innerHeight / 2;
    const arr = Array.from(playing);
    arr.sort((pA, pB) => {
      const rA = pA.getBoundingClientRect();
      const rB = pB.getBoundingClientRect();
      const yA = window.scrollY + rA.top + rA.height/2;
      const yB = window.scrollY + rB.top + rB.height/2;
      return Math.abs(yB - center) - Math.abs(yA - center);
    });
    while (arr.length && playing.size > MAX_PLAYING) pause(arr.pop());
  }
  document.addEventListener('scroll', enforceCap, { passive: true });
  window.addEventListener('resize', enforceCap);