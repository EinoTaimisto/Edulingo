document.addEventListener('DOMContentLoaded', () => {
    console.log("hei maailma");
    let questions = [];
    let currentQuestionIndex = 0;

    const Image = document.getElementById('image');
    const userAnswerInput = document.getElementById('userAnswer');
    const correctMessage = document.getElementById('correctMessage');
    const wrongMessage = document.getElementById('wrongMessage');
    const inquiryForm = document.getElementById('inquiryForm');
    const continueButton = document.getElementById('continueButton');
    const audioButton = document.getElementById('playAudioButton'); 
    const audioElement = document.getElementById('audioPlayer'); 

    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('table');
    if (!tableName) {
        alert("Table name is missing in the URL.");
        return;
    }

    async function loadQuestions() {
        console.log("lataa");
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/questions.php?table=${tableName}`);
            questions = await response.json();
            if (questions.length > 0) {
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
        Image.src = currentQuestion.image;
        userAnswerInput.value = "";
        correctMessage.style.display = "none";
        wrongMessage.style.display = "none";
        continueButton.style.display = "none";

       //audio asetukset. Audio soi vasta kun nappula painettu
        if (currentQuestion.audio) {
            audioElement.src = currentQuestion.audio;
            audioButton.style.display = "block"; 
        } else {
            audioButton.style.display = "none"; 
        }
    }
    audioButton.addEventListener('click', function () {
        if (audioElement.src) {
            audioElement.play();
        }
    });

    inquiryForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const currentQuestion = questions[currentQuestionIndex]; 
        const userAnswer = userAnswerInput.value.trim().toLowerCase();
        const correctAnswer = currentQuestion.answer.trim().toLowerCase();

        correctMessage.style.display = "none";
        wrongMessage.style.display = "none";
    
        if (userAnswer === correctAnswer) {
            correctMessage.innerHTML = `Oikein! ${currentQuestion.explanation}`;
            correctMessage.style.display = "block";
            continueButton.style.display = "block";
        } else {
            wrongMessage.style.display = "block";
            userAnswerInput.value = "";
        }
    });

    continueButton.addEventListener('click', function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            correctMessage.innerHTML = "Oikein! Olet vastannut kaikkiin kysymyksiin!";
            correctMessage.style.display = "block";
            continueButton.style.display = "none";
        }
    });

    loadQuestions();
});
