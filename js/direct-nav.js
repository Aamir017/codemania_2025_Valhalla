// Direct navigation script
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    // Add click handlers to force direct navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            // Get the href attribute
            const href = this.getAttribute('href');
            
            // Navigate directly using window.location
            window.location.href = href;
        });
    });
}); 