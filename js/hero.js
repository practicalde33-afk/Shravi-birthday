// ===== HERO PAGE JS =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== CURTAIN ANIMATION =====
    const curtain = document.getElementById('curtain');
    
    // Show curtain briefly then open smoothly
    setTimeout(() => {
        if (curtain) curtain.classList.add('open');
    }, 800);

    // Remove curtain after animation
    setTimeout(() => {
        if (curtain) {
            curtain.classList.add('hidden');
            // Burst confetti when curtain opens
            if (window.confetti) {
                window.confetti.burst(90);
                setTimeout(() => window.confetti.burst(50), 350);
            }
        }
    }, 1800);

    // ===== TWINKLE STARS =====
    const twinkleBg = document.getElementById('twinkleBg');
    if (twinkleBg) {
        for (let i = 0; i < 45; i++) {
            const star = document.createElement('div');
            star.className = 'twinkle-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            star.style.setProperty('--delay', Math.random() * 4 + 's');
            star.style.width = (Math.random() * 3 + 1) + 'px';
            star.style.height = star.style.width;
            twinkleBg.appendChild(star);
        }
    }

    // ===== TYPEWRITER EFFECT =====
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const text = "today is a very special day...";
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        
        setTimeout(() => {
            typewriterEl.style.opacity = '1';
            typewriterEl.appendChild(cursor);
            
            function type() {
                if (i < text.length) {
                    typewriterEl.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                    i++;
                    setTimeout(type, 45 + Math.random() * 30);
                } else {
                    setTimeout(() => cursor.style.opacity = '0', 1500);
                }
            }
            type();
        }, 1100);
    }

    // ===== GIFT BUTTON CLICK & HOVER =====
    const giftBtn = document.getElementById('openGiftBtn');
    if (giftBtn) {
        giftBtn.addEventListener('mouseenter', () => {
            if (window.confetti) window.confetti.burst(25);
        });
    }

    const floatingBtn = document.getElementById('floatingNextBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('mouseenter', () => {
            if (window.confetti) window.confetti.burst(15);
        });
    }
});
