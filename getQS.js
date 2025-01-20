//Varmistetaan, että js scripti pyörii vasta koko sivun latauduttua
document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;

    const mysteryImage = document.getElementById('mysteryImage');
    const userAnswerInput = document.getElementById('userAnswer');
    const correctMessage = document.getElementById('correctMessage');
    const wrongMessage = document.getElementById('wrongMessage');
    const inquiryForm = document.getElementById('inquiryForm');
    const continueButton = document.getElementById('continueButton');

    // Apin kautta hakee kysymykset
    async function loadQuestions() {
        try {
            const response = await fetch('http://localhost/Edulingo/edulingo_api/questions.php');
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
        mysteryImage.src = currentQuestion.image;
        userAnswerInput.value = "";
        correctMessage.style.display = "none";
        wrongMessage.style.display = "none";
        continueButton.style.display = "none";
    }

    inquiryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const userAnswer = userAnswerInput.value.trim().toLowerCase();
        const currentQuestion = questions[currentQuestionIndex];

        correctMessage.style.display = "none";
        wrongMessage.style.display = "none";

        if (userAnswer === currentQuestion.answer) {
            correctMessage.innerHTML = `Oikein! ${currentQuestion.explanation}`;
            correctMessage.style.display = "block";
            continueButton.style.display = "block";
        } else {
            wrongMessage.style.display = "block";
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
