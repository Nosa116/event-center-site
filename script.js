document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = hamburger.querySelectorAll('span');
            // Simple toggle logic for visual feedback could go here
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
        }
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Infinite Carousel
    const track = document.querySelector('.amenities-track');
    const slider = document.querySelector('.amenities-slider-wrapper');

    if (track && slider) {
        let isTransitioning = false;

        const slideNext = () => {
            if (isTransitioning) return;
            isTransitioning = true;

            const card = document.querySelector('.amenity-card');
            if (!card) return;

            // Calculate move distance (card width + gap)
            // We use computed style for gap to be robust
            const gap = 30; // Defined in CSS
            const cardWidth = card.offsetWidth;
            const moveAmount = cardWidth + gap;

            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${moveAmount}px)`;

            track.addEventListener('transitionend', () => {
                // Remove transition to instantly jump
                track.style.transition = 'none';

                // Move first item to end
                track.appendChild(track.firstElementChild);

                // Reset transform
                track.style.transform = 'translateX(0)';

                // Small delay to ensure browser paints
                setTimeout(() => {
                    isTransitioning = false;
                }, 0);
            }, { once: true });
        };

        // Auto slide loop
        let slideInterval = setInterval(slideNext, 3000);

        // Pause on interaction
        const pauseSlide = () => clearInterval(slideInterval);
        const resumeSlide = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(slideNext, 3000);
        };

        slider.addEventListener('mouseenter', pauseSlide);
        slider.addEventListener('mouseleave', resumeSlide);
        slider.addEventListener('touchstart', pauseSlide);
        slider.addEventListener('touchend', resumeSlide);
    }
});
