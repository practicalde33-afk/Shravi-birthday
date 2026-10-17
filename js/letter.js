// ===== LETTER PAGE JS =====

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const openBtn = document.getElementById('openLetterBtn');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const letterContainer = document.getElementById('letterContainer');
    const nextCta = document.getElementById('nextCta');

    // ===== ENVELOPE OPEN =====
    function openEnvelope() {
        envelope.classList.add('opened');
        openBtn.style.opacity = '0';
        openBtn.style.pointerEvents = 'none';

        // After flap animation, slide envelope up and show letter
        setTimeout(() => {
            envelopeContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            envelopeContainer.style.transform = 'translateY(-30px) scale(0.9)';
            envelopeContainer.style.opacity = '0';
        }, 800);

        setTimeout(() => {
            envelopeContainer.style.display = 'none';
            letterContainer.style.display = 'block';
            
            // Confetti burst
            if (window.confetti) {
                window.confetti.burst(80);
                setTimeout(() => window.confetti.burst(40), 400);
            }

            // Animate letter lines one by one
            revealLetterLines();
        }, 1600);
    }

    if (openBtn) {
        openBtn.addEventListener('click', openEnvelope);
    }
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
    }

    // ===== REVEAL LETTER LINES =====
    function revealLetterLines() {
        const lines = document.querySelectorAll('.letter-line');
        lines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, 150 + i * 220);
        });

        // Show next CTA smoothly
        setTimeout(() => {
            if (nextCta) {
                nextCta.style.display = 'block';
                nextCta.style.animation = 'revealUp 0.8s var(--ease-smooth) both';
            }
        }, 1200);
    }

    // ===== PARALLAX ON LETTER DECORATIONS =====
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        const flowers = document.querySelectorAll('.letter-flower-tl, .letter-flower-br');
        flowers.forEach(f => {
            f.style.transform = `translate(${x * 5}px, ${y * 5}px) rotate(${x * 5}deg)`;
        });
    });
});
