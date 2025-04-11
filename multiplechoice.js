document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;
    let selectedTable = '';

    const image = document.getElementById('image');
    const optionsContainer = document.getElementById('options');
    const correctMessage = document.getElementById('correctMessage');
    const wrongMessage = document.getElementById('wrongMessage');
    const quizContainer = document.getElementById('quiz-container');

    const selectionContainer = document.createElement('div');
    selectionContainer.classList.add('selection-container');
    selectionContainer.innerHTML = `<h2>Valitse aihe</h2>`;

    const tableNames = ['Keho', 'Apuvalineet', 'Verbeja'];

    tableNames.forEach(table => {
        const button = document.createElement('button');
        button.textContent = table;
        button.classList.add('selection-button');
        button.addEventListener('click', () => startGame(table.toLowerCase()));
        selectionContainer.appendChild(button);
    });

    document.body.insertBefore(selectionContainer, quizContainer);
    quizContainer.style.display = 'none';

    function startGame(tableName) {
        selectedTable = tableName;
        window.history.pushState({}, '', `?table=${selectedTable}`);
        selectionContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        loadQuestions();
    }

    async function loadQuestions() {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/questions.php?table=${selectedTable}`);
            questions = await response.json();
            if (questions.length > 0) {
                questions = shuffleArray(questions);
                currentQuestionIndex = 0;
                loadQuestion();
            } else {
                alert('No questions available.');
                resetGame();
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to load questions. Please try again later.');
        }
    }

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            resetGame();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        image.src = currentQuestion.image;
        correctMessage.classList.add('hidden');
        wrongMessage.classList.add('hidden');
        optionsContainer.innerHTML = '';

        const wrongAnswers = getRandomWrongAnswers(currentQuestion.answer, 3);
        const allOptions = shuffleArray([currentQuestion.answer, ...wrongAnswers]);

        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(button, option, currentQuestion.answer));
            optionsContainer.appendChild(button);
        });
    }

    function getRandomWrongAnswers(correctAnswer, count) {
        const filteredAnswers = questions
            .map(q => q.answer)
            .filter(answer => answer !== correctAnswer);

        return shuffleArray(filteredAnswers).slice(0, count);
    }

    function handleAnswer(button, selectedAnswer, correctAnswer) {
        correctMessage.classList.add('hidden');
        wrongMessage.classList.add('hidden');

        if (selectedAnswer === correctAnswer) {
            correctMessage.textContent = "Oikein! Hyvä vastaus.";
            correctMessage.classList.remove('hidden');

            document.querySelectorAll('.option').forEach(btn => btn.disabled = true);

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    correctMessage.textContent = "Oikein! Olet vastannut kaikkiin kysymyksiin!";
                    correctMessage.classList.remove('hidden');
                    setTimeout(() => resetGame(), 2000);
                }
            }, 1000);
        } else {
            wrongMessage.classList.remove('hidden');
        }
    }

    function resetGame() {
        quizContainer.style.display = 'none';
        selectionContainer.style.display = 'block';
        window.history.pushState({}, '', window.location.pathname);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
