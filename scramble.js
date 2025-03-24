document.addEventListener("DOMContentLoaded", () => {

    let selectedTable = "";
    const gameContainer = document.getElementById("game-container");
    const audioElement = document.getElementById("audioPlayer");
    const audioButton = document.getElementById("playAudioButton");
     
    const undoButton = document.getElementById("undo-button");

    gameContainer.style.display = "none";

    const tableSelectionContainer = document.createElement("div");
    tableSelectionContainer.id = "table-selection-container";
    tableSelectionContainer.innerHTML = "<h1>Valitse opittava aihe</h1>";
    document.body.insertBefore(tableSelectionContainer, gameContainer);

    const tables = ["keho", "apuvalineet", "verbeja"];

    tables.forEach(table => {
        const button = document.createElement("button");
        button.textContent = table.charAt(0).toUpperCase() + table.slice(1);
        button.onclick = () => {
            selectedTable = table;
            startGame(selectedTable);
        };
        
        tableSelectionContainer.appendChild(button);
    });

    async function fetchRandomWord(table) {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/get_rnd_word.php?table=${table}`);
            const data = await response.json();

            if (data.error) {
                console.error("Error fetching word:", data.error);
                return null;
            }
            return data;
        } catch (error) {
            console.error("Error fetching word:", error);
            return null;
        }
    }

    function shuffleWord(word) {
        return word.split("").sort(() => Math.random() - 0.5);
    }

    function displayLetters() {
        const letterContainer = document.getElementById("letters");
        letterContainer.innerHTML = "";

        shuffledLetters.forEach((letter, index) => {
            const span = document.createElement("span");
            span.classList.add("letter-box");
            span.textContent = letter;
            span.onclick = () => selectLetter(letter, span, index);
            letterContainer.appendChild(span);
        });
    }

    function checkAnswer() {
        if (currentInput === correctWord) {
            document.getElementById("message").textContent = "Oikein!";
            undoButton.style.display = "none";
        } else if (currentInput.length === correctWord.length) {
            let sortedInput = currentInput.split("").sort().join("");
            let sortedCorrect = correctWord.split("").sort().join("");
    
            if (sortedInput === sortedCorrect) {
                document.getElementById("message").textContent = "Väärin!";
            }
        }
    }
    
    function selectLetter(letter, element, index) {
        currentInput += letter;
        selectedLetters.push({ letter, element, index });
        document.getElementById("word-container").textContent = currentInput;
        element.style.visibility = "hidden";
    
        undoButton.style.display = "block";
    
        checkAnswer();
    }
    
    async function startGame(table) {
        tableSelectionContainer.style.display = "none";
        gameContainer.style.display = "block";

        const wordData = await fetchRandomWord(table);
        if (!wordData || !wordData.answer) {
            document.getElementById("message").textContent = "Error loading word!";
            return;
        }

        correctWord = wordData.answer.trim();
        shuffledLetters = shuffleWord(correctWord);

        if (wordData.audio) {
            audioElement.src = wordData.audio;
            audioButton.style.display = "block";
        } else {
            audioButton.style.display = "none";
        }
        

        currentInput = "";
        selectedLetters = [];
        document.getElementById("word-container").textContent = "";
        document.getElementById("message").textContent = "";
        undoButton.style.display = "none";

        displayLetters();
    }


    audioButton.addEventListener("click", () => {
        if (audioElement.src) {
            audioElement.play().catch(error => console.error("Audio play error:", error));
        }
    });
    document.getElementById("reset-button").addEventListener("click", () => {
        startGame(selectedTable); // Make sure 'selectedTable' stores the last used category
    });
});