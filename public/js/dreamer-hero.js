/* ==========================================================================
   DRRITI PASRIJA — "THE DREAMER" INTERACTIVE THREE.JS ENGINE
   Features:
     - 3D Rolling Dunelandscape sculpted exactly to match Sleep Well Creatives & Figma
     - Custom Organic Contour Texture (Tactile cream & rich charcoal bands)
     - Animated Floating Golden Starlight System (Move with cursor parallax)
     - Smooth Mouse Parallax camera tilt tracking
     - Sleep Well Creatives cursor (dot + ring, mix-blend-mode: difference)
     - Preloader ticker integration
   ========================================================================== */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────
  // 1. SLEEP WELL CREATIVES CURSOR
  // ─────────────────────────────────────────────────────────────────────
  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'swc-cursor-dot';
  cursorRing.className = 'swc-cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Lagged spring ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state — interactive elements expand dot, shrink ring
  const interactiveEls = 'a, button, [data-cursor]';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('swc-hover');
      cursorRing.classList.add('swc-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('swc-hover');
      cursorRing.classList.remove('swc-hover');
    });
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [data-cursor]')) {
      cursorDot.classList.add('swc-hover');
      cursorRing.classList.add('swc-hover');
    } else {
      cursorDot.classList.remove('swc-hover');
      cursorRing.classList.remove('swc-hover');
    }
  });

  // ─────────────────────────────────────────────────────────────────────
  // 2. PRELOADER TICKER
  // ─────────────────────────────────────────────────────────────────────
  const preloader   = document.getElementById('dreamer-preloader');
  const counterEl   = document.getElementById('dreamerCounter');
  const progressLine = document.getElementById('dreamerProgressLine');

  let currentPercent = 0;
  const duration = 1200;
  const interval = 20;
  const step = 100 / (duration / interval);

  const pTimer = setInterval(() => {
    currentPercent += step;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(pTimer);
      if (counterEl) counterEl.textContent = '1 0 0 %';
      if (progressLine) progressLine.style.width = '100%';

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          initHeroAnimations();
        }
      }, 350);
    } else {
      const formatted = Math.floor(currentPercent).toString().padStart(2, '0').split('').join(' ');
      if (counterEl) counterEl.textContent = `${formatted} %`;
      if (progressLine) progressLine.style.width = `${currentPercent}%`;
    }
  }, interval);

  // ─────────────────────────────────────────────────────────────────────
  // 3. THREE.JS 3D CANVAS SCENE
  // ─────────────────────────────────────────────────────────────────────
  let scene, camera, renderer;
  let terrainMesh, starPoints, starMaterial;
  const canvas = document.getElementById('dreamer-3d-canvas');

  // Normalized mouse for parallax (-1 to 1)
  let normMouseX = 0;
  let normMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    normMouseX = (e.clientX / window.innerWidth)  * 2 - 1;
    normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  if (canvas && typeof THREE !== 'undefined') {
    init3DWorld();
  }

  function init3DWorld() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c16, 0.04);

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.4, 7.5);
    camera.lookAt(0, 1.4, 0);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── A. 3D PROCEDURAL TACTILE ROLLING TERRAIN ──
    const terrainGeo = new THREE.PlaneGeometry(28, 16, 96, 96);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const mainDune   = Math.exp(-((x * x) / 24 + ((z + 1.2) * (z + 1.2)) / 14)) * 1.55;
      const leftCrest  = Math.sin((x + 4.5) * 0.45) * Math.cos(z * 0.5) * 0.9;
      const rightCrest = Math.sin((x - 4.5) * 0.45) * Math.cos(z * 0.5) * 0.9;
      const wave       = Math.sin(x * 0.8 + z * 0.6) * 0.25;
      pos.setY(i, mainDune + leftCrest + rightCrest + wave - 0.9);
    }
    terrainGeo.computeVertexNormals();

    const contourTexture = generateContourPattern();
    contourTexture.wrapS = THREE.RepeatWrapping;
    contourTexture.wrapT = THREE.RepeatWrapping;
    contourTexture.repeat.set(3, 3);

    const terrainMat = new THREE.MeshStandardMaterial({ map: contourTexture, roughness: 0.82, metalness: 0.08 });
    terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -0.65, 0);
    scene.add(terrainMesh);

    // ── B. STARS THAT MOVE WITH CURSOR (Parallax via shader uniforms) ──
    const starCount     = 380;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes     = new Float32Array(starCount);
    const starPhases    = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3]     = (Math.random() - 0.5) * 24;
      starPositions[i3 + 1] = Math.random() * 9 + 0.8;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 12 - 2;
      starSizes[i]  = Math.random() < 0.15 ? (Math.random() * 14 + 10) : (Math.random() * 6 + 3);
      starPhases[i] = Math.random() * Math.PI * 2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size',     new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('phase',    new THREE.BufferAttribute(starPhases, 1));

    starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time:      { value: 0 },
        mouseX:    { value: 0 },
        mouseY:    { value: 0 },
        starColor: { value: new THREE.Color(0xfbbf24) },
        coreColor: { value: new THREE.Color(0xfffbeb) }
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        varying float vAlpha;

        void main() {
          // Twinkle
          float twinkle = sin(time * 2.2 + phase);
          vAlpha = 0.5 + 0.5 * twinkle;

          vec3 p = position;
          // Gentle ambient float
          p.y += sin(time * 0.8 + phase) * 0.15;
          p.x += cos(time * 0.5 + phase) * 0.1;
          // Cursor parallax — deeper stars (larger phase) move more
          float depth = 0.04 + phase * 0.018;
          p.x += mouseX * depth;
          p.y += mouseY * depth * 0.7;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (1.0 + 0.35 * twinkle) * (18.0 / -mvPosition.z);
          gl_Position  = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 starColor;
        uniform vec3 coreColor;
        varying float vAlpha;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          float intensity = pow(1.0 - dist * 2.0, 1.6);
          vec3 color = mix(starColor, coreColor, intensity * 0.7);
          gl_FragColor = vec4(color, intensity * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    starPoints = new THREE.Points(starGeo, starMaterial);
    scene.add(starPoints);

    // ── C. CINEMATIC LIGHTING ──
    scene.add(new THREE.AmbientLight(0xdbeafe, 1.3));
    const skyLight = new THREE.DirectionalLight(0x93c5fd, 2.0);
    skyLight.position.set(0, 8, 3);
    scene.add(skyLight);
    const goldenGlow = new THREE.PointLight(0xfbbf24, 2.2, 14);
    goldenGlow.position.set(0, 0.8, 1.8);
    scene.add(goldenGlow);

    // ── D. MOUSE PARALLAX CAMERA DRIFT ──
    let targetCamX = 0;
    let targetCamY = 1.4;
    const figureElem = document.querySelector('.dreamer-figure-svg');

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth)  * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamX = nx * 0.55;
      targetCamY = 1.4 + ny * 0.28;
      if (figureElem) {
        figureElem.style.transform = `rotate(${nx * 2.5}deg) translateY(${Math.abs(nx) * -3}px)`;
      }
    });

    window.addEventListener('resize', () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // ── E. RENDER LOOP ──
    const clock = new THREE.Clock();

    function renderLoop() {
      const elapsed = clock.getElapsedTime();

      // Update star shader uniforms
      if (starMaterial && starMaterial.uniforms) {
        starMaterial.uniforms.time.value   = elapsed;
        starMaterial.uniforms.mouseX.value = normMouseX * 1.6;
        starMaterial.uniforms.mouseY.value = normMouseY * 1.2;
      }

      // Smooth camera
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.35, -0.4);

      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
  }

  // Tactile organic contour terrain texture
  function generateContourPattern() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f121d';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#f3ede2';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    for (let y = 30; y < size; y += 46) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < size; x += 28) {
        const curve = Math.sin((x / size) * Math.PI * 4) * 24;
        ctx.lineTo(x, y + curve);
      }
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  }

  // Entrance animations
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.from('.organic-nav-container', { y: -50, opacity: 0, duration: 1.1, ease: 'power3.out' });
    gsap.from('.dreamer-name-title',    { y: 40,  opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    gsap.from('.dreamer-role-bg-text',  { y: 25,  opacity: 0, duration: 1.0, delay: 0.3, ease: 'power3.out' });
    gsap.from('.dreamer-story-left',    { x: -40, opacity: 0, duration: 1.1, delay: 0.5, ease: 'power3.out' });
    gsap.from('.dreamer-story-right',   { x: 40,  opacity: 0, duration: 1.1, delay: 0.55,ease: 'power3.out' });
    gsap.from('.dreamer-figure-wrapper',{ y: 50,  opacity: 0, duration: 1.3, delay: 0.4, ease: 'power3.out' });
    gsap.from('.dreamer-bottom-anchor', { y: 20,  opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
  }
})();
