/**
 * Homepage JavaScript file for displaying the tip of the day
 * and handling other homepage functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    displayHomeTipOfDay();
});

/**
 * Display a random security tip as the tip of the day on the homepage
 */
function displayHomeTipOfDay() {
    const homeTipContent = document.getElementById('home-tip-content');
    if (!homeTipContent) return;

    // Security tips collection
    const securityTips = [
        {
            title: "Check Sender Details",
            content: "Always verify the sender's email address, not just the display name. Hover over or click on the sender's name to reveal the actual email address.",
            category: "Email Safety",
            icon: "fas fa-envelope"
        },
        {
            title: "Beware of Urgent Requests",
            content: "Be suspicious of emails that create a sense of urgency or threaten negative consequences if you don't take immediate action.",
            category: "Email Safety",
            icon: "fas fa-exclamation-triangle"
        },
        {
            title: "Check for HTTPS",
            content: "Always verify that websites use HTTPS (look for the padlock icon) before entering any personal information or credentials, especially for financial sites.",
            category: "Web Browsing",
            icon: "fas fa-lock"
        },
        {
            title: "Use Strong, Unique Passwords",
            content: "Create complex, unique passwords for each of your accounts. Consider using a password manager to generate and store them securely.",
            category: "Account Security",
            icon: "fas fa-key"
        },
        {
            title: "Enable Two-Factor Authentication",
            content: "Whenever possible, set up two-factor authentication (2FA) for your accounts. This adds an extra layer of security beyond just your password.",
            category: "Account Security",
            icon: "fas fa-shield-alt"
        }
    ];

    // Check if we already have a tip of the day saved for today
    const today = new Date().toDateString();
    const savedTipOfDayDate = localStorage.getItem('homeTipOfDayDate');
    let tipIndex;
    
    if (savedTipOfDayDate === today) {
        // Use the saved tip index from today
        tipIndex = localStorage.getItem('homeTipOfDayIndex');
        if (tipIndex === null || tipIndex === undefined) {
            tipIndex = Math.floor(Math.random() * securityTips.length);
        } else {
            tipIndex = parseInt(tipIndex);
        }
    } else {
        // Get a random tip for a new day
        tipIndex = Math.floor(Math.random() * securityTips.length);
        localStorage.setItem('homeTipOfDayIndex', tipIndex);
        localStorage.setItem('homeTipOfDayDate', today);
    }

    // Get the selected tip
    const tip = securityTips[tipIndex];
    
    // Create tip content
    const tipIcon = document.createElement('div');
    tipIcon.className = 'tip-icon';
    tipIcon.innerHTML = `<i class="${tip.icon}"></i>`;
    
    const tipTitle = document.createElement('h4');
    tipTitle.textContent = tip.title;
    
    const tipText = document.createElement('p');
    tipText.textContent = tip.content;
    
    const tipCategory = document.createElement('span');
    tipCategory.className = 'tip-category';
    tipCategory.textContent = tip.category;
    
    // Clear previous content and add new content
    homeTipContent.innerHTML = '';
    homeTipContent.appendChild(tipIcon);
    homeTipContent.appendChild(tipTitle);
    homeTipContent.appendChild(tipText);
    homeTipContent.appendChild(tipCategory);

    // Track this in activity history if available
    if (typeof trackActivity === 'function') {
        trackActivity("Viewed tip of the day on homepage");
    }
} 