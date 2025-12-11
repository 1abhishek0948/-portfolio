document.addEventListener('DOMContentLoaded', function () {

    // --- Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 1000, // values from 0 to 3000, with step 50ms
        once: false,     // whether animation should happen only once - while scrolling down
    });

    // --- Initialize Typed.js ---
    const options = {
        strings: ['Creative Developer.', 'Full-Stack Web Developer.', 'Machine Learning Engineer.'],
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 1500,
        loop: true
    };
    const typed = new Typed('#typed-element', options);

    // --- Initialize Particles.js ---
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5,
                "random": true
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "bottom",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Add hover effects for the cursor ---
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = '#F72585'; // Use secondary accent on hover
        });
        link.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = '#00F5FF'; // Revert to primary
        });
    });

    

});

document.addEventListener("DOMContentLoaded", () => {
  const floating = document.querySelector(".floating-image");
  let offsetX, offsetY, isDragging = false;
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // --- Drag functionality ---
  floating.addEventListener("mousedown", (e) => {
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
    if (!isDragging) return;
    e.preventDefault();
    floating.style.left = `${e.clientX - offsetX}px`;
    floating.style.top = `${e.clientY - offsetY}px`;
    floating.style.transform = "none"; // disable centering transform after drag
  });

  // --- Hide on scroll up / Show on scroll down ---
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      // Scrolling up → hide image
      floating.classList.add("hidden");
    } else {
      // Scrolling down → show image
      floating.classList.add("hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
});

// --- PPT Modal Logic ---
 document.getElementById("ppt_button").addEventListener("click", function(e) {
    e.preventDefault();

    const text = document.getElementById("project_text");
    const pptBox = document.getElementById("ppt_container");
    const pptURL = "https://drive.google.com/file/d/1lDcpy76Qt5UEwgnUsi-PBXUJubRqaJg_/preview";

    if (pptBox.style.display === "block") {
        // Hide PPT → show text
        pptBox.style.display = "none";
        text.style.display = "block";
        this.textContent = "View PPT";
    } else {
        // Hide text → show PPT
        text.style.display = "none";
        pptBox.style.display = "block";
        pptBox.querySelector("#ppt_frame").src = pptURL; // Load PPT
        this.textContent = "Close ";

        // Smooth scroll to PPT
        pptBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});
