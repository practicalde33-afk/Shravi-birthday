// ===== GALLERY PAGE JS =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== LIGHTBOX =====
    const images = [];
    const captions = [];
    let currentIndex = 0;

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxDots = document.getElementById('lightboxDots');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Collect images
    document.querySelectorAll('.polaroid-card').forEach((card, i) => {
        const img = card.querySelector('img');
        const caption = card.querySelector('.polaroid-caption p');
        images.push(img.src);
        captions.push(caption ? caption.textContent : '');

        card.addEventListener('click', () => openLightbox(i));

        // Create dot
        const dot = document.createElement('span');
        dot.className = 'lb-dot';
        dot.addEventListener('click', () => goToImage(i));
        lightboxDots.appendChild(dot);
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = images[currentIndex];
            lightboxCaption.textContent = captions[currentIndex];
            lightboxImg.style.opacity = '1';
        }, 200);
        
        // Update dots
        lightboxDots.querySelectorAll('.lb-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToImage(index) {
        currentIndex = index;
        updateLightbox();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Click backdrop to close
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    });

    // ===== HOVER TILT ON POLAROIDS =====
    document.querySelectorAll('.polaroid-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `rotate(0deg) perspective(600px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-12px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
