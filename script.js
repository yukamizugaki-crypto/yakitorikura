// ====================================
// やきとり蔵 - Main JavaScript
// ====================================

document.addEventListener('DOMContentLoaded', function () {

    // ====================================
    // Hamburger Menu Toggle
    // ====================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    overlay.addEventListener('click', closeMenu);

    // Close menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ====================================
    // Header Scroll Handling (Always Fixed + Logo Fade-in)
    // ====================================
    const header = document.getElementById('header');
    const headerLogo = document.getElementById('header-logo-link');
    let ticking = false;

    function updateHeaderScroll() {
        const currentScrollY = window.scrollY;

        // Toggle top-left logo visibility based on scroll position (past 150px)
        if (currentScrollY > 150) {
            headerLogo.classList.add('visible');
        } else {
            headerLogo.classList.remove('visible');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderScroll);
            ticking = true;
        }
    });

    // Run once at start to check initial position
    updateHeaderScroll();

    // ====================================
    // IntersectionObserver for Fade-in Animation
    // ====================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple items in the same container view
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ====================================
    // Smooth Scroll for Navigation Links
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // Scroll Indicator Click
    // ====================================
    const scrollIndicator = document.getElementById('scroll-btn');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const conceptSection = document.getElementById('concept');
            if (conceptSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = conceptSection.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ====================================
    // GALLERY Section Slider
    // ====================================
    const track = document.getElementById('gallery-track');
    const container = document.getElementById('gallery-track-container');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    if (track && container && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        function getSlideWidth() {
            const slide = track.querySelector('.gallery-slide');
            return slide ? slide.offsetWidth + 24 : 0; // slide width + gap (24px)
        }

        function getMaxIndex() {
            const slides = track.querySelectorAll('.gallery-slide');
            const visibleSlides = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            return Math.max(0, slides.length - visibleSlides);
        }

        function updateSliderPosition() {
            const slideWidth = getSlideWidth();
            const maxIndex = getMaxIndex();
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            const translateValue = -currentIndex * slideWidth;
            track.style.transform = `translateX(${translateValue}px)`;
            
            // Toggle button states
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        }

        nextBtn.addEventListener('click', function () {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSliderPosition();
            }
        });

        prevBtn.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });

        // Initialize button states
        updateSliderPosition();

        // Handle window resize to adjust offset
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                updateSliderPosition();
            } else {
                // Reset transform on mobile so native scroll works properly
                track.style.transform = 'none';
            }
        });
    }

    // ====================================
    // SLIDESHOW Rotation Logic (Sake & Seat)
    // ====================================
    function initSlideshow(containerId, intervalTime) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const slides = container.querySelectorAll('.slide');
        if (slides.length <= 1) return;
        
        let currentSlideIndex = 0;
        setInterval(() => {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }, intervalTime);
    }

    // Initialize slideshows with a 4-second (4000ms) interval
    initSlideshow('sake-slideshow', 4000);
    initSlideshow('seat-slideshow', 4000);

    // ====================================
    // Premium Opening Animation Control
    // ====================================
    const loader = document.getElementById('loader');
    const loaderLine = document.querySelector('.loader-line');

    if (loaderLine) {
        // Start animating the loader line width
        setTimeout(() => {
            loaderLine.style.width = '100%';
        }, 200);
    }

    function deactivateLoader() {
        if (loader && !document.body.classList.contains('loaded')) {
            document.body.classList.add('loaded');
            
            // Allow slider to compute positions after animations settle
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 1500);
            
            // Slide up loader screen after line progress finishes
            setTimeout(() => {
                loader.classList.add('hide');
            }, 800);
        }
    }

    // Deactivate loader when page assets have fully loaded
    window.addEventListener('load', deactivateLoader);

    // Fallback safety timeout (deactivates loading after 2.5 seconds maximum)
    setTimeout(deactivateLoader, 2500);

    // ====================================
    // Current Year for Copyright
    // ====================================
    const copyrightYear = document.querySelector('.footer-copyright');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = `&copy; ${currentYear} やきとり蔵 All Rights Reserved.`;
    }

});
