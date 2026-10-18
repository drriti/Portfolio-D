/* =========================================================================
   DRRITI — PRELOADER SCRIPT (public/js/preloader.js)
   Fires "drp:reveal" when lifting and "drp:end" when finished
   ========================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var el = document.getElementById('drp');
  if (!el) return;
  if (!html.classList.contains('js')) {
    if (el.parentNode) el.parentNode.removeChild(el);
    return;
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN = reduce ? 500 : 2000;
  var GIVE_UP = 10000;

  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  html.classList.add('drp-active');

  var num = el.querySelector('.drp__num');
  var rule = el.querySelector('.drp__rule');

  var total = 0, done = 0;
  function track(start) {
    total++;
    var fired = false;
    start(function () { if (!fired) { fired = true; done++; } });
  }

  Array.prototype.forEach.call(document.images, function (im) {
    track(function (fin) {
      if (im.complete) fin();
      else {
        im.addEventListener('load', fin);
        im.addEventListener('error', fin);
      }
    });
  });

  (el.getAttribute('data-preload') || '').split(',').forEach(function (src) {
    src = src.trim();
    if (!src) return;
    track(function (fin) {
      var i = new Image();
      i.onload = i.onerror = fin;
      i.src = src;
    });
  });

  if (document.fonts && document.fonts.load) {
    ['200 100px "Lexend Zetta"', '300 20px "Lexend Zetta"', '300 12px "Martian Mono"'].forEach(function (f) {
      track(function (fin) { document.fonts.load(f).then(fin, fin); });
    });
  }

  var t0 = performance.now(), shown = 0, finishing = false;

  function paint() {
    if (num) num.textContent = Math.round(shown) + '%';
    if (rule) rule.style.setProperty('--p', shown.toFixed(2));
  }

  function frame(now) {
    var timeP = Math.min(1, (now - t0) / MIN);
    var loadP = (now - t0 > GIVE_UP || !total) ? 1 : done / total;
    var target = Math.min(timeP, loadP) * 100;
    shown += (target - shown) * 0.12;
    if (target >= 100 && shown > 99.4) shown = 100;
    paint();
    if (shown >= 100) return finish();
    requestAnimationFrame(frame);
  }

  function finish() {
    if (finishing) return;
    finishing = true;

    setTimeout(function () {
      el.classList.add('drp--done');
      setTimeout(function () {
        el.classList.add('drp--leave');
        setTimeout(function () {
          window.dispatchEvent(new Event('drp:reveal'));
        }, reduce ? 0 : 300);

        var gone = false;
        function remove() {
          if (gone) return;
          gone = true;
          if (el.parentNode) el.parentNode.removeChild(el);
          html.classList.remove('drp-active');
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event('drp:end'));
        }

        el.addEventListener('transitionend', function (e) {
          if (e.target === el) remove();
        });
        setTimeout(remove, reduce ? 600 : 1300);
      }, reduce ? 0 : 550);
    }, reduce ? 0 : 250);
  }

  paint();
  requestAnimationFrame(frame);
})();
