document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("memory-board");
    const matchedList = document.getElementById("matched-list");
    
    const attemptsDisplay = document.createElement("p");
    attemptsDisplay.innerHTML = `Väärät yritykset: <span id="attempts-count">0</span>`;
    
    document.body.appendChild(attemptsDisplay); 

    let flippedCards = [];
    let matchedCards = [];
    let isChecking = false;
    let wrongAttempts = 0;
    let maxTries = 10;
    let gameWon = false;

    async function fetchImages() {
        try {
            const response = await fetch("http://localhost/Edulingo/edulingo_api/memorygame.php");
            const data = await response.json();

            if (data.length === 0) {
                console.error("No images found in the database.");
                return [];
            }

            return data.map(item => ({
                image: item.image,
                name: item.name,
                audio: item.audio
            }));
        } catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    }

    async function createBoard() {
        gameBoard.innerHTML = "";
        matchedList.innerHTML = "";
        wrongAttempts = 0; 
        updateAttemptsDisplay(); 

        let imageData = await fetchImages();
        console.log("Fetched Image Data:", imageData); 
        if (imageData.length === 0) {
            console.error("No images to display. Board will not be created.");
            return;
        }

        let shuffledCards = [...imageData, ...imageData].sort(() => Math.random() - 0.5);
        console.log("Shuffled Cards:", shuffledCards); 

        shuffledCards.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.image = item.image;
            card.dataset.name = item.name;
            card.dataset.audio = item.audio;

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.classList.add("hidden");

            card.appendChild(img);
            card.addEventListener("click", () => handleCardClick(card, img));
            gameBoard.appendChild(card);
        });
    }

    function handleCardClick(card, img) {
        if (flippedCards.includes(card) || flippedCards.length >= 2 || isChecking || gameWon) return;

        img.classList.remove("hidden");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            isChecking = true;
            setTimeout(checkMatch, 800);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.image === card2.dataset.image) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);

            playAudio(card1.dataset.audio);
            displayWinInfo(card1.dataset.name, card1.dataset.audio);
            flippedCards = []; 

            wrongAttempts = 0;
            updateAttemptsDisplay();
        } else {
            wrongAttempts++;
            updateAttemptsDisplay();
            console.log("Wrong Attempts:", wrongAttempts); 

            setTimeout(() => {
                card1.querySelector("img").classList.add("hidden");
                card2.querySelector("img").classList.add("hidden");
                flippedCards = []; 
            }, 800);
        }

        isChecking = false;
        checkGameStatus();
    }

    function checkGameStatus() {
        if (matchedCards.length === document.querySelectorAll(".card").length) {
            gameWon = true;
            setTimeout(() => alert("🎉 You won!"), 500);
        }

        if (wrongAttempts >= maxTries) {
            setTimeout(() => {
                alert(`❌ ${maxTries} wrong attempts! Restarting...`);
                restartGame();
            }, 500);
        }
    }

    function restartGame() {
        flippedCards = [];
        matchedCards = [];
        wrongAttempts = 0;
        isChecking = false;
        gameWon = false;
        createBoard();
    }

    function playAudio(audioUrl) {
        if (!audioUrl || audioUrl.trim() === "") return;
        let audio = new Audio(audioUrl);
        audio.play();
    }

    function displayWinInfo(name, audioUrl) {
        const winEntry = document.createElement("li");
        winEntry.textContent = name;

        const audioButton = document.createElement("button");
        audioButton.textContent = "🔊 Play Sound";
        audioButton.addEventListener("click", () => playAudio(audioUrl));

        winEntry.appendChild(audioButton);
        matchedList.appendChild(winEntry);
    }

    function updateAttemptsDisplay() {
        document.getElementById("attempts-count").textContent = wrongAttempts;
    }

    createBoard();
});
