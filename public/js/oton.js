/* ═══════════════════════════════════════════
   OTON — EDITORIAL MAGAZINE INTERACTIONS
   Cinematic reveals, horizontal scroll, custom cursor
   GSAP + ScrollTrigger powered
═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────
       1. CUSTOM CURSOR
    ───────────────────────────────── */
    const cursor = document.querySelector(".ot-cursor");
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });
        });

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll(
            "a, button, .ot-hscroll-item, .ot-spread-image, .ot-split-visual, .ot-philosophy-card, .ot-process-block"
        );
        hoverTargets.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
        });
    } else if (cursor) {
        cursor.style.display = "none";
    }


    /* ─────────────────────────────────
       2. HERO ENTRANCE — Dramatic sequence
    ───────────────────────────────── */
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTL
        .to(".ot-hero-side-label", {
            opacity: 0.4, duration: 1.2, stagger: 0.2
        })
        .to(".ot-hero-tag", {
            opacity: 1, y: 0, duration: 0.9, delay: 0.2
        }, 0)
        .to(".ot-hero-title", {
            opacity: 1, y: 0, duration: 1.4
        }, 0.3)
        .to(".ot-hero-subtitle", {
            opacity: 1, y: 0, duration: 1
        }, 0.6)
        .to(".ot-hero-meta", {
            opacity: 1, y: 0, duration: 0.9
        }, 0.8)
        .to(".ot-scroll-cue", {
            opacity: 1, duration: 0.8
        }, 1);


    /* ─────────────────────────────────
       3. SCROLL PROGRESS BAR
    ───────────────────────────────── */
    const progressBar = document.querySelector(".ot-progress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }


    /* ─────────────────────────────────
       4. HERO PARALLAX — Cinematic depth
    ───────────────────────────────── */
    gsap.to(".ot-hero-content", {
        y: -80,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
            trigger: ".ot-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }
    });

    gsap.to(".ot-hero-grid", {
        y: 60,
        ease: "none",
        scrollTrigger: {
            trigger: ".ot-hero",
            start: "top top",
            end: "bottom top",
            scrub: 2
        }
    });

    gsap.to(".ot-hero-side-label.left", {
        y: -40,
        ease: "none",
        scrollTrigger: {
            trigger: ".ot-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".ot-hero-side-label.right", {
        y: 40,
        ease: "none",
        scrollTrigger: {
            trigger: ".ot-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });


    /* ─────────────────────────────────
       5. CINEMATIC IMAGE — Parallax & zoom
    ───────────────────────────────── */
    document.querySelectorAll(".ot-cinematic img").forEach(img => {
        gsap.fromTo(img, {
            scale: 1.08
        }, {
            scale: 1,
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
       6. EDITORIAL HEADERS
    ───────────────────────────────── */
    gsap.utils.toArray(".ot-editorial-header").forEach(header => {
        gsap.to(header, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: header,
                start: "top 82%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       7. PHILOSOPHY CARDS — Staggered entrance
    ───────────────────────────────── */
    gsap.utils.toArray(".ot-philosophy-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       8. SPLIT SECTIONS — Opposing slide
    ───────────────────────────────── */
    gsap.utils.toArray(".ot-split").forEach(split => {
        const text = split.querySelector(".ot-split-text");
        const visual = split.querySelector(".ot-split-visual");

        if (text) {
            gsap.to(text, {
                opacity: 1,
                x: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: split,
                    start: "top 70%",
                    once: true
                }
            });
        }

        if (visual) {
            gsap.to(visual, {
                opacity: 1,
                x: 0,
                duration: 1.2,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: split,
                    start: "top 70%",
                    once: true
                }
            });
        }
    });


    /* ─────────────────────────────────
       9. PROCESS BLOCKS — Staggered reveal
    ───────────────────────────────── */
    gsap.utils.toArray(".ot-process-block").forEach((block, i) => {
        gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: block,
                start: "top 88%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       10. HORIZONTAL SCROLL — Drag to explore
    ───────────────────────────────── */
    const hscroll = document.getElementById("oton-hscroll");
    if (hscroll) {
        let isDown = false;
        let startX, scrollLeft;

        hscroll.addEventListener("mousedown", (e) => {
            isDown = true;
            hscroll.style.cursor = "grabbing";
            startX = e.pageX - hscroll.offsetLeft;
            scrollLeft = hscroll.scrollLeft;
        });

        hscroll.addEventListener("mouseleave", () => {
            isDown = false;
            hscroll.style.cursor = "grab";
        });

        hscroll.addEventListener("mouseup", () => {
            isDown = false;
            hscroll.style.cursor = "grab";
        });

        hscroll.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - hscroll.offsetLeft;
            const walk = (x - startX) * 2;
            hscroll.scrollLeft = scrollLeft - walk;
        });
    }


    /* ─────────────────────────────────
       11. MAGAZINE SPREADS — Reveal
    ───────────────────────────────── */
    gsap.utils.toArray(".ot-spread").forEach(spread => {
        const image = spread.querySelector(".ot-spread-image");
        const content = spread.querySelector(".ot-spread-content");

        if (image) {
            gsap.to(image, {
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: spread,
                    start: "top 75%",
                    once: true
                }
            });
        }

        if (content) {
            gsap.to(content, {
                opacity: 1,
                x: 0,
                duration: 1.2,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: spread,
                    start: "top 75%",
                    once: true
                }
            });
        }
    });


    /* ─────────────────────────────────
       12. SHOWCASE IMAGE — Scale reveal
    ───────────────────────────────── */
    document.querySelectorAll(".ot-showcase-full img").forEach(img => {
        gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: img,
                start: "top 85%",
                once: true
            }
        });
    });


    /* ─────────────────────────────────
       13. METRICS — Counter Animation
    ───────────────────────────────── */
    const metricNumbers = document.querySelectorAll(".ot-metric-number");

    metricNumbers.forEach(num => {
        const target = num.getAttribute("data-value");
        const suffix = num.getAttribute("data-suffix") || "";
        const isNumber = !isNaN(parseInt(target));

        ScrollTrigger.create({
            trigger: num.closest(".ot-metric"),
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(num.closest(".ot-metric"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

                if (isNumber) {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: parseInt(target),
                        duration: 2,
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
       14. SCROLL REVEAL SYSTEM
    ───────────────────────────────── */
    const revealElements = document.querySelectorAll(".ot-reveal");

    revealElements.forEach((el) => {
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
       15. IMAGE LIGHTBOX
    ───────────────────────────────── */
    const lightbox = document.querySelector(".ot-lightbox");
    const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".ot-lightbox-close") : null;

    if (lightbox && lightboxImg) {
        const clickableImages = document.querySelectorAll(
            ".ot-hscroll-item img, .ot-spread-image img, .ot-split-visual img, .ot-cinematic img"
        );

        clickableImages.forEach(img => {
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
       16. MARQUEE — Speed variation on scroll
    ───────────────────────────────── */
    const marquees = document.querySelectorAll(".ot-marquee-track");
    let scrollSpeed = 1;

    window.addEventListener("scroll", () => {
        scrollSpeed = 1 + Math.abs(window.scrollY * 0.001);
        marquees.forEach(track => {
            track.style.animationDuration = Math.max(10, 25 / scrollSpeed) + "s";
        });
    });


    /* ─────────────────────────────────
       17. REFRESH ScrollTrigger on load
    ───────────────────────────────── */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});
