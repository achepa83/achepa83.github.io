document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        // Check if the clicked element or its parent has the 'clicker' class
        let targetElement = event.target;
        if (targetElement.classList.contains('clicker')) {
            // Clicked directly on the div
        } else if (targetElement.parentElement && targetElement.parentElement.classList.contains('clicker')) {
            // Clicked on the img inside the div
            targetElement = targetElement.parentElement;
        } else {
            // Clicked outside any 'clicker' element
            targetElement = null;
        }

        if (targetElement) {
            // Remove 'clicked' class from all elements with the 'clicker' class
            document.querySelectorAll('.clicker.clicked').forEach(function(element) {
                element.classList.remove('clicked');
            });

            // Add 'clicked' class to the clicked element
            targetElement.classList.add('clicked');
        } else {
            // If clicked outside, remove 'clicked' class from all elements
            document.querySelectorAll('.clicker.clicked').forEach(function(element) {
                element.classList.remove('clicked');
            });
        }
    });
});