function initApp() {
    // --- 0. Sticky Header on Scroll ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        });
    }

    // --- 1. Entry Animations ---
    const heroContent = document.getElementById('hero-content');
    const heroVisual = document.getElementById('hero-visual');

    if (heroContent) {
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    if (heroVisual) {
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = window.innerWidth > 900 ? 'translateX(0)' : 'translateY(0)';
        }, 300);
    }

    // --- 2. Shield Continuous Hover/Float Animation ---
    const shieldContainer = document.querySelector('.shield-container');
    if (shieldContainer) {
        let startTimestamp = null;
        function animateShield(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            const yOffset = Math.sin(progress / 600) * 15;
            shieldContainer.style.transform = `translateY(${yOffset}px)`;
            requestAnimationFrame(animateShield);
        }
        requestAnimationFrame(animateShield);
    }

    // --- 3. Interactive Mouse Movement Effect on Shield ---
    const shieldImage = document.querySelector('.shield-image');
    if (shieldImage) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 900) return;
            const x = (window.innerWidth / 2 - e.clientX) * 0.02;
            const y = (window.innerHeight / 2 - e.clientY) * 0.02;
            shieldImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // --- 4. Interactive Background Canvas Animation ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const particleCount = 60;
        const colors = ['#b057d5', '#d45b98', '#ff8453', '#4a4869', '#3e285c'];

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vy = -(Math.random() * 0.4 + 0.1);
                this.vx = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2.5 + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.6 + 0.1;
                this.life = Math.random() * 100;
            }
            update() {
                this.y += this.vy;
                this.x += this.vx;
                this.life += 1;
                this.x += Math.sin(this.life / 60) * 0.3;
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
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- 5. Portfolio Section Truncation & Interactive Dust Particles ---
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (portfolioCards.length > 0) {
        const maxTitleLen = 55;
        const maxDescLen = 750;
        const cardManagers = [];

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
                this.size = Math.random() * 1.2 + 0.3;
                this.baseSize = this.size;
                this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = -(Math.random() * 0.25 + 0.08);
                this.alpha = Math.random() * 0.49 + 0.51;
                this.shimmerSpeed = Math.random() * 0.02 + 0.008;
                this.shimmerVal = Math.random() * Math.PI * 2;
            }
            update(mouseX, mouseY) {
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
                this.x += this.vx; this.y += this.vy;
                this.shimmerVal += this.shimmerSpeed;
                this.currentAlpha = this.alpha + Math.sin(this.shimmerVal) * 0.34;
                this.vx *= 0.94;
                if (Math.abs(this.vy) > 0.5) this.vy *= 0.94;
                if (this.y < -15) { this.y = this.canvas.height + 15; this.x = Math.random() * this.canvas.width; }
                else if (this.y > this.canvas.height + 15) { this.y = -15; }
                if (this.x < -15) this.x = this.canvas.width + 15;
                if (this.x > this.canvas.width + 15) this.x = -15;
            }
            draw() {
                this.ctx.save();
                this.ctx.globalAlpha = Math.min(1, Math.max(0, this.currentAlpha));
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                if (this.baseSize > 1.5) { this.ctx.shadowBlur = 10; this.ctx.shadowColor = this.color; }
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
                this.mouseX = null; this.mouseY = null;
                this.colors = ['#c7c7c7', '#BF5AF2', '#FF2D55', '#e6ccf5', '#FFFFFF'];
                this.resizeObserver = new ResizeObserver(() => this.resize());
                this.resizeObserver.observe(this.canvas.parentElement);
                this.resize();
                for (let i = 0; i < 20; i++) this.particles.push(new CardParticle(this.canvas, this.colors));
                const parent = this.canvas.closest('.portfolio-card');
                parent.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouseX = e.clientX - rect.left;
                    this.mouseY = e.clientY - rect.top;
                });
                parent.addEventListener('mouseleave', () => { this.mouseX = null; this.mouseY = null; });
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
                this.particles.forEach(p => { p.update(this.mouseX, this.mouseY); p.draw(); });
            }
        }

        portfolioCards.forEach(card => {
            const titleEl = card.querySelector('.portfolio-title');
            if (titleEl && titleEl.textContent.length > maxTitleLen) {
                titleEl.textContent = titleEl.textContent.substring(0, maxTitleLen) + '...';
            }
            const descEl = card.querySelector('.portfolio-desc');
            if (descEl && descEl.textContent.length > maxDescLen) {
                descEl.textContent = descEl.textContent.substring(0, maxDescLen) + '...';
            }
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
    }

    // --- 6. Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.scroll-reveal');
    if (revealItems.length > 0) {
        const revealCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        };
        const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.15 });
        revealItems.forEach(item => revealObserver.observe(item));
    }

    // --- 7. Mobile Menu Logic ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
            document.body.style.overflow = mobileMenu.classList.contains('is-active') ? 'hidden' : 'auto';
        });

        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('is-active');
                mobileMenu.classList.remove('is-active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// Run init on DOMContentLoaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
