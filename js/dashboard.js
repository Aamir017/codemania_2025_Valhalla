// Dashboard Module
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    updateSecurityScore();
    createScanChart();
    loadRecentScans();
    setupSecurityTips();
    trackActivity("Viewed dashboard");
    
    // Set up refresh button if it exists
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateSecurityScore();
            createScanChart();
            loadRecentScans();
            trackActivity("Refreshed dashboard");
        });
    }
});

// Security score calculation
function updateSecurityScore() {
    const securityScoreElement = document.getElementById('security-score-value');
    
    // Calculate security score based on quiz results and scan history
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    
    let score = 50; // Base score
    
    // Add points for quiz performance
    if (quizResults.length > 0) {
        const latestQuizScore = quizResults[0].score;
        score += latestQuizScore * 0.3; // Quiz contributes up to 30 points
    }
    
    // Add points for scanning activity
    if (recentScans.length > 0) {
        score += Math.min(recentScans.length * 2, 10); // Up to 10 points for scanning activity
    }
    
    // Determine if user checked dangerous URLs and avoided them
    const dangerousScansAvoidedCount = recentScans.filter(scan => 
        scan.riskStatus === 'danger' || scan.riskStatus === 'warning'
    ).length;
    
    if (dangerousScansAvoidedCount > 0) {
        score += Math.min(dangerousScansAvoidedCount * 3, 15); // Up to 15 points for avoiding dangerous sites
    }
    
    // Cap score at 100
    score = Math.min(Math.round(score), 100);
    
    // Update score display
    securityScoreElement.textContent = score;
    
    // Update circle fill percentage based on score
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.style.background = `conic-gradient(var(--primary-color) 0%, var(--primary-color) ${score}%, #e6e6e6 ${score}%)`;
}

// Recent scans table
function loadRecentScans() {
    const recentScansTable = document.getElementById('recent-scans-table');
    const recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    
    if (recentScans.length === 0) {
        recentScansTable.innerHTML = '<tr><td colspan="4" class="no-data">No scan history available</td></tr>';
        return;
    }
    
    // Sort scans by timestamp (newest first)
    recentScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Create table rows for each scan
    recentScansTable.innerHTML = recentScans.slice(0, 10).map(scan => {
        const scanDate = new Date(scan.timestamp).toLocaleString();
        
        return `
            <tr>
                <td class="url-cell" title="${scan.url}">${shortenURL(scan.url)}</td>
                <td>
                    <span class="risk-level ${scan.riskStatus}">${scan.riskLevel}</span>
                </td>
                <td>${scanDate}</td>
                <td>
                    <button class="table-action-btn share-btn" data-url="${scan.url}" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="table-action-btn delete table-delete-btn" data-timestamp="${scan.timestamp}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            shareResult(url);
        });
    });
    
    document.querySelectorAll('.table-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const timestamp = btn.getAttribute('data-timestamp');
            deleteRecentScan(timestamp);
            loadRecentScans(); // Reload the table
            createScanChart(); // Update the chart
        });
    });
}

// Scan statistics chart
// Function to create the URL scan statistics chart
function createScanChart() {
    const ctx = document.getElementById('scan-chart');
    
    // Check if chart already exists and destroy it
    if (window.scanChart) {
        window.scanChart.destroy();
    }
    
    // Get scan data from localStorage
    const recentScans = JSON.parse(localStorage.getItem('recentScans')) || [];
    
    // Count the number of safe, suspicious, and dangerous scans
    let safeCount = 0;
    let suspiciousCount = 0;
    let dangerousCount = 0;
    
    recentScans.forEach(scan => {
        if (scan.riskStatus === 'safe') {
            safeCount++;
        } else if (scan.riskStatus === 'warning') {
            suspiciousCount++;
        } else if (scan.riskStatus === 'danger') {
            dangerousCount++;
        }
    });
    
    // If there are no scans, add some sample data for visualization
    if (recentScans.length === 0) {
        safeCount = 1;
        suspiciousCount = 1;
        dangerousCount = 1;
    }
    
    // Create the chart
    window.scanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Suspicious', 'Dangerous'],
            datasets: [{
                data: [safeCount, suspiciousCount, dangerousCount],
                backgroundColor: [
                    '#10b981', // Green for safe
                    '#f59e0b', // Yellow/orange for suspicious
                    '#ef4444'  // Red for dangerous
                ],
                borderColor: [
                    '#0d9488',
                    '#d97706',
                    '#dc2626'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },
                        color: '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Make sure the chart is created when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    updateSecurityScore();
    createScanChart();
    loadRecentScans();
    setupSecurityTips();
    
    // Set up refresh button if it exists
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateSecurityScore();
            createScanChart();
            loadRecentScans();
        });
    }
});

// Security tips
function setupSecurityTips() {
    const tipElement = document.getElementById('security-tip');
    const newTipBtn = document.getElementById('new-tip-btn');
    
    const securityTips = [
        "Always check the URL in your browser's address bar before entering sensitive information.",
        "Be wary of emails requesting personal information, even if they appear to be from known organizations.",
        "Don't click on links in emails from unknown senders. Type the URL directly in your browser instead.",
        "Enable two-factor authentication wherever possible for an extra layer of security.",
        "Regularly update your passwords and avoid using the same password across multiple sites.",
        "Check for HTTPS (secure connection) before entering payment information on a website.",
        "Be suspicious of emails with urgent requests or threatening consequences if you don't act immediately.",
        "Hover over links to see where they actually lead before clicking them.",
        "Watch out for misspelled domain names (e.g., arnazon.com instead of amazon.com).",
        "Don't trust emails with poor grammar and spelling—they're often signs of phishing attempts.",
        "Be cautious with attachments, especially from unknown senders or unexpected emails.",
        "Keep your software, browsers, and operating systems updated to protect against vulnerabilities.",
        "Use a password manager to generate and store strong, unique passwords.",
        "Check the sender's email address carefully, not just the display name.",
        "Be skeptical of messages that seem too good to be true, like lottery winnings or inheritances.",
        "Review your financial statements regularly to catch unauthorized transactions.",
        "Use a credit card instead of a debit card for online purchases for better fraud protection.",
        "Don't share personal information over public Wi-Fi networks.",
        "Be cautious of phone calls asking for personal information or account details.",
        "Regularly back up your important data to protect against ransomware attacks."
    ];
    
    // Show random tip
    function showRandomTip() {
        const randomIndex = Math.floor(Math.random() * securityTips.length);
        tipElement.textContent = securityTips[randomIndex];
        
        // Store this tip as last shown
        localStorage.setItem('lastTipIndex', randomIndex);
        
        // Track activity
        trackActivity("Viewed security tip");
    }
    
    // Set initial tip
    const lastShownIndex = localStorage.getItem('lastTipIndex');
    if (lastShownIndex) {
        // Show next tip in sequence
        const nextIndex = (parseInt(lastShownIndex) + 1) % securityTips.length;
        tipElement.textContent = securityTips[nextIndex];
        localStorage.setItem('lastTipIndex', nextIndex);
    } else {
        showRandomTip();
    }
    
    // Set up button to show new tips
    newTipBtn.addEventListener('click', showRandomTip);
}

// Recent activity tracking
function trackActivity(activityDescription) {
    const recentActivityList = document.getElementById('recent-activity-list');
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    // Add new activity
    const newActivity = {
        description: activityDescription,
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    
    // Keep only recent activities (last 20)
    if (activities.length > 20) {
        activities.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Update the UI
    recentActivityList.innerHTML = activities.map(activity => {
        const activityTime = formatTimeAgo(new Date(activity.timestamp));
        return `<li class="activity-item"><span class="activity-time">${activityTime}</span> ${activity.description}</li>`;
    }).join('');
}

// Share scan result for social media
function shareResult(url) {
    // Prepare the share text
    const shareText = `I just scanned ${url} with PhishGuard and found it to be potentially dangerous. Stay safe online!`;
    const shareUrl = encodeURIComponent(shareText);
    
    // Create sharing options
    const shareOptions = document.createElement('div');
    shareOptions.className = 'share-options';
    shareOptions.innerHTML = `
        <div class="share-overlay"></div>
        <div class="share-modal">
            <h3>Share This Result</h3>
            <p>Warn others about this potentially dangerous site:</p>
            <div class="share-buttons">
                <a href="https://twitter.com/intent/tweet?text=${shareUrl}" target="_blank" class="share-button twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${shareUrl}" target="_blank" class="share-button facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <a href="mailto:?subject=Phishing Alert&body=${shareUrl}" class="share-button email">
                    <i class="fas fa-envelope"></i> Email
                </a>
            </div>
            <button class="copy-link-btn">
                <i class="fas fa-copy"></i> Copy Text
            </button>
            <button class="close-share-btn">Close</button>
        </div>
    `;
    
    document.body.appendChild(shareOptions);
    
    // Prevent scrolling on the background
    document.body.style.overflow = 'hidden';
    
    // Close button event
    shareOptions.querySelector('.close-share-btn').addEventListener('click', () => {
        document.body.removeChild(shareOptions);
        document.body.style.overflow = '';
    });
    
    // Copy link button event
    shareOptions.querySelector('.copy-link-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(shareText).then(() => {
            const copyBtn = shareOptions.querySelector('.copy-link-btn');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
            }, 2000);
        });
    });
    
    // Close when clicking overlay
    shareOptions.querySelector('.share-overlay').addEventListener('click', () => {
        document.body.removeChild(shareOptions);
        document.body.style.overflow = '';
    });
    
    // Track activity
    trackActivity(`Shared result for ${shortenURL(url)}`);
}

// Delete a recent scan
function deleteRecentScan(timestamp) {
    let recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    
    // Filter out the scan with the matching timestamp
    recentScans = recentScans.filter(scan => scan.timestamp !== timestamp);
    
    // Save updated list
    localStorage.setItem('recentScans', JSON.stringify(recentScans));
    
    // Track activity
    trackActivity("Deleted a scan record");
}

// Helper Functions
function shortenURL(url) {
    if (url.length > 40) {
        return url.substring(0, 37) + '...';
    }
    return url;
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    // For older dates, return the actual date
    return date.toLocaleDateString();
}

// Add styles for the share modal
const shareStyles = document.createElement('style');
shareStyles.textContent = `
.share-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.share-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
}

.share-modal h3 {
    margin-top: 0;
    color: var(--primary-color);
}

.share-buttons {
    display: flex;
    justify-content: space-between;
    margin: 1.5rem 0;
}

.share-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem;
    border-radius: 4px;
    color: white;
    text-decoration: none;
    width: 32%;
    font-weight: 500;
    transition: opacity 0.2s;
}

.share-button:hover {
    opacity: 0.9;
}

.share-button i {
    margin-right: 0.5rem;
}

.share-button.twitter {
    background-color: #1DA1F2;
}

.share-button.facebook {
    background-color: #3b5998;
}

.share-button.email {
    background-color: #777;
}

.copy-link-btn {
    width: 100%;
    margin-bottom: 1rem;
    background-color: #f1f1f1;
    color: #333;
}

.copy-link-btn:hover {
    background-color: #e5e5e5;
}

.close-share-btn {
    width: 100%;
}

@media (max-width: 576px) {
    .share-buttons {
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .share-button {
        width: 100%;
    }
}
`;

document.head.appendChild(shareStyles);