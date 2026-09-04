import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

// Particles / Data Nodes
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
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
