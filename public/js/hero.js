/* =========================================================================
   DRRITI — HERO & SCROLL TRANSITION ENGINE (GSAP 3 + ScrollTrigger)
   Robust implementation with smooth transforms, fail-safe image support,
   and deterministic tile generation.
   ========================================================================= */

(function () {
  'use strict';

  var root = document.getElementById('drh');
  if (!root) return;

  var $  = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };

  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* ---------------------------------------------------------- typography */
  function fitTitle() {
    var l1 = $('.drh__line--1 > span');
    var l2 = $('.drh__line--2 > span');
    var line1 = $('.drh__line--1');
    var line2 = $('.drh__line--2');
    if (!l1 || !l2 || !line1 || !line2) return;

    line2.style.fontSize = '';
    line2.style.marginLeft = '';

    var w1 = l1.offsetWidth;
    var w2 = l2.offsetWidth;
    if (!w1 || !w2) return;

    var currentFs2 = parseFloat(window.getComputedStyle(line2).fontSize);
    var targetFs2 = currentFs2 * (w1 / w2);
    line2.style.fontSize = targetFs2.toFixed(2) + 'px';
  }

  function splitWords(el) {
    if (!el || el.getAttribute('data-split')) return [];
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('data-split', '1');
    el.innerHTML = '';

    var sr = document.createElement('span');
    sr.textContent = text;
    sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
    el.appendChild(sr);

    var wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    text.split(' ').forEach(function (word, i, all) {
      var w = document.createElement('span');
      w.className = 'w';
      var s = document.createElement('span');
      s.textContent = word;
      w.appendChild(s);
      wrap.appendChild(w);
      if (i < all.length - 1) wrap.appendChild(document.createTextNode(' '));
    });
    el.appendChild(wrap);
    return $$('.w > span', el);
  }

  function onFonts(cb) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(cb).catch(cb);
    } else {
      setTimeout(cb, 200);
    }
  }

  /* ------------------------------------------------- static / reduced path */
  if (!window.gsap || !window.ScrollTrigger || mqReduce.matches) {
    root.classList.add('drh--static');
    fitTitle();
    onFonts(fitTitle);
    window.addEventListener('resize', fitTitle);
    return;
  }

  /* ------------------------------------------------------------- live path */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('drh--live');

  var pinEl   = $('.drh__pin');
  var scene   = $('.drh__scene');
  var mosaic  = $('.drh__mosaic');
  var panel   = $('.drh__panel');
  var content = $('.drh__content');
  var cta     = $('.drh__cta');
  var layers  = {};
  $$('.drh__layer').forEach(function (el) {
    layers[el.getAttribute('data-depth')] = el;
  });

  var words = splitWords($('.drh__statement'));
  fitTitle();
  onFonts(function () {
    fitTitle();
    ScrollTrigger.refresh();
  });
  ScrollTrigger.addEventListener('refreshInit', fitTitle);
  window.addEventListener('load', function () {
    fitTitle();
    ScrollTrigger.refresh();
  });

  if (mqReduce.addEventListener) {
    mqReduce.addEventListener('change', function () {
      location.reload();
    });
  }

  /* ------------------------------------------------------- collage tiles */
  function rng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Exclusively using images from 'home page pictures' folder
  var HOME_TILES = [
    { src: '/assets/home/ui-home-mobile.png',  ox: '50%', oy: '30%', z: 1.05 }, // Mobile Homescreen
    { src: '/assets/home/ui-screen-2.png',     ox: '50%', oy: '40%', z: 1.15 }, // UI Screen 2
    { src: '/assets/home/ui-music-player.png', ox: '50%', oy: '45%', z: 1.05 }, // Music Player
    { src: '/assets/home/ui-screen-3.png',     ox: '50%', oy: '50%', z: 1.15 }, // UI Screen 3
    { src: '/assets/home/ui-screen-1.png',     ox: '50%', oy: '45%', z: 1.12 }, // UI Screen 1
    { src: '/assets/home/ui-screen-4.png',     ox: '50%', oy: '50%', z: 1.15 }, // UI Screen 4
    { src: '/assets/home/ui-screen-5.png',     ox: '50%', oy: '45%', z: 1.12 }, // UI Screen 5
    { src: '/assets/home/ui-screen-6.png',     ox: '50%', oy: '50%', z: 1.15 }  // UI Screen 6
  ];

  var COLS = [
    [-170, 362], [200, 352], [560, 332], [900, 600],
    [1508, 392], [1908, 352], [2268, 362]
  ];
  var GAP = 8;
  var CT = { x: 900, y: 515, w: 600, h: 470 };

  function buildMosaic(mobile) {
    var r = rng(11);
    var cols = mobile ? COLS.slice(1, 6) : COLS;
    var tiles = [];
    var n = 0;
    var frag = document.createDocumentFragment();

    function mk(x, y, w, h, ci) {
      var d = document.createElement('div');
      d.className = 'drh__tile';
      d.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px';

      var item = HOME_TILES[n % HOME_TILES.length];
      n++;

      var im = new Image();
      im.alt = '';
      im.decoding = 'async';
      im.draggable = false;
      im.src = item.src;

      im.onerror = function() {
        d.style.background = 'radial-gradient(circle at 50% 50%, #424C3A, #1d2319)';
      };

      im.style.setProperty('--z', item.z);
      im.style.setProperty('--ox', item.ox);
      im.style.setProperty('--oy', item.oy);
      im.style.objectPosition = item.ox + ' ' + item.oy;
      im.style.setProperty('--dx', ((r() < 0.5 ? -1 : 1) * (4 + r() * 6)).toFixed(1) + 'px');
      im.style.setProperty('--dy', ((r() < 0.5 ? -1 : 1) * (3 + r() * 5)).toFixed(1) + 'px');
      im.style.setProperty('--dur', (14 + r() * 10).toFixed(1) + 's');
      im.style.animationDelay = (-r() * 15).toFixed(1) + 's';

      d.appendChild(im);
      frag.appendChild(d);
      tiles.push({ el: d, cx: x + w / 2 - 1200, cy: y + h / 2 - 750, k: r() });
    }

    cols.forEach(function (c, ci) {
      var x = c[0], w = c[1], y, h;
      if (x === CT.x) {
        y = CT.y - GAP;
        while (y > -900) {
          h = 240 + r() * 220;
          mk(x, y - h, w, h, ci);
          y -= h + GAP;
        }
        y = CT.y + CT.h + GAP;
        while (y < 2400) {
          h = 240 + r() * 220;
          mk(x, y, w, h, ci);
          y += h + GAP;
        }
      } else {
        y = -900 - r() * 250;
        while (y < 2400) {
          h = 260 + r() * 220;
          mk(x, y, w, h, ci);
          y += h + GAP;
        }
      }
    });

    mosaic.appendChild(frag);
    return tiles;
  }

  /* --------------------------------------------------- master timeline --- */
  var mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 769px)', mob: '(max-width: 768px)' }, function (ctx) {
    var mobile = !!ctx.conditions.mob;
    var ROT = mobile ? 7 : 10;
    var tiles = buildMosaic(mobile);

    function geom() {
      var w = scene.offsetWidth || window.innerWidth;
      var h = scene.offsetHeight || window.innerHeight;
      var k = mobile ? (0.60 * w) / CT.w : Math.max(w / 1920, h / 1080);
      var s = Math.max(0.5, (CT.w * k) / (0.94 * w), (CT.h * k) / (0.94 * h));
      var L = (1 - (CT.w * k / s) / w) / 2 * 100;
      var T = (1 - (CT.h * k / s) / h) / 2 * 100;
      return { k: k, s: s, T: Math.max(0, T), L: Math.max(0, L) };
    }

    // Set initial GPU states cleanly without clip-path redraw lag
    gsap.set(scene, { rotation: -ROT, scale: geom().s, borderRadius: 12 });
    gsap.set(mosaic, { scale: geom().k, rotation: -ROT });

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        end: function () {
          return '+=' + Math.round(window.innerHeight * (mobile ? 5.2 : 6.8));
        },
        pin: pinEl,
        scrub: 1.0,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: false
      }
    });

    /* 0 → 3.3  collage converges, focal tile becomes the scene */
    tl.to(scene, {
      rotation: 0,
      scale: 1,
      borderRadius: 0,
      ease: 'power3.inOut',
      duration: 3.3
    }, 0);

    tl.fromTo(mosaic,
      {
        scale: function () { return geom().k; },
        rotation: -ROT
      },
      {
        scale: function () { return geom().k * 1.5; },
        rotation: -ROT * 0.35,
        ease: 'power2.in',
        duration: 3.3
      },
      0
    );

    tl.to(mosaic, { autoAlpha: 0, duration: 0.35 }, 3.0);

    tiles.forEach(function (t) {
      var a = Math.atan2(t.cy, t.cx);
      var d = (120 + t.k * 240) * (mobile ? 0.7 : 1);
      tl.to(t.el, { x: Math.cos(a) * d, y: Math.sin(a) * d, ease: 'power2.in', duration: 3.3 }, 0);
      tl.to(t.el, { '--shade': 0.85, ease: 'power1.in', duration: 3.0 }, 0);
    });

    if (cta) {
      tl.to(cta, { autoAlpha: 0, y: -15, duration: 0.45 }, 0);
    }

    // Depth layers scale in gently
    var Z0 = { sky: 1.03, far: 1.07, mid: 1.12, water: 1.12, island: 1.18, air: 1.24, fg: 1.38 };
    Object.keys(Z0).forEach(function (key) {
      if (layers[key]) {
        tl.fromTo(layers[key], { scale: Z0[key] }, { scale: 1, ease: 'power3.inOut', duration: 3.3 }, 0);
      }
    });

    /* 3.9 → 6.9  panel rises; scene slides up with layered parallax */
    tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, ease: 'power2.inOut', duration: 3.0 }, 3.9);
    tl.to(scene, { yPercent: -34, scale: 1.15, ease: 'power2.inOut', duration: 3.0 }, 3.9);

    var PAR = { sky: -1.5, far: -3, mid: -6, water: -8, island: -12, air: -18, fg: -32 };
    Object.keys(PAR).forEach(function (key) {
      if (layers[key]) {
        tl.to(layers[key], { yPercent: PAR[key], ease: 'power2.inOut', duration: 3.0 }, 3.9);
      }
    });

    // Title lines reveal smoothly
    var line1Span = $('.drh__line--1 > span');
    var line2Span = $('.drh__line--2 > span');
    if (line1Span) {
      tl.fromTo(line1Span, { yPercent: 115 }, { yPercent: 0, ease: 'power3.out', duration: 1.7 }, 4.4);
    }
    if (line2Span) {
      tl.fromTo(line2Span, { yPercent: 115 }, { yPercent: 0, ease: 'power3.out', duration: 1.5 }, 4.8);
    }
    var metaEl = $('.drh__meta');
    if (metaEl) {
      tl.fromTo(metaEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 4.2);
    }

    /* 6.5 → 9.3  supporting copy + content travel */
    var ledeEl = $('.drh__lede');
    if (ledeEl) {
      tl.fromTo(ledeEl, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 1.1 }, 6.5);
    }
    if (words && words.length) {
      tl.fromTo(words, { yPercent: 115 }, { yPercent: 0, ease: 'power3.out', duration: 0.9, stagger: 0.05 }, 6.7);
    }
    var noteEl = $('.drh__note');
    if (noteEl) {
      tl.fromTo(noteEl, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.9 }, 7.9);
    }

    if (content && panel) {
      tl.to(content, {
        y: function () {
          return -Math.max(0, content.offsetHeight - panel.offsetHeight);
        },
        ease: 'power1.inOut',
        duration: 2.4
      }, 6.9);
    }

    tl.to({}, { duration: 0.001 }, 10);

    /* Entrance animation triggered seamlessly after loader lifts */
    function triggerEntrance() {
      var ordered = tiles.slice().sort(function (a, b) {
        return (a.cx * a.cx + a.cy * a.cy) - (b.cx * b.cx + b.cy * b.cy);
      });
      gsap.from(ordered.map(function (t) { return t.el; }), {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.016
      });
      gsap.from(scene, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    if (document.getElementById('drp')) {
      window.addEventListener('drp:reveal', triggerEntrance);
    } else {
      triggerEntrance();
    }

    function goDown() {
      var st = tl.scrollTrigger;
      if (st) {
        window.scrollTo({
          top: st.start + (st.end - st.start) * 0.35,
          behavior: 'smooth'
        });
      }
    }

    if (cta) {
      cta.addEventListener('click', goDown);
    }

    return function () {
      if (cta) cta.removeEventListener('click', goDown);
      mosaic.innerHTML = '';
    };
  });
})();
