document.addEventListener("DOMContentLoaded", () => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep footer year current automatically.
    const currentYear = document.getElementById("current-year");
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

    // --- Initialize AOS (Animate On Scroll) ---
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: prefersReducedMotion ? 0 : 800,
            once: false,
            mirror: true,
            disable: prefersReducedMotion
        });
    }

    // --- Initialize Typed.js ---
    const typedStrings = ["Creative Developer.", "Full-Stack Web Developer.", "Machine Learning Engineer."];
    const typedElement = document.getElementById("typed-element");
    if (!prefersReducedMotion && typedElement && typeof Typed !== "undefined") {
        new Typed("#typed-element", {
            strings: typedStrings,
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 1500,
            loop: true
        });
    } else if (typedElement) {
        typedElement.textContent = typedStrings[1];
    }

    // --- Initialize Particles.js ---
    if (!prefersReducedMotion && typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: {
                    value: 55,
                    density: {
                        enable: true,
                        value_area: 900
                    }
                },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: {
                    value: 0.45,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: { enable: false },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "bottom",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: isFinePointer,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: isFinePointer,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    } else {
        const particlesLayer = document.getElementById("particles-js");
        if (particlesLayer) {
            particlesLayer.style.display = "none";
        }
    }

    // --- Floating image logic ---
    const floating = document.querySelector(".floating-image");
    if (floating) {
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        const initialScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (initialScroll > 0 || !isFinePointer) {
            floating.classList.add("hidden");
        }

        floating.addEventListener("mousedown", (e) => {
            if (!isFinePointer) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - floating.getBoundingClientRect().left;
            offsetY = e.clientY - floating.getBoundingClientRect().top;
            floating.style.cursor = "grabbing";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            floating.style.cursor = "grab";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) {
                return;
            }

            e.preventDefault();
            floating.style.left = `${e.clientX - offsetX}px`;
            floating.style.top = `${e.clientY - offsetY}px`;
            floating.style.transform = "none";
        });

        window.addEventListener("scroll", () => {
            floating.classList.add("hidden");
        }, { passive: true });
    }

    // --- Reusable project card slider ---
    class ProjectCardSlider {
        constructor(cardElement, reduceMotion) {
            this.cardElement = cardElement;
            this.viewport = cardElement.querySelector(".project-slider");
            this.track = cardElement.querySelector(".project-slider-track");
            this.slides = Array.from(cardElement.querySelectorAll(".project-slide"));
            this.dotsContainer = cardElement.querySelector(".project-slider-dots");
            this.nextButton = cardElement.querySelector(".project-next-btn");
            this.dots = [];
            this.index = 0;
            this.swipeStartX = 0;
            this.swipeStartY = 0;
            this.swipeActive = false;

            if (!this.viewport || !this.track || this.slides.length < 2) {
                return;
            }

            if (reduceMotion) {
                this.track.style.transitionDuration = "0ms";
            }

            this.setupNextButton();
            this.setupDots();
            this.bindSwipeEvents();

            this.cardElement.setAttribute("tabindex", "0");
            this.cardElement.addEventListener("keydown", (event) => {
                if (event.key === "ArrowLeft") {
                    this.goTo(this.index - 1);
                }
                if (event.key === "ArrowRight") {
                    this.goTo(this.index + 1);
                }
            });

            this.update();
        }

        setupNextButton() {
            if (!this.nextButton) {
                this.nextButton = document.createElement("button");
                this.nextButton.type = "button";
                this.nextButton.className = "project-next-btn";
                this.viewport.appendChild(this.nextButton);
            }
            this.nextButton.setAttribute("aria-label", "Next slide");
            this.nextButton.innerHTML = '<i class="ph ph-arrow-fat-lines-right" aria-hidden="true"></i>';

            this.nextButton.addEventListener("click", () => {
                this.goTo(this.index + 1);
            });
        }

        setupDots() {
            if (!this.dotsContainer) {
                this.dotsContainer = document.createElement("div");
                this.dotsContainer.className = "project-slider-dots";
                this.dotsContainer.setAttribute("aria-label", "Slide indicators");
                this.viewport.insertAdjacentElement("afterend", this.dotsContainer);
            }

            this.dotsContainer.innerHTML = "";
            this.dots = this.slides.map((_, slideIndex) => {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "project-slider-dot";
                dot.setAttribute("aria-label", `Go to slide ${slideIndex + 1}`);
                dot.addEventListener("click", () => {
                    this.goTo(slideIndex);
                });
                this.dotsContainer.appendChild(dot);
                return dot;
            });
        }

        bindSwipeEvents() {
            const startSwipe = (x, y) => {
                this.swipeStartX = x;
                this.swipeStartY = y;
                this.swipeActive = true;
            };

            const finishSwipe = (x, y) => {
                if (!this.swipeActive) {
                    return;
                }

                this.swipeActive = false;
                const deltaX = x - this.swipeStartX;
                const deltaY = y - this.swipeStartY;
                const horizontalDistance = Math.abs(deltaX);
                const verticalDistance = Math.abs(deltaY);

                if (horizontalDistance < 45 || horizontalDistance <= verticalDistance) {
                    return;
                }

                if (deltaX < 0) {
                    this.goTo(this.index + 1);
                    return;
                }

                this.goTo(this.index - 1);
            };

            this.viewport.addEventListener("touchstart", (event) => {
                const touch = event.changedTouches[0];
                if (!touch) {
                    return;
                }

                startSwipe(touch.clientX, touch.clientY);
            }, { passive: true });

            this.viewport.addEventListener("touchend", (event) => {
                const touch = event.changedTouches[0];
                if (!touch) {
                    return;
                }

                finishSwipe(touch.clientX, touch.clientY);
            }, { passive: true });

            this.viewport.addEventListener("mousedown", (event) => {
                startSwipe(event.clientX, event.clientY);
            });

            this.viewport.addEventListener("mouseup", (event) => {
                finishSwipe(event.clientX, event.clientY);
            });

            this.viewport.addEventListener("mouseleave", () => {
                this.swipeActive = false;
            });
        }

        goTo(nextIndex) {
            const totalSlides = this.slides.length;
            this.index = (nextIndex + totalSlides) % totalSlides;
            this.update();
        }

        update() {
            this.track.style.transform = `translateX(-${this.index * 100}%)`;
            this.slides.forEach((slide, slideIndex) => {
                slide.setAttribute("aria-hidden", slideIndex === this.index ? "false" : "true");
            });
            this.dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === this.index;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }
    }

    document.querySelectorAll("[data-project-slider]").forEach((cardElement) => {
        new ProjectCardSlider(cardElement, prefersReducedMotion);
    });

    // --- Dream project PPT toggle ---
    const pptButton = document.getElementById("ppt_button");
    if (pptButton) {
        pptButton.addEventListener("click", () => {
            const projectText = document.getElementById("project_text");
            const pptContainer = document.getElementById("ppt_container");
            const pptFrame = document.getElementById("ppt_frame");
            const pptUrl = "https://drive.google.com/file/d/1lDcpy76Qt5UEwgnUsi-PBXUJubRqaJg_/preview";

            if (!projectText || !pptContainer || !pptFrame) {
                return;
            }

            const isOpen = pptContainer.style.display === "block";
            if (isOpen) {
                pptContainer.style.display = "none";
                pptFrame.src = "";
                projectText.style.display = "block";
                pptButton.textContent = "View PPT";
                pptButton.setAttribute("aria-expanded", "false");
                return;
            }

            projectText.style.display = "none";
            pptContainer.style.display = "block";
            pptFrame.src = pptUrl;
            pptButton.textContent = "Close PPT";
            pptButton.setAttribute("aria-expanded", "true");
            pptContainer.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "center"
            });
        });
    }
});
