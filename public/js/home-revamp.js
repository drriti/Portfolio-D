/* ==========================================================================
   HOMEPAGE INTERACTIVE LOGIC & 3D ARTISTIC SCULPTURE
   - Architectural Hairline Preloader with live counter (00% -> 100%)
   - Three.js WebGL Floating Liquid Glass Sculpture (No Grids)
   - Magnetic Cursor Physics & Velocity Tracking
   - Lenis Smooth Scrolling / GSAP Integration
   ========================================================================== */

(function () {
  'use strict';

  // 1. ARCHITECTURAL PRELOADER LOGIC (ThevertMenthe inspired)
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloaderCounter');
  const progressLine = document.getElementById('preloaderLine');
  const statusEl = document.getElementById('preloaderStatus');

  let currentPercent = 0;
  const targetPercent = 100;
  const duration = 1400; // ms
  const intervalTime = 20;
  const step = targetPercent / (duration / intervalTime);

  const timer = setInterval(() => {
    currentPercent += step;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(timer);
      if (counterEl) counterEl.textContent = '1 0 0 %';
      if (progressLine) progressLine.style.width = '100%';
      if (statusEl) statusEl.textContent = 'SYSTEM READY · WELCOME';

      // Graceful reveal
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          // Trigger Hero entrances
          initHeroAnimations();
        }
      }, 350);
    } else {
      const formatted = Math.floor(currentPercent).toString().padStart(2, '0').split('').join(' ');
      if (counterEl) counterEl.textContent = `${formatted} %`;
      if (progressLine) progressLine.style.width = `${currentPercent}%`;
    }
  }, intervalTime);

  // 2. CUSTOM MAGNETIC CURSOR
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover magnetic scaling on links & buttons
    const interactables = document.querySelectorAll('a, button, .interactive-hover');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  // 3. THREE.JS ARTISTIC 3D LIQUID SCULPTURE (NO GRIDS)
  let scene, camera, renderer, sculpture, material;
  const canvas = document.getElementById('hero-sculpture-canvas');

  if (canvas && typeof THREE !== 'undefined') {
    init3DScene();
  }

  function init3DScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5.2;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Torus Knot Geometry (Organic fluid form)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32, 2, 3);

    // Custom Shaded / Physical Material for Liquid Chromatic Look
    material = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x1f143d,
      roughness: 0.15,
      metalness: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transmission: 0.6, // Glass-like transmission
      ior: 1.45,
      wireframe: false // STRICTLY NO GRIDS
    });

    sculpture = new THREE.Mesh(geometry, material);
    scene.add(sculpture);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa78bfa, 4, 20);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 3, 20);
    pointLight2.position.set(-3, -3, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xfbbf24, 1.5, 15);
    pointLight3.position.set(0, 3, -2);
    scene.add(pointLight3);

    // Mouse tracking for 3D rotation
    let targetRotationX = 0;
    let targetRotationY = 0;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = normX * 0.7;
      targetRotationX = normY * 0.5;
    });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Render Loop
    let clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (sculpture) {
        // Continuous gentle breathing rotation
        sculpture.rotation.y += delta * 0.25;
        sculpture.rotation.x += delta * 0.15;

        // Smooth cursor responsiveness with spring damping
        sculpture.rotation.y += (targetRotationY - sculpture.rotation.y) * 0.05;
        sculpture.rotation.x += (targetRotationX - sculpture.rotation.x) * 0.05;

        // Subtle vertical float
        sculpture.position.y = Math.sin(time * 0.8) * 0.12;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
  }

  // 4. GSAP ENTRANCES ONCE LOADED
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.site-nav', {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.hero-eyebrow-container', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.hero-title-main', {
      y: 40,
      opacity: 0,
      duration: 1.1,
      delay: 0.35,
      ease: 'power3.out'
    });

    gsap.from('.hero-statement', {
      y: 25,
      opacity: 0,
      duration: 0.9,
      delay: 0.5,
      ease: 'power3.out'
    });

    gsap.from('.hero-actions-row', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.65,
      ease: 'power3.out'
    });
  }
})();
