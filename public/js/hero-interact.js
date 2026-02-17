/* ─────────────────────────────────
   HERO CURSOR GRADIENT GLOW
   Soft warm light follows cursor
───────────────────────────────── */

(function () {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const hero = canvas.closest(".hero");

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // no effect on mobile

    /* ── Config ── */
    const GLOW_RADIUS = 350;          // size of the glow
    const LERP_SPEED = 0.08;          // smoothing (lower = more lag, smoother)

    /* ── State ── */
    let mouse = { x: -9999, y: -9999 };
    let glow = { x: -9999, y: -9999 };
    let isInHero = false;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let rafId = null;

    /* ── Resize (HiDPI) ── */
    function resize() {
        const rect = hero.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ── Mouse tracking ── */
    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        isInHero = true;
        targetOpacity = 1;
    });

    hero.addEventListener("mouseleave", () => {
        isInHero = false;
        targetOpacity = 0;
    });

    /* ── Draw loop ── */
    function draw() {
        const rect = hero.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Smooth position interpolation
        glow.x += (mouse.x - glow.x) * LERP_SPEED;
        glow.y += (mouse.y - glow.y) * LERP_SPEED;

        // Smooth opacity fade in/out
        currentOpacity += (targetOpacity - currentOpacity) * 0.06;

        if (currentOpacity > 0.005) {
            // Main warm glow
            const grad1 = ctx.createRadialGradient(
                glow.x, glow.y, 0,
                glow.x, glow.y, GLOW_RADIUS
            );
            grad1.addColorStop(0, `rgba(139, 47, 47, ${0.14 * currentOpacity})`);
            grad1.addColorStop(0.3, `rgba(139, 47, 47, ${0.08 * currentOpacity})`);
            grad1.addColorStop(0.6, `rgba(160, 60, 50, ${0.03 * currentOpacity})`);
            grad1.addColorStop(1, "rgba(139, 47, 47, 0)");

            ctx.fillStyle = grad1;
            ctx.beginPath();
            ctx.arc(glow.x, glow.y, GLOW_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core (smaller, warmer)
            const grad2 = ctx.createRadialGradient(
                glow.x, glow.y, 0,
                glow.x, glow.y, GLOW_RADIUS * 0.35
            );
            grad2.addColorStop(0, `rgba(200, 80, 60, ${0.10 * currentOpacity})`);
            grad2.addColorStop(0.5, `rgba(170, 55, 45, ${0.04 * currentOpacity})`);
            grad2.addColorStop(1, "rgba(139, 47, 47, 0)");

            ctx.fillStyle = grad2;
            ctx.beginPath();
            ctx.arc(glow.x, glow.y, GLOW_RADIUS * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = requestAnimationFrame(draw);
    }

    /* ── Init ── */
    function init() {
        resize();
        draw();
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(rafId);
    });

})();
