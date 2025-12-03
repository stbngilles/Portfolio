document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FALLING LEAVES EFFECT (SCROLL BASED) ---
    const leavesContainer = document.getElementById('leaves-container');
    const leafCount = 12;
    const leaves = [];

    if (leavesContainer) {
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');

            const leftPos = Math.random() * 100;
            const topPos = Math.random() * 100;
            const size = Math.random() * 10 + 10;
            const speed = Math.random() * 0.3 + 0.1;

            leaf.style.left = `${leftPos}%`;
            leaf.style.top = `${topPos}%`;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size}px`;

            leaves.push({
                el: leaf,
                y: 0,
                speed: speed,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            });

            leavesContainer.appendChild(leaf);
        }

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            leaves.forEach(leaf => {
                const movement = scrollY * leaf.speed;
                const rotation = leaf.rotation + (scrollY * leaf.rotationSpeed * 0.1);
                leaf.el.style.transform = `translateY(${movement}px) rotate(${rotation}deg)`;
            });
        });
    }

    // --- 2. BEFORE / AFTER SLIDER ---
    const range = document.getElementById("compareRange");
    const afterImage = document.getElementById("afterImage");
    const handle = document.getElementById("handle");
    const wrapper = document.getElementById("compare");

    if (range && afterImage && handle && wrapper) {
        function updateSlider(value) {
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
        }

        updateSlider(range.value);

        range.addEventListener("input", (e) => {
            updateSlider(e.target.value);
        });

        wrapper.addEventListener("pointerdown", startDrag);

        function startDrag(e) {
            move(e);
            wrapper.setPointerCapture(e.pointerId);
            wrapper.addEventListener("pointermove", move);
            wrapper.addEventListener("pointerup", stopDrag);
            wrapper.addEventListener("pointercancel", stopDrag);
        }

        function move(e) {
            const rect = wrapper.getBoundingClientRect();
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            x = Math.min(100, Math.max(0, x));
            range.value = x;
            updateSlider(x);
        }

        function stopDrag(e) {
            wrapper.releasePointerCapture(e.pointerId);
            wrapper.removeEventListener("pointermove", move);
            wrapper.removeEventListener("pointerup", stopDrag);
            wrapper.removeEventListener("pointercancel", stopDrag);
        }
    }

    // --- 3. SCROLL REVEAL ANIMATION ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-text').forEach(el => observer.observe(el));

    // --- 4. ANIMATION DES CHIFFRES (COUNTERS) ---
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function startCounting() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                    if (target === 100) counter.innerText += "%";
                    else counter.innerText += "+";
                }
            };
            updateCounter();
        });
    }

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                startCounting();
                started = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // --- 5. CURSEUR PERSONNALISÉ ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // On ne touche PAS au transform (translate -50% -50% vient du CSS)
            cursor.style.top = y + 'px';
            cursor.style.left = x + 'px';

            follower.style.top = y + 'px';
            follower.style.left = x + 'px';
        });
    }

});
