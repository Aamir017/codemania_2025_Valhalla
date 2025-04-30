// Quiz Module
let currentQuiz = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null
};

const quizQuestions = [
    {
        question: "What is phishing?",
        options: [
            "A type of fish that lives in digital waters",
            "A cybersecurity attack where attackers impersonate legitimate organizations to steal data",
            "A software program that protects your computer",
            "A method to recover forgotten passwords"
        ],
        correctAnswer: 1
    },
    {
        question: "Which of the following is a common sign of a phishing email?",
        options: [
            "It comes from someone in your contact list",
            "The email has perfect grammar and spelling",
            "It creates a sense of urgency or threatens negative consequences",
            "It has the company's official logo"
        ],
        correctAnswer: 2
    },
    {
        question: "What should you do if you receive a suspicious email asking for personal information?",
        options: [
            "Reply to the email asking for verification",
            "Click on links to see where they lead",
            "Call the phone number provided in the email",
            "Contact the organization directly using their official contact information"
        ],
        correctAnswer: 3
    },
    {
        question: "Why do phishers often use URLs that look similar to legitimate websites?",
        options: [
            "To save money on domain registration",
            "To trick users into thinking they're on the legitimate site",
            "Because the real domains were already taken",
            "To improve search engine rankings"
        ],
        correctAnswer: 1
    },
    {
        question: "Which of these is a secure URL?",
        options: [
            "http://www.mybank.com",
            "https://mybank.com-secure.tk",
            "https://www.mybank.com",
            "http://secure-mybank.net"
        ],
        correctAnswer: 2
    },
    {
        question: "What is 'spear phishing'?",
        options: [
            "Phishing attempts targeting specific individuals or organizations",
            "Using harpoons to catch digital fish",
            "A technique to recover deleted emails",
            "The practice of creating multiple email accounts"
        ],
        correctAnswer: 0
    },
    {
        question: "Which of these practices helps protect against phishing attacks?",
        options: [
            "Opening all email attachments to scan them",
            "Using the same password for all your accounts",
            "Sharing your login credentials with trusted colleagues",
            "Enabling two-factor authentication on your accounts"
        ],
        correctAnswer: 3
    },
    {
        question: "What information do phishers typically try to steal?",
        options: [
            "Your favorite color",
            "Your browser history",
            "Usernames, passwords, and financial information",
            "Your computer's processing speed"
        ],
        correctAnswer: 2
    },
    {
        question: "Which action might compromise your security?",
        options: [
            "Checking the sender's email address before responding",
            "Verifying the URL before entering login information",
            "Clicking on a link in an email from an unknown sender",
            "Keeping your software updated"
        ],
        correctAnswer: 2
    },
    {
        question: "What should you do if you've fallen for a phishing attack?",
        options: [
            "Ignore it and hope nothing happens",
            "Change your compromised passwords and notify the relevant organizations",
            "Send your credit card information to verify it wasn't stolen",
            "Download software from the email to fix the problem"
        ],
        correctAnswer: 1
    }
];

function initQuiz() {
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const nextQuestionBtn = document.getElementById('next-question');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    
    // Initialize quiz
    currentQuiz.questions = shuffleArray([...quizQuestions]); // Copy and shuffle questions
    currentQuiz.currentQuestionIndex = 0;
    currentQuiz.score = 0;
    
    // Update question count
    totalQuestionsEl.textContent = currentQuiz.questions.length;
    
    // Show first question
    showQuestion();
    
    // Event listener for next question button
    nextQuestionBtn.addEventListener('click', () => {
        // Record answer and update score
        if (currentQuiz.selectedAnswer === currentQuiz.questions[currentQuiz.currentQuestionIndex].correctAnswer) {
            currentQuiz.score++;
        }
        
        // Move to next question or finish quiz
        currentQuiz.currentQuestionIndex++;
        currentQuiz.selectedAnswer = null;
        
        if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
            showQuestion();
        } else {
            showQuizResults();
        }
    });
}

function showQuestion() {
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const nextQuestionBtn = document.getElementById('next-question');
    const currentQuestionEl = document.getElementById('current-question');
    
    // Get current question
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    
    // Update question text
    quizQuestion.textContent = `${currentQuiz.currentQuestionIndex + 1}. ${question.question}`;
    
    // Update current question indicator
    currentQuestionEl.textContent = currentQuiz.currentQuestionIndex + 1;
    
    // Clear previous options
    quizOptions.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.textContent = option;
        optionEl.dataset.index = index;
        
        optionEl.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionEl.classList.add('selected');
            
            // Update selected answer
            currentQuiz.selectedAnswer = parseInt(optionEl.dataset.index);
            
            // Enable next button
            nextQuestionBtn.disabled = false;
        });
        
        quizOptions.appendChild(optionEl);
    });
    
    // Disable next button until an answer is selected
    nextQuestionBtn.disabled = true;
}

function showQuizResults() {
    const quizResults = document.getElementById('quiz-results');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizControls = document.querySelector('.quiz-controls');
    
    // Hide question and options
    quizQuestion.style.display = 'none';
    quizOptions.style.display = 'none';
    quizControls.style.display = 'none';
    
    // Calculate percentage
    const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
    
    // Determine result message based on score
    let resultMessage;
    if (percentage >= 90) {
        resultMessage = "Excellent! You're well-equipped to identify and avoid phishing attacks.";
    } else if (percentage >= 70) {
        resultMessage = "Good job! You have a solid understanding of phishing, but there's still room for improvement.";
    } else if (percentage >= 50) {
        resultMessage = "You've got the basics, but should learn more about phishing to stay safe online.";
    } else {
        resultMessage = "You might be vulnerable to phishing attacks. Consider learning more about online security.";
    }
    
    // Show results
    quizResults.innerHTML = `
        <div class="quiz-score">Your Score:</div>
        <div class="score-percent">${percentage}%</div>
        <p>${resultMessage}</p>
        <p>You answered ${currentQuiz.score} out of ${currentQuiz.questions.length} questions correctly.</p>
        <button id="restart-quiz">Take Quiz Again</button>
    `;
    
    // Add event listener to restart button
    const restartBtn = document.getElementById('restart-quiz');
    restartBtn.addEventListener('click', () => {
        // Reset quiz
        quizQuestion.style.display = 'block';
        quizOptions.style.display = 'flex';
        quizControls.style.display = 'flex';
        quizResults.style.display = 'none';
        quizResults.innerHTML = '';
        
        currentQuiz.questions = shuffleArray([...quizQuestions]);
        currentQuiz.currentQuestionIndex = 0;
        currentQuiz.score = 0;
        
        // Show first question
        showQuestion();
    });
    
    // Show results
    quizResults.style.display = 'block';
    
    // Save quiz results to local storage
    saveQuizResult(percentage);
}

function saveQuizResult(percentage) {
    // Get existing results
    let quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    
    // Add new result
    quizResults.push({
        date: new Date().toISOString(),
        score: percentage
    });
    
    // Keep only the last 10 results
    if (quizResults.length > 10) {
        quizResults = quizResults.slice(-10);
    }
    
    // Save to local storage
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', function() {
    // Quiz elements
    const startBtn = document.getElementById('start-quiz-btn');
    const quizIntro = document.getElementById('quiz-intro');
    const quizContainer = document.getElementById('quiz-container');
    const quizResults = document.getElementById('quiz-results');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('quiz-progress-text');
    const retryBtn = document.getElementById('retry-quiz-btn');
    const scorePercent = document.getElementById('score-percent');
    const correctAnswers = document.getElementById('correct-answers');
    const totalQuestions = document.getElementById('total-questions');
    const scoreMeaning = document.getElementById('score-meaning');

    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;

    // Quiz questions
    const questions = [
        {
            question: "You receive an email from your bank asking you to verify your account information by clicking a link. What should you do?",
            options: [
                "Click the link and enter your information to verify your account",
                "Reply to the email with your account information",
                "Contact your bank directly using their official phone number or website",
                "Forward the email to a friend to see if they got the same email"
            ],
            correctAnswer: 2,
            explanation: "You should never click on links in emails claiming to be from your bank. Instead, contact your bank directly using their official phone number or visit their website by typing the URL directly in your browser."
        },
        {
            question: "Which of the following email addresses is most likely to be legitimate?",
            options: [
                "support@amaz0n-secure.com",
                "amazon-support@gmail.com",
                "customer-service@amazon.com",
                "amazonuser@support.net"
            ],
            correctAnswer: 2,
            explanation: "Legitimate companies typically use their own domain for emails (e.g., @amazon.com), not free email services or slight variations of the company name."
        },
        {
            question: "You receive a pop-up message while browsing that says your computer is infected with a virus and provides a phone number to call for technical support. What should you do?",
            options: [
                "Call the number immediately to get help",
                "Close the browser or force quit the application",
                "Download the recommended antivirus software from the pop-up",
                "Enter your credit card information to purchase the fix"
            ],
            correctAnswer: 1,
            explanation: "This is a common tech support scam. You should close the browser or force quit the application. Never call unknown numbers or download software from suspicious pop-ups."
        },
        {
            question: "Which of the following is a sign that a website might be fake or malicious?",
            options: [
                "It has HTTPS in the URL with a padlock icon",
                "The website loads quickly and has professional graphics",
                "There are multiple misspellings and grammar errors",
                "It has a privacy policy and terms of service"
            ],
            correctAnswer: 2,
            explanation: "Multiple misspellings and grammar errors are often signs of a fake or malicious website. Legitimate businesses typically ensure their content is professionally written."
        },
        {
            question: "You receive a text message saying you've won a gift card and need to click a link to claim it. What should you do?",
            options: [
                "Click the link to see if the offer is legitimate",
                "Reply to ask for more information",
                "Ignore and delete the message",
                "Forward the message to friends so they can also claim the gift card"
            ],
            correctAnswer: 2,
            explanation: "Unsolicited messages claiming you've won something and asking you to click a link are almost always scams. You should ignore and delete these messages."
        },
        {
            question: "Which of the following is the safest way to verify if an email from your credit card company is legitimate?",
            options: [
                "Check if the email address looks official",
                "Call the number provided in the email",
                "Log into your account directly through the company's official website or app",
                "Click the link in the email and see if the website looks legitimate"
            ],
            correctAnswer: 2,
            explanation: "The safest way to verify communications is to log into your account directly through the official website or app, or call the company using the number on the back of your card."
        },
        {
            question: "What is a strong password?",
            options: [
                "A simple word followed by '123' (e.g., password123)",
                "Your birthdate and name combined",
                "A long phrase with mixed characters, numbers, and symbols",
                "The same password you use for all your accounts for consistency"
            ],
            correctAnswer: 2,
            explanation: "Strong passwords are long, use a mix of uppercase and lowercase letters, numbers, and symbols, and avoid common words or easily guessable information."
        },
        {
            question: "A coworker sends you an email with an attachment you weren't expecting. What is the safest action?",
            options: [
                "Open the attachment to see what it is",
                "Contact your coworker through another method to verify they sent it",
                "Forward it to other colleagues to see if they know what it is",
                "Reply to the email asking what the attachment contains"
            ],
            correctAnswer: 1,
            explanation: "If you receive an unexpected attachment, even from someone you know, it's safest to verify with the sender through another communication method before opening it."
        },
        {
            question: "Which of the following is NOT a sign of a phishing email?",
            options: [
                "The email creates a sense of urgency or threatens negative consequences",
                "There are spelling and grammar errors in the email",
                "The email comes from a company's actual domain name",
                "The email asks for personal information or credentials"
            ],
            correctAnswer: 2,
            explanation: "An email coming from a company's actual domain name is not necessarily a sign of phishing, though domain names can be spoofed. The other options are common signs of phishing attempts."
        },
        {
            question: "What is two-factor authentication (2FA)?",
            options: [
                "Using two different passwords for added security",
                "Requiring two different email addresses to log in",
                "An additional verification step beyond your password, such as a text code",
                "Having to log in twice for security"
            ],
            correctAnswer: 2,
            explanation: "Two-factor authentication adds a second layer of security by requiring something you have (like your phone) in addition to something you know (your password)."
        }
    ];

    // Initialize the quiz
    totalQuestions.textContent = questions.length;
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', goToNextQuestion);
    retryBtn.addEventListener('click', retryQuiz);

    // Start the quiz
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    }

    // Load current question
    function loadQuestion() {
        // Reset state
        selectedOption = null;
        nextBtn.disabled = true;
        quizFeedback.innerHTML = '';
        quizFeedback.style.display = 'none';
        
        // Update progress
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
        
        // Load question and options
        const question = questions[currentQuestion];
        quizQuestion.innerHTML = `<h3>${question.question}</h3>`;
        
        quizOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('quiz-option');
            optionElement.dataset.index = index;
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => selectOption(optionElement, index));
            
            quizOptions.appendChild(optionElement);
        });
    }

    // Handle option selection
    function selectOption(optionElement, optionIndex) {
        // Clear previously selected option
        const allOptions = document.querySelectorAll('.quiz-option');
        allOptions.forEach(option => option.classList.remove('selected'));
        
        // Select current option
        optionElement.classList.add('selected');
        selectedOption = optionIndex;
        
        // Enable the next button
        nextBtn.disabled = false;
        
        // Show feedback
        showFeedback(optionIndex);
    }

    // Show feedback for selected answer
    function showFeedback(selectedIndex) {
        const question = questions[currentQuestion];
        const correctIndex = question.correctAnswer;
        
        quizFeedback.style.display = 'block';
        
        // Mark correct/wrong options
        const allOptions = document.querySelectorAll('.quiz-option');
        allOptions.forEach(option => {
            const index = parseInt(option.dataset.index);
            option.classList.remove('correct', 'wrong');
            
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex) {
                option.classList.add('wrong');
            }
        });
        
        // Show explanation
        if (selectedIndex === correctIndex) {
            quizFeedback.innerHTML = `
                <div class="feedback-correct">
                    <i class="fas fa-check-circle"></i>
                    <p>Correct! ${question.explanation}</p>
                </div>
            `;
            score++;
        } else {
            quizFeedback.innerHTML = `
                <div class="feedback-wrong">
                    <i class="fas fa-times-circle"></i>
                    <p>Incorrect. ${question.explanation}</p>
                </div>
            `;
        }
    }

    // Go to next question or show results
    function goToNextQuestion() {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    // Show quiz results
    function showResults() {
        quizContainer.style.display = 'none';
        quizResults.style.display = 'block';
        
        const percentage = Math.round((score / questions.length) * 100);
        scorePercent.textContent = `${percentage}%`;
        correctAnswers.textContent = score;
        
        // Set score meaning based on percentage
        if (percentage >= 90) {
            scoreMeaning.innerHTML = `
                <p><strong>Excellent!</strong> You have strong phishing awareness skills. Keep staying vigilant!</p>
            `;
        } else if (percentage >= 70) {
            scoreMeaning.innerHTML = `
                <p><strong>Good job!</strong> You have decent phishing awareness, but there's still room for improvement.</p>
            `;
        } else if (percentage >= 50) {
            scoreMeaning.innerHTML = `
                <p><strong>Not bad,</strong> but you should review our security tips to better protect yourself online.</p>
            `;
        } else {
            scoreMeaning.innerHTML = `
                <p><strong>You need improvement.</strong> Please take time to learn more about online security to protect yourself from phishing attacks.</p>
            `;
        }
    }

    // Retry the quiz
    function retryQuiz() {
        quizResults.style.display = 'none';
        currentQuestion = 0;
        score = 0;
        startQuiz();
    }
}); 