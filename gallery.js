document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const leftHalf = document.getElementById('left-half');
    const rightHalf = document.getElementById('right-half');
    let currentGallery = [];
    let currentIndex = 0;

    const openLightbox = (index, gallery) => {
        currentGallery = gallery;
        currentIndex = index;
        lightboxImg.src = currentGallery[currentIndex].getAttribute('data-large');
        lightbox.style.display = 'flex';
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    const showNextImage = () => {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        openLightbox(currentIndex, currentGallery);
    };

    const showPrevImage = () => {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        openLightbox(currentIndex, currentGallery);
    };

    document.querySelectorAll('.gallery-masonry, .gallery-grid').forEach(gallery => {
        const galleryItems = gallery.querySelectorAll('.gallery-item img');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index, galleryItems));
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    rightHalf.addEventListener('click', showNextImage);
    leftHalf.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeLightbox();
        }
    });
});