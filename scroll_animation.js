let lastScrollTop = 0;
const header = document.querySelector('.header');
const scrollThreshold = 500; // Adjust this value as needed
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Header visibility logic
            if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
                // Scrolling down
                header.classList.add('hidden');
            } else if (currentScrollTop < lastScrollTop) {
                // Scrolling up
                header.classList.remove('hidden');
            }

            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling

            // Scroll animations logic
            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementHeight = rect.height;
                const viewportHeight = window.innerHeight;

                // Calculate the scroll position relative to the viewport
                const scrollPosition = (viewportHeight - rect.top) / (viewportHeight + elementHeight);

                // Clamp the value between 0 and 1
                const clampedScroll = Math.max(0, Math.min(1, scrollPosition));

                // Set the CSS variable for each element
                element.style.setProperty('--view-scroll', clampedScroll);
            });

            ticking = false;
        });

        ticking = true;
    }
});

const hoverArea = document.querySelector('.header-hover-area');

hoverArea.addEventListener('mouseenter', () => {
    header.classList.remove('hidden');
});

hoverArea.addEventListener('mouseleave', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
        header.classList.add('hidden');
    }
});