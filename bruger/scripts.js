document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. SCROLL REVEAL ANIMATION --- */
    // Uses IntersectionObserver to add '.active' class when elements enter viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed to prevent re-animation
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    /* --- 2. MOBILE NAVIGATION TOGGLE --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.contains('nav-open');
            toggleMenu(!isOpen);
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });
    }

    function toggleMenu(shouldOpen) {
        if (shouldOpen) {
            mainNav.classList.add('nav-open');
            menuToggle.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        } else {
            mainNav.classList.remove('nav-open');
            menuToggle.classList.remove('is-active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }


    /* --- 3. HEADER SCROLL EFFECT --- */
    // Adds shadow/background transparency adjustment on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            header.style.padding = '10px 0'; // Shrink slightly
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '15px 0';
        }
    });

});