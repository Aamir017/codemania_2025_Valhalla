document.addEventListener('DOMContentLoaded', function() {
    // Get the correct element IDs from your HTML
    const urlInput = document.getElementById('url-to-scan');
    const scanButton = document.getElementById('scan-btn');
    const scanResults = document.getElementById('scan-results');
    const recentScansList = document.getElementById('recent-scans-list');
    
    // Check if scanner elements exist on the page
    if (scanButton) {
        scanButton.addEventListener('click', function() {
            scanUrl(urlInput, scanResults, recentScansList);
        });
    }
    
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                scanUrl(urlInput, scanResults, recentScansList);
            }
        });
    }
    
    // Load recent scans if the list exists
    if (recentScansList) {
        loadRecentScans(recentScansList);
    }
    
    // Check API status
    checkApiStatus();
});

function scanUrl(urlInput, scanResults, recentScansList) {
    const url = urlInput.value.trim();
    if (!url) {
        alert('Please enter a URL to scan');
        return;
    }
    
    // Show loading indicator
    scanResults.className = 'scan-results';
    scanResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Scanning URL...</div>';
    scanResults.style.display = 'block';
    
    // Perform the scan immediately for faster results
    const result = analyzeUrl(url);
    
    // Display result
    displayScanResult(result, scanResults);
    
    // Save to recent scans
    saveRecentScan(url, result, recentScansList);
}

function analyzeUrl(url) {
    // Add a whitelist of known safe domains
    const safeDomainsWhitelist = [
        'youtube.com', 'www.youtube.com',
        'google.com', 'www.google.com',
        'facebook.com', 'www.facebook.com',
        'twitter.com', 'www.twitter.com',
        'instagram.com', 'www.instagram.com',
        'linkedin.com', 'www.linkedin.com',
        'amazon.com', 'www.amazon.com',
        'microsoft.com', 'www.microsoft.com',
        'apple.com', 'www.apple.com',
        'netflix.com', 'www.netflix.com',
        'github.com', 'www.github.com',
        'wikipedia.org', 'www.wikipedia.org',
        'reddit.com', 'www.reddit.com'
    ];
    
    // Extract domain from URL
    let domain;
    try {
        domain = new URL(url).hostname;
    } catch (e) {
        // If URL parsing fails, try a simple extraction
        domain = url.replace(/^https?:\/\//, '').split('/')[0];
    }
    
    // Check if domain is in whitelist
    if (safeDomainsWhitelist.includes(domain)) {
        return {
            url: url,
            riskLevel: 'No Immediate Risk',
            riskStatus: 'safe',
            riskScore: 0,
            riskFactors: ['Domain is on trusted websites list'],
            timestamp: new Date().toISOString()
        };
    }
    
    // Enhanced check for common phishing indicators
    const hasHttps = url.startsWith('https://');
    
    // Expanded list of suspicious TLDs
    const suspiciousTLDs = /\.(xyz|tk|ml|ga|cf|gq|top|pw|country|stream|download|racing|accountant|win|review|party|science|work|faith|gdn|bid|loan)$/i;
    const hasSuspiciousDomain = suspiciousTLDs.test(domain);
    
    // Check for long subdomains or domain parts
    const hasLongSubdomain = domain.split('.').some(part => part.length > 20);
    
    // Check for excessive hyphens (common in phishing domains)
    const hasExcessiveHyphens = (domain.match(/-/g) || []).length > 2;
    
    // Check for numeric domain (e.g., 123-paypal.com)
    const hasNumericDomain = /^\d+/.test(domain.split('.')[0]) || domain.split('.')[0].match(/\d{4,}/);
    
    // Check for IP address
    const hasIpAddress = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain);
    
    // Check for URL shorteners
    const isUrlShortener = /bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|cli\.gs|ow\.ly|buff\.ly|adf\.ly|rebrand\.ly|cutt\.ly|tiny\.cc|shorte\.st/.test(domain);
    
    // List of suspicious characters that attackers often use in phishing URLs
    const suspiciousChars = [
        "@",      // Used to hide real domain
        "-",      // Often used in typosquatting
        "_",      // Breaks up words to evade detection
        "~",      // Sometimes used in obfuscation
        "%",      // URL encoding can be suspicious
        "!",      // Rare in normal URLs, may be used to draw attention
        "*",      // Can be used in obfuscation or wildcards
        "=",      // Often seen in phishing query strings
        "&",      // Used in long, suspicious query chains
        "#",      // Anchor linking, sometimes abused
        "$",      // Used in phishing for financial bait
        ":",      // Especially in `http:` or in URL schemes
        ".",      // Subdomain chaining (e.g., paypal.com.fake.com)
        "/",      // Directory tricks (e.g., login.php/fakebank)
        "\\",     // Rare in URLs, highly suspicious
        "|",      // Rare character, not typical in safe URLs
        "`",      // Unusual, might be used in script injection
        "'",      // Injection-related
        "\"",     // Also for breaking strings or injections
        "(",      // Used in encoding or to hide intentions
        ")",      // Pair with above
        "[", "]", // Rarely used, suspicious
        "{", "}", // Injection
        "<", ">", // Highly suspicious — XSS, JS injection
        "^"       // Rare in normal URLs
    ];
    
    // Check for suspicious character density in domain
    const domainWithoutTLD = domain.split('.').slice(0, -1).join('.');
    let suspiciousCharCount = 0;
    let suspiciousCharsFound = [];
    
    for (const char of suspiciousChars) {
        // Skip "." and "-" in domain check as they're common in legitimate domains
        if ((char === "." || char === "-") && domainWithoutTLD.includes(char)) {
            continue;
        }
        
        // For other suspicious chars, count occurrences in domain
        if (domainWithoutTLD.includes(char)) {
            suspiciousCharCount++;
            suspiciousCharsFound.push(char);
        }
    }
    
    // Check for suspicious characters in path and query
    let urlPath = "";
    try {
        urlPath = new URL(url).pathname + new URL(url).search;
    } catch (e) {
        // If URL parsing fails, try a simple extraction
        const domainEnd = url.indexOf('/', url.indexOf('//') + 2);
        urlPath = domainEnd !== -1 ? url.substring(domainEnd) : "";
    }
    
    let pathSuspiciousCharCount = 0;
    for (const char of suspiciousChars) {
        // Skip common URL path characters
        if (char === "/" || char === "=" || char === "&" || char === "?" || char === ".") {
            continue;
        }
        
        // Count occurrences of suspicious chars in path
        const count = (urlPath.match(new RegExp("\\" + char, "g")) || []).length;
        pathSuspiciousCharCount += count;
        
        if (count > 0 && !suspiciousCharsFound.includes(char)) {
            suspiciousCharsFound.push(char);
        }
    }
    
    // Determine if there's an unusual density of suspicious characters
    const hasSuspiciousCharDensity = suspiciousCharCount > 1 || pathSuspiciousCharCount > 3;
    
    // Enhanced list of suspicious words in URL
    const suspiciousWordPatterns = [
        // Authentication related
        /(login|signin|logon|secure|account|auth|authenticate|verification|verify|password|pwd|reset|confirm)/i,
        
        // Financial related
        /(payment|pay|transaction|bank|banking|credit|debit|card|paypal|wallet|transfer|invoice|bill|billing)/i,
        
        // Urgency/Action related
        /(update|upgrade|activate|validate|verify|confirm|urgent|immediate|action|required|limited|expire|suspended)/i,
        
        // Support/Service related
        /(support|help|service|customer|contact|ticket|query|issue|problem|resolve|assistance)/i,
        
        // Brand imitation
        /(google|facebook|apple|microsoft|amazon|netflix|paypal|instagram|twitter|linkedin|outlook|office365|onedrive|icloud)/i,
        
        // Document related
        /(document|doc|pdf|file|download|attachment|view|preview|share|access)/i,
        
        // Security related
        /(security|secure|protection|alert|warning|notice|important|critical|suspicious|unusual|unauthorized)/i,
        
        // Reward/Offer related
        /(free|bonus|prize|win|winner|reward|gift|offer|discount|deal|promotion|coupon)/i
    ];
    
    // Check for suspicious words in the URL
    const hasSuspiciousWords = suspiciousWordPatterns.some(pattern => pattern.test(url));
    
    // Check for misspelled domains (e.g., amaz0n, g00gle)
    const misspelledDomains = [
        /paypa[l1]|pay-?pal/i,
        /g[o0]{2}gle/i,
        /faceb[o0]{2}k/i,
        /amaz[o0]n/i,
        /micr[o0]s[o0]ft/i,
        /netfl[i1]x/i,
        /[i1]nstagram/i,
        /tw[i1]tter/i,
        /l[i1]nked[i1]n/i,
        /[o0]utl[o0]{2}k/i,
        /[o0]ff[i1]ce365/i,
        /appl[e3]/i
    ];
    
    const hasMisspelledDomain = misspelledDomains.some(pattern => pattern.test(domain));
    
    // Check for deceptive subdomains (e.g., paypal.fake-site.com)
    const popularBrands = ['paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon', 'netflix', 'instagram', 'twitter', 'linkedin', 'outlook', 'office365'];
    const domainParts = domain.split('.');
    const hasDeceptiveSubdomain = popularBrands.some(brand => 
        domainParts.length > 2 && 
        domainParts.some(part => part.toLowerCase() === brand.toLowerCase()) && 
        !safeDomainsWhitelist.includes(domain)
    );
    
    // Check for excessive subdomains (e.g., a.b.c.d.example.com)
    const hasExcessiveSubdomains = domainParts.length > 4;
    
    // Calculate risk score with more factors
    let riskScore = 0;
    if (!hasHttps) riskScore += 25;
    if (hasSuspiciousDomain) riskScore += 20;
    if (hasLongSubdomain) riskScore += 15;
    if (hasIpAddress) riskScore += 30;
    if (hasSuspiciousWords) riskScore += 15;
    if (hasExcessiveHyphens) riskScore += 10;
    if (hasNumericDomain) riskScore += 15;
    if (isUrlShortener) riskScore += 20;
    if (hasMisspelledDomain) riskScore += 35;
    if (hasDeceptiveSubdomain) riskScore += 40;
    if (hasExcessiveSubdomains) riskScore += 15;
    if (hasSuspiciousCharDensity) riskScore += 25; // Add score for suspicious characters
    
    // Cap the risk score at 100
    riskScore = Math.min(100, riskScore);
    
    // Determine risk level and status
    let riskLevel, riskStatus;
    if (riskScore < 20) {
        riskLevel = 'No Immediate Risk';
        riskStatus = 'safe';
    } else if (riskScore < 50) {
        riskLevel = 'Medium Risk';
        riskStatus = 'warning';
    } else {
        riskLevel = 'High Risk';
        riskStatus = 'danger';
    }
    
    // Generate risk factors
    const riskFactors = [];
    if (!hasHttps) riskFactors.push('Insecure HTTP connection');
    if (hasSuspiciousDomain) riskFactors.push('Suspicious domain extension');
    if (hasLongSubdomain) riskFactors.push('Unusually long subdomain');
    if (hasIpAddress) riskFactors.push('IP address used instead of domain name');
    if (hasSuspiciousWords) riskFactors.push('Contains suspicious keywords');
    if (hasExcessiveHyphens) riskFactors.push('Excessive use of hyphens in domain');
    if (hasNumericDomain) riskFactors.push('Domain contains suspicious numeric patterns');
    if (isUrlShortener) riskFactors.push('URL shortener service detected');
    if (hasMisspelledDomain) riskFactors.push('Possible misspelled brand name in domain');
    if (hasDeceptiveSubdomain) riskFactors.push('Deceptive use of brand name in subdomain');
    if (hasExcessiveSubdomains) riskFactors.push('Excessive number of subdomains');
    if (hasSuspiciousCharDensity) {
        riskFactors.push(`Unusual characters detected (${suspiciousCharsFound.join(', ')})`);
    }
    
    if (riskFactors.length === 0) {
        riskFactors.push('No obvious risks detected');
    }
    
    return {
        url: url,
        riskLevel: riskLevel,
        riskStatus: riskStatus,
        riskScore: riskScore,
        riskFactors: riskFactors,
        timestamp: new Date().toISOString()
    };
}

function displayScanResult(result, scanResults) {
    // Set appropriate class for styling
    scanResults.className = `scan-results ${result.riskStatus}`;
    
    // Choose icon based on risk status
    let icon;
    if (result.riskStatus === 'safe') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (result.riskStatus === 'warning') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else {
        icon = '<i class="fas fa-times-circle"></i>';
    }
    
    // Build result HTML
    let resultHTML = `
        <h3>${icon} ${result.riskLevel}</h3>
        <p><strong>URL:</strong> ${result.url}</p>
        <p><strong>Risk Score:</strong> ${result.riskScore}/100</p>
    `;
    
    // Add risk factors
    if (result.riskFactors && result.riskFactors.length > 0) {
        resultHTML += '<p><strong>Risk Factors:</strong></p><ul>';
        result.riskFactors.forEach(factor => {
            resultHTML += `<li>${factor}</li>`;
        });
        resultHTML += '</ul>';
    }
    
    // Add recommendation
    if (result.riskStatus === 'safe') {
        resultHTML += '<p class="recommendation">This URL appears to be safe, but always remain vigilant.</p>';
    } else if (result.riskStatus === 'warning') {
        resultHTML += '<p class="recommendation">Exercise caution with this URL. It contains some suspicious elements.</p>';
    } else {
        resultHTML += '<p class="recommendation">This URL is potentially dangerous. We strongly recommend not visiting it.</p>';
    }
    
    // Update the display
    scanResults.innerHTML = resultHTML;
}

function saveRecentScan(url, result, recentScansList) {
    // Get existing scans from localStorage
    let recentScans = JSON.parse(localStorage.getItem('recentScans')) || [];
    
    // Add new scan to the beginning of the array
    recentScans.unshift({
        url: url,
        riskLevel: result.riskLevel,
        riskStatus: result.riskStatus,
        timestamp: result.timestamp
    });
    
    // Keep only the most recent 10 scans
    recentScans = recentScans.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentScans', JSON.stringify(recentScans));
    
    // Update the UI if the list exists
    if (recentScansList) {
        loadRecentScans(recentScansList);
    }
}

function loadRecentScans(recentScansList) {
    // Get scans from localStorage
    const recentScans = JSON.parse(localStorage.getItem('recentScans')) || [];
    
    // Clear the list
    recentScansList.innerHTML = '';
    
    if (recentScans.length === 0) {
        // Show a message if no scans exist
        recentScansList.innerHTML = '<li class="no-scans">No recent scans</li>';
        return;
    }
    
    // ... existing code ...
}

function shortenURL(url) {
    // Remove protocol
    let shortened = url.replace(/^https?:\/\//, '');
    // Limit length
    if (shortened.length > 30) {
        shortened = shortened.substring(0, 27) + '...';
    }
    return shortened;
}

function checkApiStatus() {
    const apiStatusIndicator = document.getElementById('api-status-indicator');
    if (!apiStatusIndicator) return;
    
    // Simulate API check
    setTimeout(function() {
        apiStatusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #10b981;"></i> API Status: Online';
    }, 500); // Reduced from 1500ms to 500ms for faster display
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('URL copied to clipboard');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}