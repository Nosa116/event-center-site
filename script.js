document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }


    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Dropdown Toggle
    const dropdownLink = document.querySelector('.dropdown-link');
    const dropdown = document.querySelector('.dropdown');
    if (dropdownLink && window.innerWidth <= 768) {
        dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's the about section or contains counters, start them
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const animate = () => {
                            const target = +counter.getAttribute('data-target');
                            const currentText = counter.innerText.replace(/,/g, '');
                            const count = isNaN(+currentText) ? 0 : +currentText;
                            const speed = 200;
                            const inc = target / speed;

                            if (count < target) {
                                const newValue = Math.ceil(count + inc);
                                counter.innerText = newValue.toLocaleString();
                                setTimeout(animate, 1);
                            } else {
                                counter.innerText = target.toLocaleString();
                            }
                        };
                        animate();
                    });
                }
            } else {
                // Remove visible class when out of view to allow re-triggering
                entry.target.classList.remove('visible');
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

    // Custom Sleek Smooth Scroll Enhancement
    // This allows for a more "premium" feel on wheel/touch interaction
    const initSmoothScroll = () => {
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let isAnimating = false;

        const lerp = (start, end, multiplier) => {
            return start + (end - start) * multiplier;
        };

        const updateScroll = () => {
            currentScroll = lerp(currentScroll, targetScroll, 0.075); // Adjust for "sleekness"
            window.scrollTo(0, currentScroll);

            if (Math.abs(currentScroll - targetScroll) > 0.5) {
                requestAnimationFrame(updateScroll);
            } else {
                isAnimating = false;
            }
        };

        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetScroll += e.deltaY;
            targetScroll = Math.max(0, Math.min(targetScroll, document.documentElement.scrollHeight - window.innerHeight));

            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(updateScroll);
            }
        }, { passive: false });
    };

    // Uncomment the line below to enable custom "inertia" scrolling
    // NOTE: This can sometimes conflict with browser defaults if not tuned carefully.
    initSmoothScroll();
});
