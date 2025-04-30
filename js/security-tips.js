document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initTipOfDay();
    setupCategoryFilters();
    setupSearch();
    setupSavedTips();
    trackPageVisit();
});

/**
 * Set up and display a random security tip as the tip of the day
 */
function initTipOfDay() {
    const tipOfDayContainer = document.getElementById('tip-of-day-content');
    const allTips = Array.from(document.querySelectorAll('.tip-card'));
    
    // Get a random tip or a saved one from today
    const tipOfDay = getTipOfDay(allTips);
    
    if (tipOfDayContainer && tipOfDay) {
        // Create featured tip content
        const tipIcon = tipOfDay.querySelector('.tip-icon').cloneNode(true);
        const tipTitle = document.createElement('h3');
        tipTitle.textContent = tipOfDay.querySelector('h3').textContent;
        
        const tipText = document.createElement('p');
        tipText.textContent = tipOfDay.querySelector('p').textContent;
        
        const tipCategory = document.createElement('span');
        tipCategory.className = 'featured-category';
        tipCategory.textContent = tipOfDay.querySelector('.tip-category').textContent;
        
        // Clear previous content and add new content
        tipOfDayContainer.innerHTML = '';
        tipOfDayContainer.appendChild(tipIcon);
        tipOfDayContainer.appendChild(tipTitle);
        tipOfDayContainer.appendChild(tipText);
        tipOfDayContainer.appendChild(tipCategory);
    }
    
    // Setup button to get a new random tip
    const newTipBtn = document.getElementById('new-featured-tip');
    if (newTipBtn) {
        newTipBtn.addEventListener('click', () => {
            // Get a different random tip
            let newTip;
            do {
                const randomIndex = Math.floor(Math.random() * allTips.length);
                newTip = allTips[randomIndex];
            } while (newTip.querySelector('h3').textContent === tipOfDayContainer.querySelector('h3').textContent);
            
            // Update the tip of the day
            const tipIcon = newTip.querySelector('.tip-icon').cloneNode(true);
            const tipTitle = document.createElement('h3');
            tipTitle.textContent = newTip.querySelector('h3').textContent;
            
            const tipText = document.createElement('p');
            tipText.textContent = newTip.querySelector('p').textContent;
            
            const tipCategory = document.createElement('span');
            tipCategory.className = 'featured-category';
            tipCategory.textContent = newTip.querySelector('.tip-category').textContent;
            
            // Clear previous content and add new content
            tipOfDayContainer.innerHTML = '';
            tipOfDayContainer.appendChild(tipIcon);
            tipOfDayContainer.appendChild(tipTitle);
            tipOfDayContainer.appendChild(tipText);
            tipOfDayContainer.appendChild(tipCategory);
        });
    }
}

/**
 * Get the tip of the day, either a random one or a saved one from today
 * @param {Array} allTips - Array of all tip elements
 * @returns {Element} - The tip element to display
 */
function getTipOfDay(allTips) {
    // Check if we already have a tip of the day saved for today
    const today = new Date().toDateString();
    const savedTipOfDay = localStorage.getItem('tipOfDay');
    const savedTipDate = localStorage.getItem('tipOfDayDate');
    
    // If we have a saved tip from today, use it
    if (savedTipOfDay && savedTipDate === today) {
        const tipId = savedTipOfDay;
        const savedTip = allTips.find(tip => 
            tip.querySelector('.save-tip-btn').dataset.tipId === tipId
        );
        
        if (savedTip) {
            return savedTip;
        }
    }
    
    // Otherwise, get a random tip
    const randomIndex = Math.floor(Math.random() * allTips.length);
    const randomTip = allTips[randomIndex];
    
    // Save this tip as today's tip
    const tipId = randomTip.querySelector('.save-tip-btn').dataset.tipId;
    localStorage.setItem('tipOfDay', tipId);
    localStorage.setItem('tipOfDayDate', today);
    
    return randomTip;
}

/**
 * Set up the category filter buttons
 */
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const tipCards = document.querySelectorAll('.tip-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked one
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.dataset.category;
            
            // Show/hide cards based on category
            tipCards.forEach(card => {
                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Set up the search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('tip-search');
    const searchButton = document.getElementById('search-btn');
    const tipCards = document.querySelectorAll('.tip-card');
    
    // Function to perform the search
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all cards (respecting current category filter)
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            
            tipCards.forEach(card => {
                if (activeCategory === 'all' || card.dataset.category === activeCategory) {
                    card.style.display = 'flex';
                }
            });
            
            return;
        }
        
        // Otherwise, filter by search term
        tipCards.forEach(card => {
            const tipTitle = card.querySelector('h3').textContent.toLowerCase();
            const tipContent = card.querySelector('p').textContent.toLowerCase();
            const tipCategory = card.querySelector('.tip-category').textContent.toLowerCase();
            
            if (tipTitle.includes(searchTerm) || 
                tipContent.includes(searchTerm) || 
                tipCategory.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    // Set up event listeners
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
        
        // If search field is cleared, show all tips
        if (searchInput.value === '') {
            performSearch();
        }
    });
}

/**
 * Set up functionality for saving and managing favorite tips
 */
function setupSavedTips() {
    const saveButtons = document.querySelectorAll('.save-tip-btn');
    const savedTipsContainer = document.getElementById('saved-tips-container');
    
    // Load saved tips from localStorage
    const savedTips = JSON.parse(localStorage.getItem('savedTips')) || [];
    
    // Update bookmark icons based on saved state
    updateBookmarkIcons(savedTips);
    
    // Display saved tips
    displaySavedTips(savedTips);
    
    // Add event listeners to save buttons
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tipId = button.dataset.tipId;
            const tipCard = button.closest('.tip-card');
            
            // Check if tip is already saved
            const tipIndex = savedTips.findIndex(tip => tip.id === tipId);
            
            if (tipIndex === -1) {
                // Save the tip
                const newSavedTip = {
                    id: tipId,
                    title: tipCard.querySelector('h3').textContent,
                    content: tipCard.querySelector('p').textContent,
                    category: tipCard.querySelector('.tip-category').textContent,
                    iconClass: tipCard.querySelector('.tip-icon i').className
                };
                
                savedTips.push(newSavedTip);
                button.innerHTML = '<i class="fas fa-bookmark"></i>';
            } else {
                // Remove the tip
                savedTips.splice(tipIndex, 1);
                button.innerHTML = '<i class="far fa-bookmark"></i>';
            }
            
            // Save to localStorage
            localStorage.setItem('savedTips', JSON.stringify(savedTips));
            
            // Update the saved tips section
            displaySavedTips(savedTips);
        });
    });
}

/**
 * Update bookmark icons based on saved state
 * @param {Array} savedTips - Array of saved tips
 */
function updateBookmarkIcons(savedTips) {
    const saveButtons = document.querySelectorAll('.save-tip-btn');
    
    saveButtons.forEach(button => {
        const tipId = button.dataset.tipId;
        const isSaved = savedTips.some(tip => tip.id === tipId);
        
        if (isSaved) {
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
        } else {
            button.innerHTML = '<i class="far fa-bookmark"></i>';
        }
    });
}

/**
 * Display saved tips in the saved tips section
 * @param {Array} savedTips - Array of saved tips
 */
function displaySavedTips(savedTips) {
    const savedTipsContainer = document.getElementById('saved-tips-container');
    
    if (!savedTipsContainer) return;
    
    // Clear container
    savedTipsContainer.innerHTML = '';
    
    if (savedTips.length === 0) {
        // Show message if no saved tips
        const noTipsMessage = document.createElement('p');
        noTipsMessage.className = 'no-saved-tips';
        noTipsMessage.textContent = 'You haven\'t saved any tips yet. Click the bookmark icon on any tip to save it for later.';
        savedTipsContainer.appendChild(noTipsMessage);
        return;
    }
    
    // Create and append each saved tip
    savedTips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'saved-tip-card';
        tipElement.dataset.tipId = tip.id;
        
        const tipIcon = document.createElement('div');
        tipIcon.className = 'tip-icon';
        const iconElement = document.createElement('i');
        iconElement.className = tip.iconClass;
        tipIcon.appendChild(iconElement);
        
        const tipContent = document.createElement('div');
        tipContent.className = 'saved-tip-content';
        
        const tipTitle = document.createElement('h4');
        tipTitle.textContent = tip.title;
        
        const tipText = document.createElement('p');
        tipText.textContent = tip.content;
        
        const tipCategory = document.createElement('span');
        tipCategory.className = 'tip-category';
        tipCategory.textContent = tip.category;
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-saved-tip';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.addEventListener('click', () => {
            removeSavedTip(tip.id);
        });
        
        tipContent.appendChild(tipTitle);
        tipContent.appendChild(tipText);
        tipContent.appendChild(tipCategory);
        
        tipElement.appendChild(tipIcon);
        tipElement.appendChild(tipContent);
        tipElement.appendChild(removeButton);
        
        savedTipsContainer.appendChild(tipElement);
    });
}

/**
 * Remove a tip from saved tips
 * @param {string} tipId - ID of the tip to remove
 */
function removeSavedTip(tipId) {
    // Get saved tips from localStorage
    const savedTips = JSON.parse(localStorage.getItem('savedTips')) || [];
    
    // Find and remove the tip
    const tipIndex = savedTips.findIndex(tip => tip.id === tipId);
    
    if (tipIndex !== -1) {
        savedTips.splice(tipIndex, 1);
        
        // Save updated list to localStorage
        localStorage.setItem('savedTips', JSON.stringify(savedTips));
        
        // Update bookmark icons
        updateBookmarkIcons(savedTips);
        
        // Update the saved tips section
        displaySavedTips(savedTips);
    }
}

/**
 * Track page visit in activity history
 */
function trackPageVisit() {
    // Get activity history from localStorage
    let activityHistory = JSON.parse(localStorage.getItem('activityHistory')) || [];
    
    // Add this page visit to activity
    activityHistory.push({
        page: 'Security Tips',
        timestamp: new Date().toISOString()
    });
    
    // Keep only the last 50 activities
    if (activityHistory.length > 50) {
        activityHistory = activityHistory.slice(-50);
    }
    
    // Save back to localStorage
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
} 