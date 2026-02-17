/* ═══════════════════════════════════════════
   UNIPATH — INTERACTIVE CASE STUDY JS
   GSAP + ScrollTrigger powered
═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────
       1. HERO ENTRANCE SEQUENCE
    ───────────────────────────────── */
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTL
        .to(".up-hero-tag", {
            opacity: 1, y: 0, duration: 0.8, delay: 0.3
        })
        .to(".up-hero-title", {
            opacity: 1, y: 0, duration: 1
        }, "-=0.5")
        .to(".up-hero-subtitle", {
            opacity: 1, y: 0, duration: 0.8
        }, "-=0.6")
        .to(".up-hero-meta", {
            opacity: 1, y: 0, duration: 0.8
        }, "-=0.5")
        .to(".up-scroll-cue", {
            opacity: 1, duration: 0.6
        }, "-=0.3");


    /* ─────────────────────────────────
       2. SCROLL PROGRESS BAR
    ───────────────────────────────── */
    const progressBar = document.querySelector(".up-progress");
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
    const revealElements = document.querySelectorAll(
        ".up-reveal, .up-reveal-left, .up-reveal-right, .up-reveal-scale, .up-stagger"
    );

    revealElements.forEach((el, i) => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
                el.classList.add("revealed");
            }
        });
    });


    /* ─────────────────────────────────
       4. GALLERY ITEMS — Staggered entrance
    ───────────────────────────────── */
    const galleryItems = document.querySelectorAll(".up-gallery-item");

    galleryItems.forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       5. SHOWCASE IMAGES — Parallax
    ───────────────────────────────── */
    const showcaseImages = document.querySelectorAll(".up-showcase-img");

    showcaseImages.forEach(img => {
        gsap.to(img, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: img,
                start: "top 85%",
                once: true
            }
        });
    });

    // Parallax on featured images
    document.querySelectorAll(".up-featured img").forEach(img => {
        gsap.to(img, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });
    });


    /* ─────────────────────────────────
       6. OVERVIEW CARDS
    ───────────────────────────────── */
    gsap.utils.toArray(".up-overview-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       7. PROCESS TIMELINE STEPS
    ───────────────────────────────── */
    gsap.utils.toArray(".up-process-step").forEach((step, i) => {
        gsap.to(step, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: step,
                start: "top 85%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       8. DEEP DIVE SECTIONS
    ───────────────────────────────── */
    gsap.utils.toArray(".up-deep").forEach(section => {
        const text = section.querySelector(".up-deep-text");
        const visual = section.querySelector(".up-deep-visual");

        if (text) {
            gsap.to(text, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    once: true
                }
            });
        }

        if (visual) {
            gsap.to(visual, {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    once: true
                }
            });
        }
    });


    /* ─────────────────────────────────
       9. STATS — Counter Animation
    ───────────────────────────────── */
    const statNumbers = document.querySelectorAll(".up-stat-number");

    statNumbers.forEach(num => {
        const target = num.getAttribute("data-value");
        const suffix = num.getAttribute("data-suffix") || "";
        const isNumber = !isNaN(parseInt(target));

        ScrollTrigger.create({
            trigger: num.closest(".up-stat"),
            start: "top 85%",
            once: true,
            onEnter: () => {
                // Animate parent stat card
                gsap.to(num.closest(".up-stat"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out"
                });

                if (isNumber) {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: parseInt(target),
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            num.textContent = Math.round(obj.val) + suffix;
                        }
                    });
                } else {
                    num.textContent = target + suffix;
                }
            }
        });
    });


    /* ─────────────────────────────────
       10. IMAGE LIGHTBOX
    ───────────────────────────────── */
    const lightbox = document.querySelector(".up-lightbox");
    const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".up-lightbox-close") : null;

    if (lightbox && lightboxImg) {
        // Open
        document.querySelectorAll(".up-gallery-item img, .up-deep-visual img").forEach(img => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        // Close
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
       11. HERO PARALLAX (subtle)
    ───────────────────────────────── */
    gsap.to(".up-hero-content", {
        y: -60,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
            trigger: ".up-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".up-hero-grid", {
        y: 40,
        ease: "none",
        scrollTrigger: {
            trigger: ".up-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });


    /* ─────────────────────────────────
       12. REFRESH ScrollTrigger
    ───────────────────────────────── */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});
