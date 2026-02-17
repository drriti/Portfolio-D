/* ═══════════════════════════════════════════
   MRITTIKA — CLAY & CRAFT INTERACTIONS
   GSAP + ScrollTrigger — Editorial Magazine
═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────
       1. HERO ENTRANCE — Asymmetric Split
    ───────────────────────────────── */
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTL
        .to(".mk-hero-chapter", {
            opacity: 1, y: 0, duration: 0.7, delay: 0.3
        })
        .to(".mk-hero-title", {
            opacity: 1, y: 0, duration: 1.2
        }, "-=0.4")
        .to(".mk-hero-subtitle", {
            opacity: 1, y: 0, duration: 0.8
        }, "-=0.7")
        .to(".mk-hero-meta-row", {
            opacity: 1, y: 0, duration: 0.7
        }, "-=0.5")
        .to(".mk-hero-image-wrap", {
            opacity: 1, scale: 1, duration: 1.6, ease: "power2.out"
        }, "-=1.2")
        .to(".mk-scroll-cue", {
            opacity: 1, duration: 0.5
        }, "-=0.3");


    /* ─────────────────────────────────
       2. SCROLL PROGRESS BAR
    ───────────────────────────────── */
    const progressBar = document.querySelector(".mk-progress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }


    /* ─────────────────────────────────
       3. SCROLL REVEAL SYSTEM
    ───────────────────────────────── */
    document.querySelectorAll(".mk-reveal").forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => el.classList.add("revealed")
        });
    });


    /* ─────────────────────────────────
       4. MANIFESTO QUOTE REVEAL
    ───────────────────────────────── */
    const manifQuote = document.querySelector(".mk-manifesto-quote");
    const manifAttr = document.querySelector(".mk-manifesto-attr");

    if (manifQuote) {
        gsap.to(manifQuote, {
            opacity: 1, y: 0, duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: manifQuote, start: "top 80%", once: true }
        });
    }

    if (manifAttr) {
        gsap.to(manifAttr, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.3,
            ease: "power3.out",
            scrollTrigger: { trigger: manifAttr, start: "top 85%", once: true }
        });
    }


    /* ─────────────────────────────────
       5. CHAPTER HEADERS
    ───────────────────────────────── */
    document.querySelectorAll(".mk-chapter-header").forEach(header => {
        gsap.to(header, {
            opacity: 1, y: 0, duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: header, start: "top 85%", once: true }
        });
    });


    /* ─────────────────────────────────
       6. CHAPTER DESCRIPTIONS
    ───────────────────────────────── */
    document.querySelectorAll(".mk-chapter-desc").forEach(desc => {
        gsap.to(desc, {
            opacity: 1, y: 0, duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: desc, start: "top 85%", once: true }
        });
    });


    /* ─────────────────────────────────
       7. VALUE ITEMS — Staggered
    ───────────────────────────────── */
    gsap.utils.toArray(".mk-value-item").forEach((item, i) => {
        gsap.to(item, {
            opacity: 1, y: 0, duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true }
        });
    });


    /* ─────────────────────────────────
       8. PROCESS CARDS — Staggered
    ───────────────────────────────── */
    gsap.utils.toArray(".mk-process-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true }
        });
    });


    /* ─────────────────────────────────
       9. SPLIT SECTIONS — Left/Right Reveal
    ───────────────────────────────── */
    document.querySelectorAll(".mk-split").forEach(section => {
        const text = section.querySelector(".mk-split-text");
        const visual = section.querySelector(".mk-split-visual");

        if (text) {
            gsap.to(text, {
                opacity: 1, x: 0, duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true }
            });
        }

        if (visual) {
            gsap.to(visual, {
                opacity: 1, x: 0, duration: 1, delay: 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true }
            });
        }
    });


    /* ─────────────────────────────────
       10. MASONRY ITEMS — Staggered
    ───────────────────────────────── */
    gsap.utils.toArray(".mk-masonry-item").forEach((item, i) => {
        gsap.to(item, {
            opacity: 1, y: 0, duration: 0.9,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true }
        });
    });


    /* ─────────────────────────────────
       11. FULL BLEED IMAGES — Reveal
    ───────────────────────────────── */
    document.querySelectorAll(".mk-fullbleed img").forEach(img => {
        gsap.to(img, {
            opacity: 1, y: 0, duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: img, start: "top 85%", once: true }
        });
    });


    /* ─────────────────────────────────
       12. HORIZONTAL SCROLL — Auto-scroll via CSS
           (Pause on hover handled by CSS)
    ───────────────────────────────── */


    /* ─────────────────────────────────
       13. HERO PARALLAX
    ───────────────────────────────── */
    gsap.to(".mk-hero-left", {
        y: -50,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
            trigger: ".mk-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".mk-hero-image-wrap img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
            trigger: ".mk-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });


    /* ─────────────────────────────────
       14. IMAGE LIGHTBOX
    ───────────────────────────────── */
    const lightbox = document.querySelector(".mk-lightbox");
    const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".mk-lightbox-close") : null;

    if (lightbox && lightboxImg) {
        document.querySelectorAll(".mk-masonry-item img, .mk-split-visual img, .mk-hscroll-item img").forEach(img => {
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
       15. REFRESH ScrollTrigger
    ───────────────────────────────── */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});
