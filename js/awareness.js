// Awareness Training Module
function initAwareness() {
    const checkIndicatorsBtn = document.getElementById('check-indicators');
    const indicatorChecks = document.querySelectorAll('.indicator-check');
    
    // Event listener for checking phishing indicators
    checkIndicatorsBtn.addEventListener('click', () => {
        let correctCount = 0;
        let totalCorrect = 0;
        
        indicatorChecks.forEach(check => {
            const isCorrect = check.dataset.correct === 'true';
            const isChecked = check.checked;
            
            if (isCorrect) {
                totalCorrect++;
                if (isChecked) {
                    correctCount++;
                    check.parentElement.classList.add('correct-indicator');
                } else {
                    check.parentElement.classList.add('missed-indicator');
                }
            } else {
                if (isChecked) {
                    check.parentElement.classList.add('wrong-indicator');
                }
            }
        });
        
        // Show result
        const resultMessage = document.createElement('div');
        resultMessage.className = 'awareness-result';
        
        const percentage = Math.floor((correctCount / totalCorrect) * 100);
        
        if (percentage === 100) {
            resultMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Excellent! You identified all ${totalCorrect} phishing indicators correctly.</p>
            `;
            resultMessage.classList.add('success');
        } else if (percentage >= 70) {
            resultMessage.innerHTML = `
                <i class="fas fa-thumbs-up"></i>
                <p>Good job! You identified ${correctCount} out of ${totalCorrect} phishing indicators.</p>
                <p>Keep practicing to spot them all!</p>
            `;
            resultMessage.classList.add('partial');
        } else {
            resultMessage.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>You identified only ${correctCount} out of ${totalCorrect} phishing indicators.</p>
                <p>Take some time to learn more about phishing indicators.</p>
            `;
            resultMessage.classList.add('danger');
        }
        
        // Add a button to try again
        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.textContent = 'Try Again';
        tryAgainBtn.addEventListener('click', () => {
            resetEmailSimulation();
            resultMessage.remove();
        });
        
        resultMessage.appendChild(tryAgainBtn);
        
        // Add an explanation of the phishing indicators
        const explanation = document.createElement('div');
        explanation.className = 'phishing-explanation';
        explanation.innerHTML = `
            <h4>Explanation of Phishing Indicators:</h4>
            <ul>
                <li><strong>Suspicious sender email domain:</strong> The email is from "amaz0n-verification.com" not the official "amazon.com" domain. Notice the use of a zero "0" instead of an "o".</li>
                <li><strong>Urgent language:</strong> The email creates a false sense of urgency to pressure you into acting quickly without thinking.</li>
                <li><strong>Suspicious URL:</strong> The link uses a suspicious top-level domain (.tk) and doesn't match the official domain of the company it claims to be from.</li>
                <li><strong>Request for immediate action:</strong> The email threatens account suspension to scare you into clicking the link.</li>
            </ul>
        `;
        
        resultMessage.appendChild(explanation);
        
        // Add the result to the page
        const indicatorsSection = document.querySelector('.phishing-indicators');
        indicatorsSection.appendChild(resultMessage);
        
        // Disable check button
        checkIndicatorsBtn.disabled = true;
    });
    
    // Load email simulation examples
    loadEmailSimulations();
}

function resetEmailSimulation() {
    // Reset checkboxes
    const indicatorChecks = document.querySelectorAll('.indicator-check');
    indicatorChecks.forEach(check => {
        check.checked = false;
        check.parentElement.classList.remove('correct-indicator', 'missed-indicator', 'wrong-indicator');
    });
    
    // Enable check button
    const checkIndicatorsBtn = document.getElementById('check-indicators');
    checkIndicatorsBtn.disabled = false;
    
    // Remove any existing result message
    const existingResult = document.querySelector('.awareness-result');
    if (existingResult) {
        existingResult.remove();
    }
}

function loadEmailSimulations() {
    // This function can be expanded to load different email simulations
    const emailSimulations = [
        {
            from: 'security@amaz0n-verification.com',
            to: 'you@example.com',
            subject: 'URGENT: Your Account Has Been Compromised',
            body: `
                <p>Dear Customer,</p>
                <p>We have detected suspicious activity on your account. Your account has been temporarily limited.</p>
                <p>Please verify your information immediately by clicking the link below:</p>
                <p><a href="#" class="suspicious-link">https://amaz0n-security-verification.tk/login</a></p>
                <p>Failure to verify within 24 hours will result in permanent account suspension.</p>
                <p>Security Team</p>
            `,
            indicators: [
                { text: 'Suspicious sender email domain', correct: true },
                { text: 'Urgent language creating pressure', correct: true },
                { text: 'Suspicious URL (.tk domain)', correct: true },
                { text: 'Request for immediate action', correct: true },
                { text: 'Professional greeting', correct: false }
            ]
        },
        {
            from: 'paypa1-secure@accounts-verification.com',
            to: 'you@example.com',
            subject: 'Payment Received - Action Required',
            body: `
                <p>Dear valued customer,</p>
                <p>We've detected an unusual payment of $750 to your account.</p>
                <p>If you did not authorize this transaction, please click the link below to reverse it:</p>
                <p><a href="#" class="suspicious-link">http://paypa1-secure-login.ml/verify?id=39475</a></p>
                <p>You have 24 hours to respond before this transaction becomes permanent.</p>
                <p>Thank you,<br>PayPal Security Team</p>
            `,
            indicators: [
                { text: 'Misspelled brand name (paypa1 with a number 1)', correct: true },
                { text: 'Creates urgency with a time limit', correct: true },
                { text: 'Suspicious URL (not paypal.com)', correct: true },
                { text: 'Uses fear of financial loss', correct: true },
                { text: 'Includes a transaction ID', correct: false }
            ]
        }
    ];
    
    // Initially, we'll use the first simulation which is already in the HTML
    // This can be expanded to allow cycling through different simulations
}

// Add styles for the indicator feedback
const style = document.createElement('style');
style.textContent = `
    .correct-indicator {
        color: var(--success-color);
    }
    
    .missed-indicator {
        color: var(--warning-color);
        font-weight: bold;
    }
    
    .wrong-indicator {
        color: var(--danger-color);
    }
    
    .awareness-result {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .awareness-result.success {
        background-color: rgba(89, 178, 89, 0.1);
        border: 1px solid var(--success-color);
    }
    
    .awareness-result.partial {
        background-color: rgba(255, 190, 11, 0.1);
        border: 1px solid var(--warning-color);
    }
    
    .awareness-result.danger {
        background-color: rgba(255, 107, 107, 0.1);
        border: 1px solid var(--danger-color);
    }
    
    .awareness-result i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .awareness-result.success i {
        color: var(--success-color);
    }
    
    .awareness-result.partial i {
        color: var(--warning-color);
    }
    
    .awareness-result.danger i {
        color: var(--danger-color);
    }
    
    .phishing-explanation {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .phishing-explanation ul {
        list-style: disc;
        padding-left: 1.5rem;
        margin-top: 0.5rem;
    }
    
    .phishing-explanation li {
        margin-bottom: 0.5rem;
    }
`;

document.head.appendChild(style); 