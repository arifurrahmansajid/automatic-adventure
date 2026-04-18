document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Entry Animations ---
    const heroContent = document.getElementById('hero-content');
    const heroVisual = document.getElementById('hero-visual');

    // Simple fade in and slide up/left for elements
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        heroVisual.style.transition = 'opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = window.innerWidth > 900 ? 'translateX(0)' : 'translateY(0)';
    }, 300);

    // --- 2. Shield Continuous Hover/Float Animation ---
    const shieldContainer = document.querySelector('.shield-container');
    let startTimestamp = null;

    function animateShield(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;

        // Sine wave for smooth floating up and down
        // 15px amplitude, ~4 seconds per cycle (4000ms)
        const yOffset = Math.sin(progress / 600) * 15;

        shieldContainer.style.transform = `translateY(${yOffset}px)`;

        requestAnimationFrame(animateShield);
    }

    requestAnimationFrame(animateShield);

    // --- 3. Interactive Mouse Movement Effect on Shield ---
    const shieldImage = document.querySelector('.shield-image');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 900) return; // Disable on smaller screens

        const x = (window.innerWidth / 2 - e.clientX) * 0.02;
        const y = (window.innerHeight / 2 - e.clientY) * 0.02;

        shieldImage.style.transform = `translate(${x}px, ${y}px)`;
    });

    // --- 4. Interactive Background Canvas Animation ---
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return; // Exit if canvas not found

    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Setup
    const particles = [];
    const particleCount = 60; // Total number of floating particles

    // Theme colors matching the design image (purples, pinks, subtle oranges)
    const colors = ['#b057d5', '#d45b98', '#ff8453', '#4a4869', '#3e285c'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Float upwards slowly
            this.vy = -(Math.random() * 0.4 + 0.1);
            // Gentle sway horizontally
            this.vx = (Math.random() - 0.5) * 0.3;
            // Varying sizes
            this.size = Math.random() * 2.5 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.6 + 0.1;
            // Life cycle for sine wave swaying
            this.life = Math.random() * 100;
        }

        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.life += 1;

            // Slight horizontal wave
            this.x += Math.sin(this.life / 60) * 0.3;

            // Simple wrapping from top to bottom
            if (this.y < -10) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Add slight glowing effect to particles
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop for Canvas
    function animateParticles() {
        // Clear canvas with a slightly transparent fill for a very subtle trail effect (optional)
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // --- 5. Portfolio Section Truncation & Interactive Dust Particles ---
    const maxTitleLen = 55;
    const maxDescLen = 750;

    class CardParticle {
        constructor(canvas, colors) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.colors = colors;
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            // Small dot sizes
            this.size = Math.random() * 1.2 + 0.3;
            this.baseSize = this.size;

            this.color = this.colors[Math.floor(Math.random() * this.colors.length)];

            // Motion: slow drift
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = -(Math.random() * 0.25 + 0.08);

            // Stronger Visibility / Shimmer (70% more visible)
            this.alpha = Math.random() * 0.49 + 0.51; // 70% more visible
            this.shimmerSpeed = Math.random() * 0.02 + 0.008;
            this.shimmerVal = Math.random() * Math.PI * 2;
        }

        update(mouseX, mouseY) {
            // Repel from mouse
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceRadius = 110;

                if (distance < forceRadius) {
                    const force = (forceRadius - distance) / forceRadius;
                    this.vx += (dx / distance) * force * 2.0;
                    this.vy += (dy / distance) * force * 2.0;
                }
            }

            // Normal motion
            this.x += this.vx;
            this.y += this.vy;

            // Shimmer
            this.shimmerVal += this.shimmerSpeed;
            this.currentAlpha = this.alpha + Math.sin(this.shimmerVal) * 0.34; // 70% more shimmer

            // Dampen velocity
            this.vx *= 0.94;
            if (Math.abs(this.vy) > 0.5) this.vy *= 0.94;

            // Wrapping
            if (this.y < -15) {
                this.y = this.canvas.height + 15;
                this.x = Math.random() * this.canvas.width;
            } else if (this.y > this.canvas.height + 15) {
                this.y = -15;
            }
            if (this.x < -15) this.x = this.canvas.width + 15;
            if (this.x > this.canvas.width + 15) this.x = -15;
        }

        draw() {
            this.ctx.save();
            this.ctx.globalAlpha = Math.min(1, Math.max(0, this.currentAlpha));
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();

            // Stronger glow for highlighted effect
            if (this.baseSize > 1.5) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = this.color;
            }

            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    class CardParticleManager {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouseX = null;
            this.mouseY = null;
            // Brighter, more saturated highlight colors
            this.colors = ['#c7c7c7', '#BF5AF2', '#FF2D55', '#e6ccf5', '#FFFFFF'];

            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.canvas.parentElement);
            this.resize();

            // 20 particles per card
            for (let i = 0; i < 20; i++) {
                this.particles.push(new CardParticle(this.canvas, this.colors));
            }

            const parent = this.canvas.closest('.portfolio-card');
            parent.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
            parent.addEventListener('mouseleave', () => {
                this.mouseX = null;
                this.mouseY = null;
            });
        }

        resize() {
            const parent = this.canvas.parentElement;
            if (parent.clientWidth > 0 && parent.clientHeight > 0) {
                this.canvas.width = parent.clientWidth;
                this.canvas.height = parent.clientHeight;
            }
        }

        update() {
            if (this.canvas.width === 0) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                p.update(this.mouseX, this.mouseY);
                p.draw();
            });
        }
    }

    const cardManagers = [];
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        // Truncate logic
        const titleEl = card.querySelector('.portfolio-title');
        if (titleEl && titleEl.textContent.length > maxTitleLen) {
            titleEl.textContent = titleEl.textContent.substring(0, maxTitleLen) + '...';
        }
        const descEl = card.querySelector('.portfolio-desc');
        if (descEl && descEl.textContent.length > maxDescLen) {
            descEl.textContent = descEl.textContent.substring(0, maxDescLen) + '...';
        }

        // Canvas setup
        const portfolioInfo = card.querySelector('.portfolio-info');
        if (portfolioInfo) {
            const canvas = document.createElement('canvas');
            canvas.className = 'card-particles-canvas';
            canvas.style.display = 'block';
            portfolioInfo.appendChild(canvas);
            cardManagers.push(new CardParticleManager(canvas));
        }
    });

    function animateCardParticles() {
        cardManagers.forEach(m => m.update());
        requestAnimationFrame(animateCardParticles);
    }

    setTimeout(animateCardParticles, 100);

    // --- 6. Scroll Reveal Animation ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    const revealItems = document.querySelectorAll('.scroll-reveal');
    revealItems.forEach(item => revealObserver.observe(item));

});
