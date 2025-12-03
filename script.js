document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Mobile Navigation --- */
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const body = document.body;

    if (toggleBtn) {
        function toggleMenu() {
            mobileMenu.classList.toggle('active');
            const spans = toggleBtn.querySelectorAll('span');
            if(mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.transform = 'rotate(-45deg) translate(1px, -1px)';
                body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
                body.style.overflow = '';
            }
        }

        toggleBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    /* --- 2. Header Scroll Effect --- */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* --- 3. Scroll Reveal --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- 4. Smooth Scroll --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    /* --- 5. Scrollytelling --- */
    const processSection = document.querySelector('.process-wrapper');
    const steps = document.querySelectorAll('.process-step');
    const progressBar = document.getElementById('progressBar');
    
    if (processSection && steps.length > 0) {
        const totalSteps = steps.length;
        function handleScrollProcess() {
            const rect = processSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            let scrollPercent = -sectionTop / (sectionHeight - windowHeight);
            scrollPercent = Math.max(0, Math.min(1, scrollPercent));

            if (progressBar) progressBar.style.width = `${scrollPercent * 100}%`;

            const activeIndex = Math.min(totalSteps - 1, Math.floor(scrollPercent * totalSteps));
            steps.forEach((step, index) => {
                if (index === activeIndex) step.classList.add('active');
                else step.classList.remove('active');
            });
        }
        window.addEventListener('scroll', () => window.requestAnimationFrame(handleScrollProcess));
        window.addEventListener('resize', () => window.requestAnimationFrame(handleScrollProcess));
        handleScrollProcess();
    }

    /* --- 6. ROI / GRAPH CHART ANIMATION (NOUVEAU CODE) --- */
    const roiSection = document.querySelector('.roi-section');
    const graphContainer = document.querySelector('.graph-container');
    const numberElement = document.getElementById('roiCounter');
    
    // Configuration
    const targetNumber = 184; 
    const cycleDuration = 5000; // 5 secondes au total par cycle
    let roiInterval; // Variable pour stocker l'intervalle

    function runAnimation() {
        if (!graphContainer || !numberElement) return;

        // 1. RESET
        graphContainer.classList.remove('animating');
        numberElement.innerText = "0";

        // Petite pause technique
        setTimeout(() => {
            // 2. START
            graphContainer.classList.add('animating');
            
            // 3. Animation du chiffre
            const duration = 2000; // 2 secondes
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing
                const ease = 1 - Math.pow(1 - progress, 3);
                
                numberElement.innerText = Math.floor(ease * targetNumber);

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            requestAnimationFrame(updateNumber);

        }, 100); 
    }

    // Observer pour le graphique
    if (roiSection) {
        const roiObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runAnimation(); // Premier lancement
                    // Relance toutes les 5 secondes si pas déjà lancé
                    if (!roiInterval) {
                        roiInterval = setInterval(runAnimation, cycleDuration);
                    }
                } else {
                    // Arrêt si on ne voit plus l'écran pour économiser la batterie
                    if(roiInterval) {
                        clearInterval(roiInterval);
                        roiInterval = null;
                    }
                }
            });
        }, { threshold: 0.3 });
        
        roiObserver.observe(roiSection);
    }
});