const audioButton = document.getElementById("playAudioButton"); 
const audioElement = document.getElementById("audioPlayer"); 
const undoButton = document.getElementById("undo-button");

let selectedLetters = []; 
let currentInput = "";
let correctWord = "";
let shuffledLetters = [];

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
    if (!word) return [];
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

function selectLetter(letter, element, index) {
    currentInput += letter;
    selectedLetters.push({ letter, element, index }); 
    document.getElementById("word-container").textContent = currentInput;
    element.style.visibility = "hidden"; 

    undoButton.style.display = "block";

    checkAnswer();
}

function undoLastSelection() {
    if (selectedLetters.length > 0) {
        const lastSelection = selectedLetters.pop(); 
        currentInput = currentInput.slice(0, -1); 
        document.getElementById("word-container").textContent = currentInput;
        lastSelection.element.style.visibility = "visible"; 
    }

    if (selectedLetters.length === 0) {
        undoButton.style.display = "none";
    }
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

async function startGame() {
    const table = "verbeja";//Muuta niin, että kaikki pöydät käytettävissä!!
    const wordData = await fetchRandomWord(table);

    console.log("Fetched word data:", wordData);

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

undoButton.addEventListener("click", undoLastSelection);
document.getElementById("reset-button").addEventListener("click", startGame);
startGame();
