import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCinematicIntro() {
  console.log("Cinematic Intro Module 4 Initialized.");
  
  const introContainer = document.getElementById('cinematic-intro');
  const scene = document.querySelector('.cinematic-scene');
  const camera = document.querySelector('.cinematic-camera');
  const screen = document.querySelector('.cinematic-screen');
  const person = document.querySelector('.person-silhouette');

  if (introContainer && scene && camera && screen && person) {
    console.log("Cinematic intro DOM elements found.");
    
    // Subtle Mouse Parallax
    introContainer.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      scene.style.transform = `rotateY(${x * 2}deg) rotateX(${-y * 1}deg)`;
    });

    // ==========================================
    // Iframe Scale Logic
    // Forces the miniature portfolio to render at 1080p resolution and scales it down to fit the monitor
    // ==========================================
    const iframeContainer = document.querySelector('.portfolio-iframe-container');
    const iframeContent = document.querySelector('.portfolio-iframe');
    
    function updateIframeScale() {
      if (iframeContainer && iframeContent) {
        const scale = iframeContainer.clientWidth / 1920;
        iframeContent.style.transform = `scale(${scale})`;
      }
    }
    
    window.addEventListener('resize', updateIframeScale);
    updateIframeScale();

    // ==========================================
    // GSAP ScrollTrigger Camera Sequence
    // ==========================================
    const terminal = document.querySelector('.terminal-placeholder');
    const iframe = document.querySelector('.portfolio-iframe-container');

    // Make the cinematic intro container fixed so it stays in the viewport
    introContainer.style.position = 'fixed';
    introContainer.style.top = '0';
    introContainer.style.left = '0';
    introContainer.style.width = '100%';
    introContainer.style.height = '100vh';
    introContainer.style.zIndex = '9999';

    // Create a 800px proxy element to absorb the scroll.
    // This pushes the real portfolio (main) down by exactly 800px.
    // This allows the user to complete the cinematic intro in about 2 scroll clicks.
    const proxy = document.createElement('div');
    proxy.id = 'cinematic-scroll-proxy';
    proxy.style.height = '800px';
    proxy.style.width = '100%';
    document.body.insertBefore(proxy, document.body.firstChild);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: proxy,
        start: 'top top',
        end: 'bottom top', // The timeline spans exactly the height of the proxy (1500px)
        scrub: 1 // Smooth interpolation
      }
    });

    // Phase 1: Code execution and interface boot up
    tl.to(terminal, { opacity: 0, duration: 1.5, ease: 'power1.inOut' });
    tl.to(iframe, { opacity: 1, duration: 1.5, ease: 'power1.inOut' }, "<0.5");

    // Phase 2: Dolly zoom starts (Establishing Shot)
    tl.to(camera, { z: 50, duration: 1, ease: 'none' }, "+=0.5");
    tl.to(person, { opacity: 0, duration: 1, ease: 'power2.inOut' }, "<0.5");

    // Phase 3: Move toward desk
    tl.to(camera, { z: 500, duration: 2, ease: 'power1.inOut' });

    // Phase 4: Enter Monitor (Dynamic Z calculation for perfect full-screen fit)
    const monitorScreen = document.querySelector('.cinematic-screen');
    let cameraZFinal = 850; 
    
    if (monitorScreen) {
      const rect = monitorScreen.getBoundingClientRect();
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;
      const relativeScale = Math.max(scaleX, scaleY) * 1.02; 
      cameraZFinal = 900 - (900 / relativeScale);
    }
    
    tl.to(camera, { z: cameraZFinal, duration: 4, ease: 'power2.inOut' });

    // Phase 6: Transition to Portfolio
    // Use autoAlpha so that when it fades out, it also sets visibility: hidden
    // This prevents the invisible cinematic intro from blocking clicks on the real portfolio!
    tl.to(introContainer, {
      autoAlpha: 0,
      duration: 3, 
      ease: 'power2.inOut'
    }, "+=1");

  } else {
    console.warn("Cinematic intro DOM elements NOT found.");
  }
}
