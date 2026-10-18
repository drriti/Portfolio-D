/* ==========================================================================
   CINEMATIC 3D ENGINE & STORYTELLING SCRIPT
   - Three.js WebGL procedural organic terrain landscape
   - 3D Floating Project Portals with live work imagery (Khel Sutra, Echo, MyDayss, UniPath)
   - Centered silhouette avatar standing on the terrain looking into the horizon
   - Shimmering starlight particles & atmospheric fog
   - Mouse parallax camera drift & interactive raycaster for clicking portals
   ========================================================================== */

(function () {
  'use strict';

  // 1. PRELOADER TICKER
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloaderCounter');
  const progressLine = document.getElementById('preloaderLine');
  const statusEl = document.getElementById('preloaderStatus');

  let currentPercent = 0;
  const targetPercent = 100;
  const duration = 1200;
  const interval = 20;
  const step = targetPercent / (duration / interval);

  const pTimer = setInterval(() => {
    currentPercent += step;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(pTimer);
      if (counterEl) counterEl.textContent = '1 0 0 %';
      if (progressLine) progressLine.style.width = '100%';
      if (statusEl) statusEl.textContent = 'SYSTEM INITIALIZED · ENJOY THE JOURNEY';

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          initHeroReveal();
        }
      }, 350);
    } else {
      const formatted = Math.floor(currentPercent).toString().padStart(2, '0').split('').join(' ');
      if (counterEl) counterEl.textContent = `${formatted} %`;
      if (progressLine) progressLine.style.width = `${currentPercent}%`;
    }
  }, interval);

  // 2. THREE.JS 3D CINEMATIC UNIVERSE
  let scene, camera, renderer;
  let terrainMesh, portalMeshes = [], starsParticles;
  let raycaster, mouseNorm;
  const canvas = document.getElementById('cinematic-3d-canvas');
  const portalHud = document.getElementById('portalHud');
  const hudCategory = document.getElementById('hudCategory');
  const hudTitle = document.getElementById('hudTitle');

  if (canvas && typeof THREE !== 'undefined') {
    initCinematicScene();
  }

  function initCinematicScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0e18, 0.045);

    camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 7.8);
    camera.lookAt(0, 1.4, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    raycaster = new THREE.Raycaster();
    mouseNorm = new THREE.Vector2(-999, -999);

    // ─────────────────────────────────────────────
    // A. PROCEDURAL ORGANIC TERRAIN (Foreground Hills)
    // ─────────────────────────────────────────────
    const terrainGeo = new THREE.PlaneGeometry(26, 18, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    // Sculpt natural dunes/hills matching Sleep Well Creatives
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Gentle rolling hill math
      const wave1 = Math.sin(x * 0.35) * Math.cos(z * 0.4) * 0.8;
      const wave2 = Math.sin(x * 0.7 + z * 0.5) * 0.3;
      const mound = Math.exp(-((x * x) / 22 + ((z + 2) * (z + 2)) / 16)) * 1.4;
      pos.setY(i, wave1 + wave2 + mound - 0.7);
    }
    terrainGeo.computeVertexNormals();

    // Custom Canvas Texture for Tactile Contrast Contours (Black & Cream like the reference)
    const contourTex = createContourTexture();
    contourTex.wrapS = THREE.RepeatWrapping;
    contourTex.wrapT = THREE.RepeatWrapping;
    contourTex.repeat.set(3, 3);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: contourTex,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: false
    });

    terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -0.6, -1);
    scene.add(terrainMesh);

    // ─────────────────────────────────────────────
    // B. CENTER SILHOUETTE AVATAR (Looking into the horizon)
    // ─────────────────────────────────────────────
    createSilhouetteFigure();

    // ─────────────────────────────────────────────
    // C. 3D FLOATING PROJECT PORTALS (Your Glimpses of Work)
    // ─────────────────────────────────────────────
    const textureLoader = new THREE.TextureLoader();

    const projectsData = [
      {
        id: 'khel-sutra',
        title: 'Bhartiya Khel Sutra',
        category: 'Flagship UI/UX · 75 Games Spatial Archive',
        url: 'preview-khel-sutra.html',
        image: 'images/khel-sutra/playground-home-screen.jpg',
        position: new THREE.Vector3(-3.2, 2.6, -1.2),
        rotation: new THREE.Euler(0.08, 0.32, -0.06),
        aspect: 16 / 9
      },
      {
        id: 'echo',
        title: 'Echo Music Player',
        category: '🏆 1st Prize Winner · Hackathon Product Design',
        url: 'preview-echo.html',
        image: 'images/echo/round2-final-screens.jpg',
        position: new THREE.Vector3(3.2, 2.7, -1.0),
        rotation: new THREE.Euler(0.08, -0.34, 0.06),
        aspect: 16 / 9
      },
      {
        id: 'mydayss',
        title: 'MyDayss',
        category: 'Emotional Search Experience & Journaling',
        url: 'preview-mydayss.html',
        image: 'images/mydayss/hero.png',
        position: new THREE.Vector3(-1.8, 4.0, -3.2),
        rotation: new THREE.Euler(0.12, 0.22, 0.02),
        aspect: 16 / 9
      },
      {
        id: 'unipath',
        title: 'UniPath',
        category: 'EdTech Study Abroad Mobile Platform',
        url: 'Unipath.html',
        image: 'images/unipath.jpg.png',
        position: new THREE.Vector3(1.8, 4.1, -3.0),
        rotation: new THREE.Euler(0.12, -0.22, -0.02),
        aspect: 16 / 9
      }
    ];

    projectsData.forEach((p) => {
      const tex = textureLoader.load(p.image);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;

      const portalWidth = 2.4;
      const portalHeight = portalWidth / p.aspect;
      const portalGeo = new THREE.PlaneGeometry(portalWidth, portalHeight);

      const portalMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(portalGeo, portalMat);
      mesh.position.copy(p.position);
      mesh.rotation.copy(p.rotation);
      mesh.userData = {
        id: p.id,
        title: p.title,
        category: p.category,
        url: p.url,
        basePos: p.position.clone(),
        baseRot: p.rotation.clone()
      };

      // Add a thin glassmorphic border frame around each portal
      const frameGeo = new THREE.RingGeometry(1, 1.04, 32);
      const frameMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, wireframe: true, opacity: 0.4, transparent: true });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.scale.set(portalWidth * 0.55, portalHeight * 0.55, 1);
      frameMesh.position.z = 0.01;
      mesh.add(frameMesh);

      portalMeshes.push(mesh);
      scene.add(mesh);
    });

    // ─────────────────────────────────────────────
    // D. SHIMMERING STARRY SKY PARTICLES
    // ─────────────────────────────────────────────
    createStarfield();

    // ─────────────────────────────────────────────
    // E. LIGHTING SETUP
    // ─────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.2);
    scene.add(ambientLight);

    const keyMoonLight = new THREE.DirectionalLight(0x93c5fd, 2.2);
    keyMoonLight.position.set(0, 6, 4);
    scene.add(keyMoonLight);

    const warmUnderGlow = new THREE.PointLight(0xfde047, 1.4, 15);
    warmUnderGlow.position.set(0, 0.4, 1.5);
    scene.add(warmUnderGlow);

    const rimBlue = new THREE.PointLight(0x38bdf8, 2.5, 20);
    rimBlue.position.set(-5, 3, -2);
    scene.add(rimBlue);

    // ─────────────────────────────────────────────
    // F. MOUSE TRACKING & PARALLAX
    // ─────────────────────────────────────────────
    let targetCamX = 0;
    let targetCamY = 1.2;
    let hoveredPortal = null;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseNorm.x = normX;
      mouseNorm.y = normY;

      // Camera parallax tilt
      targetCamX = normX * 0.65;
      targetCamY = 1.2 + normY * 0.35;
    });

    // Portal Click Navigation
    window.addEventListener('click', (e) => {
      if (hoveredPortal && hoveredPortal.userData.url) {
        window.location.href = hoveredPortal.userData.url;
      }
    });

    // Window Resize
    window.addEventListener('resize', onResize);

    // Render Loop
    let clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.4, -0.5);

      // Floating drift animation for each project portal
      portalMeshes.forEach((mesh, idx) => {
        const offset = idx * 1.3;
        mesh.position.y = mesh.userData.basePos.y + Math.sin(elapsed * 0.9 + offset) * 0.12;
        mesh.rotation.z = mesh.userData.baseRot.z + Math.cos(elapsed * 0.7 + offset) * 0.03;
      });

      // Subtle twinkling in stars
      if (starsParticles) {
        starsParticles.rotation.y = elapsed * 0.015;
      }

      // Raycaster check for portal hover
      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObjects(portalMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hoveredPortal !== hit) {
          hoveredPortal = hit;
          canvas.style.cursor = 'pointer';
          if (portalHud) {
            portalHud.classList.add('active');
            if (hudCategory) hudCategory.textContent = hit.userData.category;
            if (hudTitle) hudTitle.textContent = hit.userData.title;
          }
        }
        // Magnetic slight tilt toward cursor
        hit.rotation.y += ((mouseNorm.x * 0.4) - hit.rotation.y) * 0.1;
      } else {
        if (hoveredPortal) {
          hoveredPortal = null;
          canvas.style.cursor = 'default';
          if (portalHud) portalHud.classList.remove('active');
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
  }

  // Helper: Create the organic wavy contour pattern on the terrain
  function createContourTexture() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    // Deep dark base
    ctx.fillStyle = '#111420';
    ctx.fillRect(0, 0, size, size);

    // Cream / light contour bands (like Sleep Well Creatives top dunes)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';

    for (let y = 30; y < size; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < size; x += 30) {
        const curve = Math.sin((x / size) * Math.PI * 4) * 22;
        ctx.lineTo(x, y + curve);
      }
      ctx.stroke();
    }

    return new THREE.CanvasTexture(c);
  }

  // Helper: Create Centered Silhouette Figure
  function createSilhouetteFigure() {
    const group = new THREE.Group();

    // Body material: Dark silhouette with subtle rim lighting
    const silMat = new THREE.MeshBasicMaterial({ color: 0x07090f });

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const head = new THREE.Mesh(headGeo, silMat);
    head.position.y = 1.62;
    group.add(head);

    // Torso / Dress
    const bodyGeo = new THREE.ConeGeometry(0.32, 1.1, 24);
    const body = new THREE.Mesh(bodyGeo, silMat);
    body.position.y = 0.95;
    group.add(body);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.42, 12);
    const legL = new THREE.Mesh(legGeo, silMat);
    legL.position.set(-0.08, 0.22, 0);
    const legR = new THREE.Mesh(legGeo, silMat);
    legR.position.set(0.08, 0.22, 0);
    group.add(legL);
    group.add(legR);

    // Position figure right in center of the dune
    group.position.set(0, 0.05, 1.2);
    scene.add(group);
  }

  // Helper: Create Twinkling Starfield
  function createStarfield() {
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = Math.random() * 12 + 1.5;
      positions[i + 2] = (Math.random() - 0.5) * 15 - 4;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.045,
      transparent: true,
      opacity: 0.8
    });

    starsParticles = new THREE.Points(starGeo, starMat);
    scene.add(starsParticles);
  }

  function onResize() {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  function initHeroReveal() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.site-nav', {
      y: -40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out'
    });

    gsap.from('.hero-celestial-emblem', {
      y: -25,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.hero-guiding-eyebrow', {
      y: 15,
      opacity: 0,
      duration: 0.8,
      delay: 0.35,
      ease: 'power3.out'
    });

    gsap.from('.hero-cinematic-title', {
      y: 35,
      opacity: 0,
      duration: 1.2,
      delay: 0.45,
      ease: 'power3.out'
    });

    gsap.from('.hero-signature-line', {
      y: 20,
      opacity: 0,
      duration: 0.9,
      delay: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.hero-bottom-controls', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.8,
      ease: 'power3.out'
    });
  }
})();
