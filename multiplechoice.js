
document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    const wrongAnswersList = [
        "Rasvata", "Taluttaa", "Jakaa", "Kuivata", "Harjata", 
        "Työntää", "Leikata", "Hikoilla", "Siirtää", "Peitellä", 
        "Nousta", "Hakea", "Ruokailla", "Nostaa", "Pyyhkiä", 
        "Kammata", "Valita", "Viedä", "Peseytyä", "Suihkuttaa", 
        "Avustaa/Auttaa", "Syöttää", "Auttaa", "Vaihtaa lakanat"
    ];
    let currentQuestionIndex = 0;

    const image = document.getElementById('image');
    const optionsContainer = document.getElementById('options');
    const correctMessage = document.getElementById('correctMessage');
    const wrongMessage = document.getElementById('wrongMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('table');

    if (!tableName) {
        alert("Table name is missing in the URL.");
        return;
    }

    // Lataa kysymykset tietokannasta
    async function loadQuestions() {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/questions.php?table=${tableName}`);
            questions = await response.json();
            if (questions.length > 0) {
                loadQuestion();
            } else {
                alert('No questions available.');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to load questions. Please try again later.');
        }
    }

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        image.src = currentQuestion.image;
    
        correctMessage.classList.add('hidden');
        wrongMessage.classList.add('hidden');
    
        optionsContainer.innerHTML = '';
    
        const wrongAnswers = getRandomWrongAnswers(wrongAnswersList, currentQuestion.answer, 3);
        const allOptions = shuffleArray([currentQuestion.answer, ...wrongAnswers]);
    
        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(option, currentQuestion.answer));
            optionsContainer.appendChild(button);
        });
    }

    function getRandomWrongAnswers(wrongAnswers, correctAnswer, count) {
        const filteredAnswers = wrongAnswers.filter(answer => answer !== correctAnswer);
        const shuffled = shuffleArray(filteredAnswers);
        return shuffled.slice(0, count);
    }

    function handleAnswer(selectedAnswer, correctAnswer) {
        correctMessage.classList.add('hidden');
        wrongMessage.classList.add('hidden');

        if (selectedAnswer === correctAnswer) {
            correctMessage.textContent = "Oikein! Hyvä vastaus.";
            correctMessage.classList.remove('hidden');
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    correctMessage.textContent = "Oikein! Olet vastannut kaikkiin kysymyksiin!";
                    correctMessage.classList.remove('hidden');
                }
            }, 1000); // Sekunnin odotus ennen seuraavaan kysymykseen siirtymistä
        } else {
            wrongMessage.classList.remove('hidden');
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadQuestions();
});
