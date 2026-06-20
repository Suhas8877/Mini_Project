document.addEventListener('DOMContentLoaded', () => {
    console.log('App Loaded: DOM ready.');

    // --- DOM Element References ---
    const screens = {
        loading: document.getElementById('loading-screen'),
        welcome: document.getElementById('welcome-screen'),
        quiz: document.getElementById('quiz-screen'),
        result: document.getElementById('result-screen'),
    };

    const elements = {
        startQuizBtn: document.getElementById('start-quiz-btn'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        restartQuizBtn: document.getElementById('restart-quiz-btn'),
        bestScoreStat: document.getElementById('best-score-stat'),
        currentQuestion: document.getElementById('current-question'),
        totalQuestions: document.getElementById('total-questions'),
        score: document.getElementById('score'),
        quizProgressBar: document.getElementById('quiz-progress-bar'),
        timerBar: document.getElementById('timer-bar'),
        timerText: document.getElementById('timer-text'),
        questionText: document.getElementById('question-text'),
        answerOptions: document.getElementById('answer-options'),
        finalScore: document.getElementById('final-score'),
        percentage: document.getElementById('percentage'),
        correctAnswers: document.getElementById('correct-answers'),
        wrongAnswers: document.getElementById('wrong-answers'),
        finalHighScore: document.getElementById('final-high-score'),
        performanceMessage: document.getElementById('performance-message'),
    };

    // --- Questions Data ---
    const questions = [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "Paris" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "Mars" },
        { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], correctAnswer: "Blue Whale" },
        { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correctAnswer: "William Shakespeare" },
        { question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "NaCl"], correctAnswer: "H2O" },
        { question: "What is the tallest mountain in the world?", options: ["K2", "Kangchenjunga", "Lhotse", "Mount Everest"], correctAnswer: "Mount Everest" },
        { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correctAnswer: "Leonardo da Vinci" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"], correctAnswer: "Mitochondrion" },
        { question: "In which year did the Titanic sink?", options: ["1912", "1905", "1898", "1920"], correctAnswer: "1912" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Lime"], correctAnswer: "Avocado" },
    ];
    console.log('Questions Loaded:', questions.length);

    // --- Application State ---
    let state = {
        currentQuestionIndex: 0,
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        timer: null,
        timeLeft: 15,
        shuffledQuestions: [],
    };

    // --- Functions ---

    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
    };

    const loadHighScore = () => {
        const highScore = localStorage.getItem('quizMasterHighScore') || 0;
        elements.bestScoreStat.textContent = highScore;
        elements.finalHighScore.textContent = highScore;
    };

    const saveHighScore = () => {
        const highScore = localStorage.getItem('quizMasterHighScore') || 0;
        if (state.score > highScore) {
            localStorage.setItem('quizMasterHighScore', state.score);
            console.log('New High Score Saved:', state.score);
        }
    };

    const startQuiz = () => {
        console.log('Quiz Started');
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.correctCount = 0;
        state.wrongCount = 0;
        state.shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        
        elements.totalQuestions.textContent = state.shuffledQuestions.length;
        elements.score.textContent = state.score;
        
        showScreen('quiz');
        loadQuestion();
    };

    const loadQuestion = () => {
        if (state.currentQuestionIndex < state.shuffledQuestions.length) {
            console.log(`Question Rendered: ${state.currentQuestionIndex + 1}`);
            clearInterval(state.timer);

            // Update quiz progress bar
            const progress = ((state.currentQuestionIndex) / state.shuffledQuestions.length) * 100;
            elements.quizProgressBar.style.width = `${progress}%`;

            const question = state.shuffledQuestions[state.currentQuestionIndex];
            elements.questionText.textContent = question.question;
            elements.currentQuestion.textContent = state.currentQuestionIndex + 1;
            elements.answerOptions.innerHTML = '';

            question.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option');
                button.onclick = () => selectAnswer(button, option, question.correctAnswer);
                elements.answerOptions.appendChild(button);
            });

            elements.nextQuestionBtn.style.display = 'none';
            startTimer();
        } else {
            endQuiz();
        }
    };

    const startTimer = () => {
        console.log('Timer Started');
        state.timeLeft = 15;
        elements.timerText.textContent = state.timeLeft;
        elements.timerBar.style.width = '100%';
        
        state.timer = setInterval(() => {
            state.timeLeft--;
            elements.timerText.textContent = state.timeLeft;
            elements.timerBar.style.width = `${(state.timeLeft / 15) * 100}%`;
            
            if (state.timeLeft <= 0) {
                console.log('Time is up!');
                clearInterval(state.timer);
                selectAnswer(null, '', state.shuffledQuestions[state.currentQuestionIndex].correctAnswer);
            }
        }, 1000);
    };

    const selectAnswer = (selectedButton, selectedOption, correctAnswer) => {
        clearInterval(state.timer);
        console.log(`Answer Selected: ${selectedOption || 'None'}`);

        document.querySelectorAll('.option').forEach(option => {
            option.classList.add('disabled');
            if (option.textContent === correctAnswer) {
                option.classList.add('correct');
            }
        });

        if (selectedButton) {
            if (selectedOption === correctAnswer) {
                state.score += 10;
                state.correctCount++;
                selectedButton.classList.add('correct');
            } else {
                state.wrongCount++;
                selectedButton.classList.add('incorrect');
            }
        } else {
            state.wrongCount++;
        }
        
        elements.score.textContent = state.score;
        elements.nextQuestionBtn.style.display = 'block';
    };

    const nextQuestion = () => {
        state.currentQuestionIndex++;
        loadQuestion();
    };

    const getPerformanceMessage = (percentage) => {
        if (percentage >= 90) return "Excellent! 🏆";
        if (percentage >= 70) return "Great Job! 🎯";
        if (percentage >= 50) return "Good Effort! 👍";
        return "Keep Practicing! 📚";
    };

    const endQuiz = () => {
        console.log('Quiz Completed');
        clearInterval(state.timer);
        saveHighScore();
        loadHighScore();

        // Final progress bar update
        elements.quizProgressBar.style.width = '100%';

        const percentage = state.shuffledQuestions.length > 0 ? ((state.correctCount / state.shuffledQuestions.length) * 100) : 0;
        
        elements.finalScore.textContent = state.score;
        elements.percentage.textContent = percentage.toFixed(2);
        elements.correctAnswers.textContent = state.correctCount;
        elements.wrongAnswers.textContent = state.wrongCount;
        elements.performanceMessage.textContent = getPerformanceMessage(percentage);
        
        showScreen('result');
    };

    // --- Event Listeners ---
    elements.startQuizBtn.addEventListener('click', startQuiz);
    elements.nextQuestionBtn.addEventListener('click', nextQuestion);
    elements.restartQuizBtn.addEventListener('click', () => {
        showScreen('welcome');
        loadHighScore();
    });
});

// --- Application Initialization ---
window.onload = () => {
    console.log('Window fully loaded. Initializing app.');
    const loadingScreen = document.getElementById('loading-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const bestScoreStat = document.getElementById('best-score-stat');

    if (bestScoreStat) {
        bestScoreStat.textContent = localStorage.getItem('quizMasterHighScore') || 0;
    }

    setTimeout(() => {
        if (loadingScreen && welcomeScreen) {
            loadingScreen.classList.remove('active');
            welcomeScreen.classList.add('active');
            console.log('Transition to Welcome Screen.');
        }
    }, 2000);
};