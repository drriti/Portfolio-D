/* ═══════════════════════════════════════════
   RIYASAT — FULL-BLEED LOOKBOOK
   Clean, image-dominant interactions.
   GSAP + ScrollTrigger
═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────
       1. HERO ENTRANCE
    ───────────────────────────────── */
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTL
        .to(".ry-hero-eyebrow", {
            opacity: 1, y: 0, duration: 0.7, delay: 0.3
        })
        .to(".ry-hero-title", {
            opacity: 1, y: 0, duration: 1.4
        }, "-=0.4")
        .to(".ry-hero-tagline", {
            opacity: 1, y: 0, duration: 0.8
        }, "-=0.8")
        .to(".ry-hero-details", {
            opacity: 1, y: 0, duration: 0.7
        }, "-=0.5")
        .to(".ry-hero-scroll", {
            opacity: 1, duration: 0.5
        }, "-=0.3");


    /* ─────────────────────────────────
       2. SCROLL PROGRESS BAR
    ───────────────────────────────── */
    const progressBar = document.querySelector(".ry-progress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }


    /* ─────────────────────────────────
       3. SCROLL REVEAL — Generic
    ───────────────────────────────── */
    document.querySelectorAll(".ry-reveal").forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => el.classList.add("revealed")
        });
    });


    /* ─────────────────────────────────
       4. BOOK PAGES — Image Reveal
       Each image fades in as it enters
       the viewport. Simple and clean.
    ───────────────────────────────── */
    document.querySelectorAll(".ry-page img").forEach(img => {
        ScrollTrigger.create({
            trigger: img,
            start: "top 90%",
            once: true,
            onEnter: () => img.classList.add("revealed")
        });
    });


    /* ─────────────────────────────────
       5. TEXT INTERLUDES — Reveal
    ───────────────────────────────── */
    document.querySelectorAll(".ry-interlude-inner").forEach(inner => {
        gsap.to(inner, {
            opacity: 1, y: 0, duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: inner, start: "top 80%", once: true }
        });
    });


    /* ─────────────────────────────────
       6. HERO PARALLAX — Subtle
    ───────────────────────────────── */
    gsap.to(".ry-hero-content", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".ry-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });


    /* ─────────────────────────────────
       7. IMAGE LIGHTBOX
    ───────────────────────────────── */
    const lightbox = document.querySelector(".ry-lightbox");
    const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".ry-lightbox-close") : null;

    if (lightbox && lightboxImg) {
        document.querySelectorAll(".ry-page img").forEach(img => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
        };

        lightbox.addEventListener("click", closeLightbox);
        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }


    /* ─────────────────────────────────
       8. REFRESH
    ───────────────────────────────── */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});
