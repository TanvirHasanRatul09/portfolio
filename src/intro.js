import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Page-scroll lock
// ==========================================
// While the intro is playing, the page must not be scrollable. `position:
// fixed` on <body> (rather than just `overflow: hidden`) is used because
// iOS Safari can still rubber-band-scroll a body that only has
// `overflow: hidden`. Safe unconditionally here because every time this
// gets applied (initial load, or a logo-triggered replay) the page is
// first scrolled back to the top — see `resetScrollForReplay` below.
function lockPageScroll() {
  document.body.classList.add('intro-lock');
}
function unlockPageScroll() {
  document.body.classList.remove('intro-lock');
}

export function initCinematicIntro() {
  const introContainer = document.getElementById('cinematic-intro');
  const scene = document.querySelector('.cinematic-scene');
  const camera = document.querySelector('.cinematic-camera');
  const screen = document.querySelector('.cinematic-screen');
  const person = document.querySelector('.person-silhouette');

  if (!introContainer || !scene || !camera || !screen || !person) return;

  const isMobile = window.innerWidth <= 768;

  // Mobile browsers resize the viewport every time the address bar shows
  // or hides. Other ScrollTriggers on this page (the section reveals in
  // main.js) shouldn't re-run their measurements just because of that.
  ScrollTrigger.config({ ignoreMobileResize: true });

  const terminal = document.querySelector('.terminal-placeholder');
  const iframeContainer = document.querySelector('.portfolio-iframe-container');
  const iframeEl = document.querySelector('.portfolio-iframe');
  const monitorScreen = document.querySelector('.cinematic-screen');
  const realNav = document.querySelector('nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const logo = document.querySelector('.logo');

  // Tracks whatever is currently mid-flight (a GSAP timeline for the full
  // cinematic path, or the pending timers/listener for the reduced-motion
  // path) so a replay can cleanly cancel it instead of letting two
  // sequences run on top of each other.
  let activeTimeline = null;
  let cancelReducedMotionPlay = null;

  // ==========================================
  // Iframe readiness
  // ==========================================
  // The monitor shows a live iframe of the whole site loading a second
  // time (its own JS bundle, fonts, and Three.js scene). With the zoom
  // phases now very short, the camera can arrive at the monitor before
  // that second copy has actually painted anything, showing a blank
  // screen. `iframeReady` flips true on the iframe's real `load` event
  // (fires once — the src never changes across replays) and
  // `waitForIframe` lets the cinematic sequence pause on it, bounded by
  // a safety cap so a slow/blocked iframe can never hang the intro.
  let iframeReady = false;
  if (iframeEl) {
    iframeEl.addEventListener('load', () => {
      iframeReady = true;
    });
  }
  function waitForIframe(maxWaitMs) {
    if (iframeReady || !iframeEl) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      const onLoad = () => finish();
      iframeEl.addEventListener('load', onLoad, { once: true });
      setTimeout(finish, maxWaitMs);
    });
  }

  function stopWhateverIsPlaying() {
    if (activeTimeline) {
      activeTimeline.kill();
      activeTimeline = null;
    }
    if (cancelReducedMotionPlay) {
      cancelReducedMotionPlay();
      cancelReducedMotionPlay = null;
    }
  }

  // ==========================================
  // Reduced-motion path: a simple fade reveal instead of the full sequence
  // ==========================================
  function playReducedMotionReveal() {
    introContainer.style.display = '';
    introContainer.style.position = 'fixed';
    introContainer.style.inset = '0';
    introContainer.style.zIndex = '9999';
    introContainer.style.transition = 'none';
    introContainer.style.opacity = '1';
    introContainer.style.visibility = 'visible';
    // Force the reset above to paint before re-enabling the transition,
    // otherwise the browser can coalesce it with the fade-out that follows
    // and skip straight to the end state.
    void introContainer.offsetHeight;
    introContainer.style.transition = 'opacity 0.6s ease';

    lockPageScroll();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      introContainer.style.display = 'none';
      unlockPageScroll();
      window.dispatchEvent(new CustomEvent('introcomplete'));
    };

    // The 800ms here is just a deliberate hold before the fade begins
    // (a design choice), not a stand-in for completion detection.
    let safetyTimer = null;
    const holdTimer = setTimeout(() => {
      introContainer.style.opacity = '0';
      // Real completion detection: wait for the opacity transition to
      // actually end, rather than guessing at a second delay.
      introContainer.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'opacity') return;
        introContainer.removeEventListener('transitionend', onEnd);
        finish();
      });
      // Safety net sized to the transition's own declared duration (0.6s),
      // in case transitionend never fires — e.g. the tab was backgrounded
      // mid-transition and the browser paused rendering.
      safetyTimer = setTimeout(finish, 700);
    }, 800);

    cancelReducedMotionPlay = () => {
      clearTimeout(holdTimer);
      if (safetyTimer) clearTimeout(safetyTimer);
      finished = true; // prevent a stray transitionend from an old run
    };
  }

  // ==========================================
  // Full cinematic sequence — an autoplaying timeline
  // ==========================================
  async function playCinematicSequence() {
    // Reset every element the timeline animates back to its pre-intro
    // starting value. Needed both for the first play and for a replay
    // triggered from the logo, since the previous run left everything at
    // its finished (faded out) state.
    gsap.set(introContainer, { autoAlpha: 1 });
    introContainer.style.display = '';
    introContainer.style.position = 'fixed';
    introContainer.style.inset = '0';
    introContainer.style.zIndex = '9999';

    gsap.set(camera, { z: 0 });
    gsap.set(person, { autoAlpha: 1 });
    if (terminal) gsap.set(terminal, { autoAlpha: 1 });
    if (iframeContainer) gsap.set(iframeContainer, { opacity: 0 });

    // Hide the real navbar during the cinematic intro.
    // The nav is outside <main> with z-index:100, while the intro is inside <main> (z-index:1).
    // The intro's z-index:9999 is trapped in main's stacking context, so the nav bleeds through.
    if (realNav) {
      realNav.style.transition = 'none';
      realNav.style.opacity = '0';
      realNav.style.pointerEvents = 'none';
      void realNav.offsetHeight;
      realNav.style.transition = 'opacity 0.5s ease';
    }
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
      mobileOverlay.style.display = 'none';
    }

    // Lock scrolling for the entire intro. The timeline plays on its own,
    // in real time — scrolling is simply unavailable until the timeline
    // reports itself finished (see `onComplete` below), which is the only
    // place scrolling gets restored.
    lockPageScroll();

    let cameraZFinal = 850;
    if (monitorScreen) {
      // CSS perspective is 1000px. The monitor layer sits at translateZ(50px).
      // We need: scale = perspective / (perspective - (cameraZ - layerZ))
      // Solving for cameraZ when scale fills the viewport.
      const rect = monitorScreen.getBoundingClientRect();
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;
      // Slightly over-scale (1.02x) so monitor frame bleeds off-screen during crossfade
      const relativeScale = Math.max(scaleX, scaleY) * 1.02;
      // perspective = 1000, monitor layer Z offset = 50; effective depth = 950
      cameraZFinal = 950 - (950 / relativeScale);
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // The one and only place "intro complete" is decided, using
        // GSAP's own completion callback rather than an arbitrary timer.
        // Nothing reveals the portfolio or restores scrolling anywhere else.
        introContainer.style.display = 'none'; // fully removed from rendering, not just faded — no possible bleed-through
        unlockPageScroll();
        if (realNav) {
          realNav.style.opacity = '1';
          realNav.style.pointerEvents = '';
        }
        if (mobileOverlay) {
          mobileOverlay.style.display = '';
        }
        ScrollTrigger.refresh();
        window.dispatchEvent(new CustomEvent('introcomplete'));
        activeTimeline = null;
      }
    });
    activeTimeline = tl;

    // Phase 1: Terminal fades out, portfolio interface fades in on the monitor
    tl.to(terminal, { autoAlpha: 0, duration: 1.5, ease: 'power1.inOut' });
    if (iframeContainer) {
      tl.to(iframeContainer, { opacity: 1, duration: 1.5, ease: 'power1.inOut' }, '<0.5');
    }

    // Phase 2: Dolly zoom — establishing shot.
    // Durations cut down to the fastest values that still read as a
    // motion rather than an instant jump (was 1s + 0.5s gap).
    tl.to(camera, { z: 50, duration: 0.25, ease: 'none' }, '+=0.15');
    tl.to(person, { autoAlpha: 0, duration: 0.25, ease: 'power2.inOut' }, '<0.15');

    // Phase 3: Move toward desk (was 2s).
    tl.to(camera, { z: 500, duration: 0.35, ease: 'power1.inOut' });

    // Phase 4: Enter Monitor — dynamically calculated Z for pixel-perfect
    // full-screen fit (was 4s). This was the single biggest chunk of the
    // whole intro, so it's the biggest cut here.
    tl.to(camera, { z: cameraZFinal, duration: 0.45, ease: 'power2.inOut' });

    // Phase 5: Crossfade — reveal the real portfolio underneath.
    // Shortened pause + duration (was '+=1' / 3s) so there's much less of a
    // lull between the camera settling into the monitor and the real site
    // actually appearing — the handoff itself is now snappy rather than a
    // ~4s tail on top of everything else.
    tl.to(introContainer, {
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, '+=0.2');

    // The whole timeline was built paused. Phase 1 crossfades the monitor
    // from the terminal placeholder straight to the live iframe, so the
    // iframe's own copy of the site needs to actually have painted
    // something by the time that crossfade starts — otherwise the monitor
    // shows blank space instead of the portfolio. The terminal placeholder
    // is already on screen (from the synchronous reset above), so it
    // naturally covers this wait; a 4s cap keeps a slow or blocked iframe
    // from ever hanging the intro.
    await waitForIframe(4000);

    // A replay's stopWhateverIsPlaying() may have already killed this
    // exact timeline while we were waiting (e.g. a very fast double-click
    // on the logo). Don't resurrect a killed timeline.
    if (activeTimeline !== tl) return;
    tl.play();
  }

  // ==========================================
  // Entry point used for both the initial load and a logo-triggered replay
  // ==========================================
  function playIntroFromStart() {
    stopWhateverIsPlaying();
    // A replay can only be triggered by clicking the logo, which is only
    // reachable once the nav is visible again — i.e. always from the very
    // top of the page already, so no scroll-position reset is needed here.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      playReducedMotionReveal();
    } else {
      playCinematicSequence();
    }
  }

  // Clicking "RATUL" replays the intro from the very beginning. The real
  // nav (and therefore the logo) is only interactive once `onComplete`
  // above has already restored `pointer-events`, so this can't fire while
  // an intro is already mid-playback.
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault(); // it's an <a href="#">; don't also jump-scroll
      playIntroFromStart();
    });
  }

  // ==========================================
  // Mouse Parallax (desktop only — no mouse on mobile, saves GPU)
  // Set up once; independent of which sequence is currently playing.
  // ==========================================
  if (!isMobile) {
    let parallaxX = 0;
    let parallaxY = 0;
    let rafId = null;

    function applyParallax() {
      scene.style.transform = `rotateY(${parallaxX * 2}deg) rotateX(${-parallaxY * 1}deg)`;
      rafId = null;
    }

    introContainer.addEventListener('mousemove', (e) => {
      parallaxX = (e.clientX / window.innerWidth - 0.5) * 2;
      parallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafId) {
        rafId = requestAnimationFrame(applyParallax);
      }
    }, { passive: true });
  }

  // ==========================================
  // Iframe Scale Logic
  // The monitor frame is a fixed 16:9 window. Rendering the iframe at
  // 960×540 (rather than a narrower, mobile-breakpoint width) keeps it in
  // the site's desktop hero layout — photo beside the text — which is
  // compact enough to fit entirely inside the frame instead of being
  // stacked and clipped. Set up once; unaffected by replays.
  // ==========================================
  const iframeBaseWidth = isMobile ? 960 : 1920;
  const iframeBaseHeight = isMobile ? 540 : 1080;

  if (iframeEl) {
    iframeEl.style.width = iframeBaseWidth + 'px';
    iframeEl.style.height = iframeBaseHeight + 'px';
  }

  function updateIframeScale() {
    if (iframeContainer && iframeEl) {
      const scale = iframeContainer.clientWidth / iframeBaseWidth;
      iframeEl.style.transform = `scale(${scale})`;
    }
  }
  window.addEventListener('resize', updateIframeScale, { passive: true });
  updateIframeScale();

  playIntroFromStart();
}
