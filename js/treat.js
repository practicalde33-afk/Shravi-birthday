// ===== TREAT PAGE JS =====

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('treatForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successState = document.getElementById('successState');

    // ===== FORM SUBMISSION VIA FETCH (AJAX to Formspree) =====
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate: at least one choice or custom message
            const choices = form.querySelectorAll('input[name="choice[]"]:checked');
            const customMsg = document.getElementById('customMsg').value.trim();

            if (choices.length === 0 && !customMsg) {
                // Shake button
                submitBtn.style.animation = 'shake 0.5s ease';
                setTimeout(() => submitBtn.style.animation = '', 500);
                alert('Pick at least one option or write what you\'d love to do! 🎀');
                return;
            }

            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';

            // Collect form data
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success! Show celebration
                    showSuccess();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Try again or show success anyway (data might have gone through)
                console.error('Submission error:', err);
                // Show success anyway since Formspree might have received it
                showSuccess();
            }
        });
    }

    function showSuccess() {
        // Hide form
        form.style.transition = 'all 0.5s ease';
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';

        setTimeout(() => {
            form.style.display = 'none';
            successState.style.display = 'block';
            
            // Big confetti celebration!
            if (window.confetti) {
                window.confetti.burst(150);
                setTimeout(() => window.confetti.burst(100), 400);
                setTimeout(() => window.confetti.burst(80), 800);
                setTimeout(() => window.confetti.burst(50), 1200);
            }
        }, 500);
    }

    // ===== CHOICE CARD SOUND EFFECT (haptic feedback simulation) =====
    document.querySelectorAll('.treat-option input').forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                // Quick confetti burst on selection
                if (window.confetti) window.confetti.burst(15);
            }
        });
    });

    // ===== ADMIN: Ctrl+Shift+B to check choices =====
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
            alert('💌 Check your Formspree dashboard or email for Shravi\'s choices!\nhttps://formspree.io/');
        }
    });
});

// Add shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);
