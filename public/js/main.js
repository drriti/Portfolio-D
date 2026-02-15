/* ─────────────────────────────────
   GSAP ANIMATIONS
───────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

// ── Scroll transition: light → dark ──
gsap.to("body", {
    backgroundColor: "#0b0b0b",
    color: "#ffffff",
    scrollTrigger: {
        trigger: "#work",
        start: "top 70%",
        end: "top 25%",
        scrub: true
    }
});

// ── Scroll line grows ──
gsap.to(".scroll-indicator span", {
    height: "100%",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// ── Hero exits clearly ──
gsap.to(".hero-inner", {
    y: -80,
    opacity: 0,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// ── About enters clearly ──
gsap.fromTo("#about",
    { y: 80, opacity: 0 },
    {
        y: 0,
        opacity: 1,
        scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "top 55%",
            scrub: true
        }
    }
);

// ── About image animation ──
gsap.to(".about-image", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
    }
});

// ── About text animation (slightly delayed) ──
gsap.to(".about-content", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.15,
    scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
    }
});

// ── Work cards entrance ──
gsap.utils.toArray(".work").forEach((project) => {
    gsap.from(project, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: project,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

// ── Page background transition ──
gsap.to("#page-bg", {
    backgroundColor: "#0b0b0b",
    scrollTrigger: {
        trigger: "#work",
        start: "top 70%",
        end: "top 30%",
        scrub: true,
        invalidateOnRefresh: true
    }
});

// ── Cards animation ──
gsap.utils.toArray(".work-card").forEach(card => {
    gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.96 },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
            }
        }
    );
});

// ── Refresh ScrollTrigger on load ──
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});


/* ─────────────────────────────────
   CUSTOM PROJECT CURSOR
───────────────────────────────── */

const projectCursor = document.querySelector(".project-cursor");

if (projectCursor) {
    document.addEventListener("mousemove", (e) => {
        gsap.to(projectCursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    document.querySelectorAll(".work-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            gsap.to(projectCursor, {
                opacity: 1,
                scale: 1,
                duration: 0.3
            });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(projectCursor, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3
            });
        });

        /* 3D Tilt Effect */
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;

            card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "none";
        });
    });
}


/* ─────────────────────────────────
   STUDIO WALL (Drag + Click)
───────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

    const pins = document.querySelectorAll(".pin-item");
    const wall = document.querySelector(".wall");
    const viewer = document.querySelector(".wall-viewer");
    const content = document.querySelector(".viewer-content");

    if (!wall || !viewer || !content) return;

    // Track the highest z-index so the most recently dragged pin stays on top
    let topZ = 10;

    pins.forEach(pin => {

        let isDragging = false;
        let hasDragged = false;
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;

        /* ── POINTER DOWN ── */
        const onPointerDown = (e) => {
            if (e.button && e.button !== 0) return;

            isDragging = true;
            hasDragged = false;

            const point = e.touches ? e.touches[0] : e;

            startX = point.clientX;
            startY = point.clientY;

            const rect = pin.getBoundingClientRect();
            offsetX = point.clientX - rect.left;
            offsetY = point.clientY - rect.top;

            pin.classList.add("dragging");
            topZ += 1;
            pin.style.zIndex = topZ;

            e.preventDefault();
        };

        /* ── POINTER MOVE ── */
        const onPointerMove = (e) => {
            if (!isDragging) return;

            const point = e.touches ? e.touches[0] : e;

            const dx = point.clientX - startX;
            const dy = point.clientY - startY;

            if (!hasDragged && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
                hasDragged = true;
            }

            if (!hasDragged) return;

            const wallRect = wall.getBoundingClientRect();

            let newLeft = point.clientX - wallRect.left - offsetX;
            let newTop = point.clientY - wallRect.top - offsetY;

            newLeft = Math.max(-20, Math.min(newLeft, wallRect.width - pin.offsetWidth + 20));
            newTop = Math.max(-20, Math.min(newTop, wallRect.height - pin.offsetHeight + 20));

            pin.style.left = newLeft + "px";
            pin.style.top = newTop + "px";
        };

        /* ── POINTER UP ── */
        const onPointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            pin.classList.remove("dragging");
        };

        /* ── CLICK (only fires if NOT dragged) ── */
        pin.addEventListener("click", (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const type = pin.dataset.type;
            const src = pin.dataset.src;

            content.innerHTML = "";

            if (type === "video") {
                const video = document.createElement("video");
                video.src = src;
                video.controls = true;
                video.autoplay = true;
                content.appendChild(video);
            } else if (type === "flipbook") {
                const iframe = document.createElement("iframe");
                iframe.src = src;
                iframe.setAttribute("allowfullscreen", "");
                iframe.setAttribute("scrolling", "no");
                iframe.style.width = "80vw";
                iframe.style.height = "80vh";
                iframe.style.border = "none";
                iframe.style.borderRadius = "12px";
                content.appendChild(iframe);
            } else {
                const img = document.createElement("img");
                img.src = src;
                content.appendChild(img);
            }

            viewer.classList.add("active");
        });

        /* ── Bind events ── */
        pin.addEventListener("mousedown", onPointerDown);
        document.addEventListener("mousemove", onPointerMove);
        document.addEventListener("mouseup", onPointerUp);

        pin.addEventListener("touchstart", onPointerDown, { passive: false });
        document.addEventListener("touchmove", onPointerMove, { passive: false });
        document.addEventListener("touchend", onPointerUp);
    });

    /* ── Close viewer on click ── */
    viewer.addEventListener("click", () => {
        viewer.classList.remove("active");
        content.innerHTML = "";
    });

});
