document.querySelectorAll('.cards-grow').forEach(card => {
    card.addEventListener('click', function(event) {
        // Remove any existing overlay
        const existingOverlay = document.querySelector('.cards-grow-wrapper');
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('cards-grow-wrapper');

        // Clone the clicked card
        const clonedCard = this.cloneNode(true);
        clonedCard.classList.add('expanded');

        // Append cloned card to overlay
        overlay.appendChild(clonedCard);
        document.body.appendChild(overlay);

        // Prevent body from scrolling
        document.body.classList.add('no-scroll');


        // Remove overlay on click of the exit button
        const exitButton = clonedCard.querySelector('.exit');
        exitButton.addEventListener('click', function(event) {
            event.stopPropagation();
            document.body.removeChild(overlay);
            document.body.classList.remove('no-scroll');
        });


        // Remove overlay on click outside the cloned card
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
                document.body.classList.remove('no-scroll');
            }
        });

        // Remove overlay on pressing Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                    document.body.classList.remove('no-scroll');
                }
            }
        }, { once: true });

        // Prevent event propagation to avoid immediate removal
        event.stopPropagation();
    });
});

// Ensure clicking anywhere else removes the overlay
document.addEventListener('click', function(event) {
    const existingOverlay = document.querySelector('.cards-grow-wrapper');
    if (existingOverlay && !existingOverlay.contains(event.target)) {
        document.body.removeChild(existingOverlay);
        document.body.classList.remove('no-scroll');
    }
});