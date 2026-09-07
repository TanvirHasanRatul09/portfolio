import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCinematicIntro() {
  const introContainer = document.getElementById('cinematic-intro');
  const scene = document.querySelector('.cinematic-scene');
  const camera = document.querySelector('.cinematic-camera');
  const screen = document.querySelector('.cinematic-screen');
  const person = document.querySelector('.person-silhouette');

  if (!introContainer || !scene || !camera || !screen || !person) return;

  const isMobile = window.innerWidth <= 768;

  // Mobile browsers resize the viewport every time the address bar shows
  // or hides during scroll — GSAP would otherwise treat that as a real
  // resize and re-run all ScrollTrigger start/end math mid-scrub, which is
  // what causes the animation to visibly jump/glitch on phones. This tells
  // ScrollTrigger to ignore that specific case.
  //
  // NOTE: an earlier version of this fix also called
  // ScrollTrigger.normalizeScroll(true) here. That hijacks native touch
  // scrolling and, on this page, was measuring the scrollable page height
  // *before* the scroll-proxy element below existed — so it capped
  // scrolling short and the whole cinematic sequence froze partway through
  // on real phones and in-app browsers (e.g. Messenger's WebView). Removed.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // ==========================================
  // Respect prefers-reduced-motion
  // ==========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Skip the cinematic sequence entirely — simple fade reveal
    introContainer.style.position = 'fixed';
    introContainer.style.top = '0';
    introContainer.style.left = '0';
    introContainer.style.width = '100%';
    introContainer.style.height = '100vh';
    introContainer.style.height = '100dvh'; // ignored by browsers that don't support dvh, keeping the vh fallback above
    introContainer.style.zIndex = '9999';
    introContainer.style.transition = 'opacity 0.6s ease';

    // After a brief delay, fade out and remove
    setTimeout(() => {
      introContainer.style.opacity = '0';
      setTimeout(() => {
        introContainer.style.display = 'none';
      }, 600);
    }, 800);

    return;
  }

  // ==========================================
  // Mouse Parallax (desktop only — no mouse on mobile, saves GPU)
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
  // On mobile, render at 640×360 instead of 1920×1080 to massively reduce GPU load.
  // The monitor screen is tiny on mobile, so this resolution is more than enough.
  // ==========================================
  const iframeContainer = document.querySelector('.portfolio-iframe-container');
  const iframeEl = document.querySelector('.portfolio-iframe');
  const iframeBaseWidth = isMobile ? 640 : 1920;
  const iframeBaseHeight = isMobile ? 360 : 1080;

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

  // ==========================================
  // GSAP ScrollTrigger Camera Sequence
  // ==========================================
  const terminal = document.querySelector('.terminal-placeholder');

  // Make the cinematic intro container fixed so it stays in the viewport
  introContainer.style.position = 'fixed';
  introContainer.style.top = '0';
  introContainer.style.left = '0';
  introContainer.style.width = '100%';
  introContainer.style.height = '100vh';
  introContainer.style.height = '100dvh'; // ignored by browsers that don't support dvh, keeping the vh fallback above
  introContainer.style.zIndex = '9999';

  // Hide the real navbar during the cinematic intro.
  // The nav is outside <main> with z-index:100, while the intro is inside <main> (z-index:1).
  // The intro's z-index:9999 is trapped in main's stacking context, so the nav bleeds through.
  const realNav = document.querySelector('nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  if (realNav) {
    realNav.style.opacity = '0';
    realNav.style.pointerEvents = 'none';
    realNav.style.transition = 'opacity 0.5s ease';
  }
  if (mobileOverlay) {
    mobileOverlay.style.display = 'none';
  }

  // Create a scroll proxy element. Shorter on mobile for snappier feel.
  const proxy = document.createElement('div');
  proxy.id = 'cinematic-scroll-proxy';
  proxy.style.height = isMobile ? '500px' : '800px';
  proxy.style.width = '100%';
  document.body.insertBefore(proxy, document.body.firstChild);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: proxy,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Phase 1: Terminal fades out, portfolio interface fades in on the monitor
  tl.to(terminal, { autoAlpha: 0, duration: 1.5, ease: 'power1.inOut' });
  if (iframeContainer) {
    tl.to(iframeContainer, { opacity: 1, duration: 1.5, ease: 'power1.inOut' }, '<0.5');
  }

  // Phase 2: Dolly zoom — establishing shot
  tl.to(camera, { z: 50, duration: 1, ease: 'none' }, '+=0.5');
  tl.to(person, { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, '<0.5');

  // Phase 3: Move toward desk
  tl.to(camera, { z: 500, duration: 2, ease: 'power1.inOut' });

  // Phase 4: Enter Monitor — dynamically calculated Z for pixel-perfect full-screen fit
  // CSS perspective is 1000px. The monitor layer sits at translateZ(50px).
  // We need: scale = perspective / (perspective - (cameraZ - layerZ))
  // Solving for cameraZ when scale fills the viewport.
  const monitorScreen = document.querySelector('.cinematic-screen');
  let cameraZFinal = 850;

  if (monitorScreen) {
    const rect = monitorScreen.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    // Slightly over-scale (1.02x) so monitor frame bleeds off-screen during crossfade
    const relativeScale = Math.max(scaleX, scaleY) * 1.02;
    // perspective = 1000, monitor layer Z offset = 50
    // Effective depth = 1000 - 50 = 950
    cameraZFinal = 950 - (950 / relativeScale);
  }

  tl.to(camera, { z: cameraZFinal, duration: 4, ease: 'power2.inOut' });

  // Phase 5: Crossfade — reveal the real portfolio underneath
  // autoAlpha sets visibility: hidden when opacity hits 0, preventing click-blocking
  tl.to(introContainer, {
    autoAlpha: 0,
    duration: 3,
    ease: 'power2.inOut',
    onComplete: () => {
      // Reveal the real navbar after the cinematic intro is fully gone
      if (realNav) {
        realNav.style.opacity = '1';
        realNav.style.pointerEvents = '';
      }
      if (mobileOverlay) {
        mobileOverlay.style.display = '';
      }
    },
    onReverseComplete: () => {
      // Hide nav again if user scrolls back to the top
      if (realNav) {
        realNav.style.opacity = '0';
        realNav.style.pointerEvents = 'none';
      }
    }
  }, '+=1');

  // The proxy element was just inserted, changing the document's total
  // scrollable height. Force ScrollTrigger to re-measure right away so its
  // start/end points are based on the final layout, not whatever it saw
  // before the proxy existed.
  ScrollTrigger.refresh();
}
