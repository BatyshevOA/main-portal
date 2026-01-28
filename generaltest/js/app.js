// Основной файл приложения
class TestingApp {
    constructor() {
        this.currentTest = null;
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.testTimer = null;
        this.timeSpent = 0;
        this.testStartTime = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadTestsList();
        this.showPage('home');
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.target.getAttribute('href').substring(1);
                this.showPage(targetPage);
                
                // Обновление активной ссылки
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Мобильное меню
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        });

        // Кнопка начала тестирования
        document.getElementById('start-testing').addEventListener('click', () => {
            this.showPage('tests');
        });

        // Навигация теста
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submit-btn').addEventListener('click', () => this.finishTest());

        // Действия результатов
        document.getElementById('restart-btn').addEventListener('click', () => this.restartTest());
        document.getElementById('back-to-tests').addEventListener('click', () => this.showPage('tests'));
    }

    showPage(pageId) {
        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Показать выбранную страницу
        document.getElementById(pageId).classList.add('active');

        // Закрыть мобильное меню
        document.querySelector('.nav-links').classList.remove('active');

        // Прокрутка к верху
        window.scrollTo(0, 0);
    }

    loadTestsList() {
        const testsGrid = document.getElementById('tests-grid');
        
        const testsHTML = tests.map(test => `
            <div class="test-card" onclick="app.startTest(${test.id})">
                <h3>Тест ${test.id}: ${test.title}</h3>
                <p>${test.description}</p>
                <div class="test-meta">
                    <span>10 вопросов</span>
                    <span>3 вопроса по ТБ</span>
                </div>
            </div>
        `).join('');

        testsGrid.innerHTML = testsHTML;
    }

    startTest(testId) {
        this.currentTest = tests.find(test => test.id === testId);
        this.currentQuestion = 0;
        this.userAnswers = new Array(this.currentTest.questions.length).fill(null);
        this.timeSpent = 0;
        this.testStartTime = new Date();

        // Загрузка сохраненного прогресса
        this.loadProgress();

        // Обновление интерфейса
        document.getElementById('test-title').textContent = `Тест ${this.currentTest.id}: ${this.currentTest.title}`;
        document.getElementById('total-questions').textContent = this.currentTest.questions.length;

        // Запуск таймера
        this.startTimer();

        // Показать страницу тестирования
        this.showPage('testing');

        // Отобразить первый вопрос
        this.renderQuestion();
        this.updateNavigation();
        this.updateProgress();

        // Сохранение прогресса
        this.saveProgress();
    }

    renderQuestion() {
        const question = this.currentTest.questions[this.currentQuestion];
        const questionContainer = document.getElementById('question-container');
        
        const optionsHTML = question.options.map((option, index) => {
            const isSelected = this.userAnswers[this.currentQuestion] === index;
            return `
                <div class="option ${isSelected ? 'selected' : ''}" onclick="app.selectAnswer(${index})">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${option}</span>
                </div>
            `;
        }).join('');

        questionContainer.innerHTML = `
            <div class="question">
                <div class="question-number">Вопрос ${this.currentQuestion + 1}</div>
                <div class="question-text">${question.question}</div>
                <div class="options">${optionsHTML}</div>
            </div>
        `;

        // Обновить номер текущего вопроса
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestion] = answerIndex;
        this.renderQuestion();
        this.updateNavigation();
        this.saveProgress();
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateNavigation();
            this.updateProgress();
            this.saveProgress();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.currentTest.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateNavigation();
            this.updateProgress();
            this.saveProgress();
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        // Кнопка "Назад"
        prevBtn.disabled = this.currentQuestion === 0;

        // Кнопки "Далее" и "Завершить"
        if (this.currentQuestion === this.currentTest.questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.currentTest.questions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }

    startTimer() {
        this.testTimer = setInterval(() => {
            this.timeSpent++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.testTimer) {
            clearInterval(this.testTimer);
            this.testTimer = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeSpent / 60);
        const seconds = this.timeSpent % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    finishTest() {
        // Остановить таймер
        this.stopTimer();

        // Проверить, все ли вопросы отвечены
        const unansweredQuestions = this.userAnswers.filter(answer => answer === null).length;
        if (unansweredQuestions > 0) {
            if (!confirm(`У вас осталось ${unansweredQuestions} неотвеченных вопросов. Все равно завершить тест?`)) {
                this.startTimer();
                return;
            }
        }

        // Показать результаты
        this.showResults();

        // Сохранить статистику
        this.saveStatistics();

        // Очистить сохраненный прогресс
        this.clearProgress();
    }

    showResults() {
        const score = this.calculateScore();
        const totalQuestions = this.currentTest.questions.length;
        const percentage = (score / totalQuestions) * 100;

        // Обновить элементы результатов
        document.getElementById('final-score').textContent = `${score}/${totalQuestions}`;
        document.getElementById('score-percent').textContent = `${Math.round(percentage)}%`;
        document.getElementById('correct-answers').textContent = score;
        document.getElementById('wrong-answers').textContent = totalQuestions - score;
        document.getElementById('time-taken').textContent = this.formatTime(this.timeSpent);

        // Установить сообщение результата
        let scoreMessage = '';
        if (percentage >= 90) scoreMessage = 'Отлично! Вы прекрасно знаете материал!';
        else if (percentage >= 70) scoreMessage = 'Хорошо! Вы хорошо усвоили материал.';
        else if (percentage >= 50) scoreMessage = 'Удовлетворительно. Есть над чем поработать.';
        else scoreMessage = 'Нужно повторить материал.';
        
        document.getElementById('score-message').textContent = scoreMessage;

        // Анимировать круг прогресса
        this.animateScoreCircle(percentage);

        // Показать правильные ответы
        this.showAnswersReview();

        // Показать страницу результатов
        this.showPage('results');
    }

    calculateScore() {
        let correctCount = 0;
        this.currentTest.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                correctCount++;
            }
        });
        return correctCount;
    }

    animateScoreCircle(percentage) {
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.style.background = `conic-gradient(var(--secondary-color) ${percentage}%, #e0e0e0 0%)`;
    }

    showAnswersReview() {
        const answersList = document.getElementById('answers-list');
        
        const answersHTML = this.currentTest.questions.map((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            const userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Нет ответа';
            const correctAnswerText = question.options[question.correct];
            
            return `
                <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="answer-question">${index + 1}. ${question.question}</div>
                    <div class="answer-user">
                        <strong>Ваш ответ:</strong> 
                        <span class="${isCorrect ? 'answer-correct' : 'answer-wrong'}">
                            ${userAnswerText} ${isCorrect ? '✓' : '✗'}
                        </span>
                    </div>
                    ${!isCorrect ? `
                        <div class="answer-correct">
                            <strong>Правильный ответ:</strong> ${correctAnswerText}
                        </div>
                    ` : ''}
                    <div class="answer-explanation">
                        <strong>Объяснение:</strong> ${question.explanation}
                    </div>
                </div>
            `;
        }).join('');

        answersList.innerHTML = answersHTML;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    restartTest() {
        if (confirm('Вы уверены, что хотите начать тест заново?')) {
            this.startTest(this.currentTest.id);
        }
    }

    // Функции для работы с localStorage
    saveProgress() {
        const progress = {
            testId: this.currentTest.id,
            questionIndex: this.currentQuestion,
            answers: this.userAnswers,
            timeSpent: this.timeSpent,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`testProgress_${this.currentTest.id}`, JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem(`testProgress_${this.currentTest.id}`);
        if (saved) {
            const progress = JSON.parse(saved);
            if (confirm('Обнаружен сохраненный прогресс. Хотите продолжить?')) {
                this.userAnswers = progress.answers;
                this.currentQuestion = progress.questionIndex;
                this.timeSpent = progress.timeSpent || 0;
            }
        }
    }

    clearProgress() {
        localStorage.removeItem(`testProgress_${this.currentTest.id}`);
    }

    saveStatistics() {
        let stats = JSON.parse(localStorage.getItem('testStatistics')) || {};
        
        if (!stats[this.currentTest.id]) {
            stats[this.currentTest.id] = {
                attempts: 0,
                bestScore: 0,
                totalTime: 0,
                lastScore: 0
            };
        }
        
        const score = this.calculateScore();
        stats[this.currentTest.id].attempts++;
        stats[this.currentTest.id].lastScore = score;
        stats[this.currentTest.id].totalTime += this.timeSpent;
        
        if (score > stats[this.currentTest.id].bestScore) {
            stats[this.currentTest.id].bestScore = score;
        }
        
        localStorage.setItem('testStatistics', JSON.stringify(stats));
    }
}

// Инициализация приложения при загрузке страницы
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TestingApp();
});