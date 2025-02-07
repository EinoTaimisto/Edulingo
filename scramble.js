const words = ["rasvata", "taluttaa", "jakaa", "kuivata", "harjata", "työntää", "leikata", "hikoilla"];
        let correctWord = "";
        let shuffledLetters = [];
        let currentInput = "";

        function shuffleWord(word) {
            return word.split("").sort(() => Math.random() - 0.5);
        }

        function startGame() {
            correctWord = words[Math.floor(Math.random() * words.length)];
            shuffledLetters = shuffleWord(correctWord);
            currentInput = "";
            document.getElementById("word-container").textContent = "";
            document.getElementById("message").textContent = "";
            displayLetters();
        }

        function displayLetters() {
            const letterContainer = document.getElementById("letters");
            letterContainer.innerHTML = "";
            shuffledLetters.forEach(letter => {
                const span = document.createElement("span");
                span.classList.add("letter-box");
                span.textContent = letter;
                span.onclick = () => selectLetter(letter, span);
                letterContainer.appendChild(span);
            });
        }

        function selectLetter(letter, element) {
            currentInput += letter;
            document.getElementById("word-container").textContent = currentInput;
            element.style.visibility = "hidden";
            checkAnswer();
        }

        function checkAnswer() {
            if (currentInput === correctWord) {
                document.getElementById("message").textContent = "Oikein!";
            }
        }

        function resetGame() {
            startGame();
        }

        startGame();