document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.dark-light');
    const body = document.body;
    const lightIcon = document.getElementById('light');
    const darkIcon = document.getElementById('dark');

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light');
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            body.classList.remove('light');
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    }

    // Check for saved user preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Check the initial system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    toggleButton.addEventListener('click', function() {
        if (body.classList.contains('light')) {
            // Switch to dark mode
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to light mode
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });
});