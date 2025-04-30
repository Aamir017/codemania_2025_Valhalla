// Simplified navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Handle hamburger menu click for mobile
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Toggle active class for hamburger animation
            hamburger.classList.toggle('active');
            
            // Toggle active class for nav links to show/hide
            navLinks.classList.toggle('active');
        });
    }
    
    // Ensure navigation links work without JS interference
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default - let the browser handle normal navigation
            
            // Just close the mobile menu if it's open
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburger && navLinks && navLinks.classList.contains('active') && !event.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}); 