document.addEventListener('DOMContentLoaded', () => {
    console.log("hei maailma");
    let questions = [];
    let currentQuestionIndex = 0;

    const header = document.querySelector('header');
    const container = document.querySelector('.container');
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
    
    header.insertAdjacentElement('afterend', selectionContainer);

    function startGame(selectedTable) {
        selectionContainer.style.display = 'none';
        container.style.display = 'block';
        loadQuestions(selectedTable);
    }

    async function loadQuestions(tableName) {
        console.log("lataa");
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/questions.php?table=${tableName}`);
            questions = await response.json();
            
            if (questions.length > 0) {
                questions = shuffleArray(questions);
                currentQuestionIndex = 0;
                loadQuestion();
                console.log("ladattu");
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
        document.getElementById('image').src = currentQuestion.image;
        document.getElementById('userAnswer').value = "";
        document.getElementById('correctMessage').style.display = "none";
        document.getElementById('wrongMessage').style.display = "none";
        document.getElementById('continueButton').style.display = "none";

        if (currentQuestion.audio) {
            document.getElementById('audioPlayer').src = currentQuestion.audio;
            document.getElementById('playAudioButton').style.display = "block";
        } else {
            document.getElementById('playAudioButton').style.display = "none";
        }
    }

    document.getElementById('playAudioButton').addEventListener('click', function () {
        const audioElement = document.getElementById('audioPlayer');
        if (audioElement.src) {
            audioElement.play();
        }
    });

    document.getElementById('inquiryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = document.getElementById('userAnswer').value.trim().toLowerCase();
        const correctAnswer = currentQuestion.answer.trim().toLowerCase();

        document.getElementById('correctMessage').style.display = "none";
        document.getElementById('wrongMessage').style.display = "none";
    
        if (userAnswer === correctAnswer) {
            document.getElementById('correctMessage').innerHTML = `Oikein! ${currentQuestion.explanation}`;
            document.getElementById('correctMessage').style.display = "block";
            document.getElementById('continueButton').style.display = "block";
        } else {
            document.getElementById('wrongMessage').style.display = "block";
            document.getElementById('userAnswer').value = "";
        }
    });

    document.getElementById('continueButton').addEventListener('click', function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            document.getElementById('correctMessage').innerHTML = "Oikein! Olet vastannut kaikkiin kysymyksiin!";
            document.getElementById('correctMessage').style.display = "block";
            document.getElementById('continueButton').textContent = "Takaisin alkuun";
            document.getElementById('continueButton').addEventListener('click', resetGame);
        }
    });

    function resetGame() {
        selectionContainer.style.display = 'block';
        container.style.display = 'none';
        document.getElementById('continueButton').textContent = "Jatka";
        document.getElementById('continueButton').removeEventListener('click', resetGame);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Add styling for the selection buttons

});
