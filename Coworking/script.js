document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRICING TOGGLE (Logique Business) ---
    const toggle = document.getElementById('pricing-switch');
    const amounts = document.querySelectorAll('.amount');
    const labelMonthly = document.getElementById('monthly-label');
    const labelYearly = document.getElementById('yearly-label');

    toggle.addEventListener('change', () => {
        // Change la classe active pour le style du texte
        if(toggle.checked) {
            labelYearly.classList.add('active');
            labelMonthly.classList.remove('active');
        } else {
            labelMonthly.classList.add('active');
            labelYearly.classList.remove('active');
        }

        // Met à jour les prix avec animation
        amounts.forEach(amount => {
            // Récupère les valeurs data-monthly et data-yearly
            const price = toggle.checked ? amount.dataset.yearly : amount.dataset.monthly;
            
            // Petit effet de fade-out/fade-in
            amount.style.opacity = 0;
            setTimeout(() => {
                amount.innerText = price;
                amount.style.opacity = 1;
            }, 200);
        });
    });

    // --- 2. MULTI-STEP FORM (Logique UI) ---
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const steps = document.querySelectorAll('.form-step');
    const progress = document.getElementById('progress');
    let currentStep = 0;

    function updateForm() {
        // Cache toutes les étapes
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        
        // Met à jour la barre de progression
        // step 0 = 33%, step 1 = 66%, step 2 = 100%
        const percent = ((currentStep + 1) / steps.length) * 100;
        progress.style.width = percent + '%';
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validation simple (vérifie si les inputs requis sont remplis)
            const currentInputs = steps[currentStep].querySelectorAll('input[required]');
            let valid = true;
            currentInputs.forEach(input => {
                if (!input.value) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (valid) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateForm();
                }
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateForm();
            }
        });
    });
    
    // Empêcher le submit réel pour la démo
    document.getElementById('visit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Demande de visite envoyée ! (Simulation)");
    });

    // ... (Code existant à l'intérieur du DOMContentLoaded) ...

    // --- 3. CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, button, .hotspot, .bento-box');

    // Mouvement simple
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Le follower a un petit délai (CSS transition) pour l'effet fluide
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // Effet grossissant sur les liens
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.classList.add('link-hover');
        });
        link.addEventListener('mouseleave', () => {
            follower.classList.remove('link-hover');
        });
    });

    // --- 4. LIVE DASHBOARD SIMULATION ---
    // Change les valeurs aléatoirement pour faire "Vivant"
    function updateDashboard() {
        const upload = document.querySelector('.status-item:nth-child(1) .status-value');
        const download = document.querySelector('.status-item:nth-child(2) .status-value');
        
        // Simule des fluctuations réseau
        setInterval(() => {
            const upVal = 900 + Math.floor(Math.random() * 99);
            const downVal = 900 + Math.floor(Math.random() * 99);
            upload.innerText = upVal + " Mbps";
            download.innerText = downVal + " Mbps";
        }, 2000); // Toutes les 2 secondes
    }
    
    updateDashboard();

});