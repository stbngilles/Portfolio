document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOADER
    // Simule un temps de chargement puis fait disparaître le rideau
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500); // 1.5 secondes de délai

    // 2. SCROLL ANIMATION (Intersection Observer)
    // Détecte quand les éléments entrent dans l'écran
    const observerOptions = {
        threshold: 0.1 // L'animation se déclenche quand 10% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 3. MENU MOBILE AMÉLIORÉ
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            body.style.overflow = 'auto';
        });
    });

    // 4. SMOOTH SCROLL POUR LES ANCRES
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});