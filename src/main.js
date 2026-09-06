import './style.css';
import './intro.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Cinematic Intro Module
import { initCinematicIntro } from './intro.js';

// Check if we are inside the iframe monitor
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('intro') === 'false') {
  // Hide the cinematic intro entirely and don't initialize GSAP for it
  const introEl = document.getElementById('cinematic-intro');
  if (introEl) introEl.style.display = 'none';
  
  // Hide scrollbars so the miniature portfolio looks clean inside the monitor
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
} else {
  initCinematicIntro();
}

// --- THREE.JS BACKGROUND SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles / Data Nodes — fewer on mobile to save GPU
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = window.innerWidth <= 768 ? 200 : 700;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  // Spread particles randomly in 3D space
  posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
  size: 0.25, /* Increased size for mobile visibility */
  color: 0x7e22ce, /* Deep Purple to match theme */
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// Mouse interaction setup
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Gentle idle rotation
  particlesMesh.rotation.y = elapsedTime * 0.15;
  particlesMesh.rotation.x = elapsedTime * 0.08;

  // Mouse interaction for parallax effect
  targetX = mouseX * 0.002;
  targetY = mouseY * 0.002;
  
  particlesMesh.rotation.y += 0.1 * (targetX - particlesMesh.rotation.y);
  particlesMesh.rotation.x += 0.1 * (targetY - particlesMesh.rotation.x);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// --- GSAP ANIMATIONS ---
// Reveal sections on scroll
const sections = document.querySelectorAll('section');

sections.forEach((section) => {
  // Initial state setup to avoid FOUC before JS runs
  section.classList.remove('hidden'); 
  
  gsap.fromTo(section, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// Staggered reveal for skills
const skillCards = document.querySelectorAll('.skill-card');
if(skillCards.length > 0) {
  gsap.from(skillCards, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 70%'
    }
  });
}

// Staggered reveal for projects
const projectCards = document.querySelectorAll('.project-card');
if(projectCards.length > 0) {
  gsap.from(projectCards, {
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.2,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 70%'
    }
  });
}

// Hero animations on load
const tl = gsap.timeline();
tl.from('.greeting', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1, ease: 'power3.out', delay: 0.2 })
  .from('.name', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1, ease: 'power3.out' }, '-=0.6')
  .from('.title', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1, ease: 'power3.out' }, '-=0.6')
  .from('.summary', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1, ease: 'power3.out' }, '-=0.6')
  .from('.cta-buttons a', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
  .from('.hero-image', { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 1.5, ease: 'power3.out' }, 0.6);

// --- MOBILE NAVIGATION TOGGLE ---
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
const logo = document.querySelector('.logo');

if (menuBtn && mobileNav) {
  const menuIcon = menuBtn.querySelector('i');

  const closeMenu = () => {
    mobileNav.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  };

  // Toggle menu on button click
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from immediately closing it
    mobileNav.classList.toggle('active');
    
    // Toggle icon between bars and times (X)
    if (mobileNav.classList.contains('active')) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
    } else {
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    }
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when logo is clicked
  if (logo) {
    logo.addEventListener('click', closeMenu);
  }

  // Close menu when clicking anywhere outside of it
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });
}
