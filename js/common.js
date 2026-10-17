// ===== COMMON JS — shared across all pages =====

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(window.innerWidth / 15, 60);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.3 + 0.1,
                hue: Math.random() * 60 + 320 // pink-purple range
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ===== CONFETTI =====
class Confetti {
    constructor() {
        this.canvas = document.getElementById('confettiCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#f48fb1', '#ec407a', '#ab47bc', '#ffd54f', '#ffab91', '#e1bee7', '#f06292', '#ce93d8', '#ff80ab'];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    burst(count = 100) {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.4 - 20,
                size: Math.random() * 8 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speedX: (Math.random() - 0.5) * 6,
                speedY: Math.random() * 3 + 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
        if (!this._animating) this._animate();
    }

    _animate() {
        this._animating = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.05;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();

            return p.opacity > 0 && p.y < this.canvas.height + 20;
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this._animate());
        } else {
            this._animating = false;
        }
    }
}

// ===== FLOATING ELEMENTS =====
function initFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    
    const items = ['💕', '💖', '💗', '💝', '🌸', '✨', '🦋', '💐', '🌺', '🎀', '💫', '🌷', '🌹', '🎉'];
    
    function createItem() {
        const el = document.createElement('span');
        el.className = 'float-item';
        el.textContent = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
        el.style.setProperty('--duration', (Math.random() * 5 + 5) + 's');
        el.style.setProperty('--delay', Math.random() * 3 + 's');
        el.style.setProperty('--sway', (Math.random() * 80 - 40) + 'px');
        container.appendChild(el);
        
        const duration = parseFloat(el.style.getPropertyValue('--duration')) * 1000;
        setTimeout(() => el.remove(), duration + 5000);
    }

    for (let i = 0; i < 6; i++) {
        setTimeout(() => createItem(), i * 600);
    }
    setInterval(createItem, 2500);
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('http') || href.startsWith('#')) return;
            
            e.preventDefault();
            const transition = document.getElementById('pageTransition');
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 700);
        });
    });
}

// ===== BIRTHDAY MUSIC (Web Audio API) =====
let musicState = { playing: false, ctx: null, interval: null };

function playBirthdayTune() {
    const ctx = musicState.ctx || new (window.AudioContext || window.webkitAudioContext)();
    musicState.ctx = ctx;
    const now = ctx.currentTime;
    
    function note(freq, start, dur, vol = 0.06) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(vol, now + start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.start(now + start);
        osc.stop(now + start + dur);
    }

    // Happy Birthday melody
    const melody = [
        [264,0,0.3],[264,0.35,0.2],[297,0.6,0.5],[264,1.15,0.5],[352,1.7,0.5],[330,2.25,0.8],
        [264,3.2,0.3],[264,3.55,0.2],[297,3.8,0.5],[264,4.35,0.5],[396,4.9,0.5],[352,5.45,0.8],
        [264,6.4,0.3],[264,6.75,0.2],[528,7.0,0.5],[440,7.55,0.5],[352,8.1,0.5],[330,8.65,0.5],[297,9.2,0.8],
        [470,10.15,0.3],[470,10.5,0.2],[440,10.75,0.5],[352,11.3,0.5],[396,11.85,0.5],[352,12.4,1.0]
    ];
    melody.forEach(n => note(n[0], n[1], n[2]));
}

function initMusic() {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        if (!musicState.playing) {
            playBirthdayTune();
            musicState.playing = true;
            btn.classList.add('playing');
            musicState.interval = setInterval(() => {
                if (musicState.playing) playBirthdayTune();
            }, 14000);
        } else {
            musicState.playing = false;
            btn.classList.remove('playing');
            clearInterval(musicState.interval);
            if (musicState.ctx) {
                musicState.ctx.close();
                musicState.ctx = null;
            }
        }
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// ===== INIT COMMON =====
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particleCanvas');
    window.confetti = new Confetti();
    initFloatingElements();
    initPageTransitions();
    initMusic();
    initScrollReveal();
});
