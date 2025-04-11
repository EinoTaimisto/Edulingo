document.addEventListener("DOMContentLoaded", () => {
    const themeSelection = document.getElementById("theme-selection");
    const gameBoard = document.getElementById("memory-board");
    const matchedList = document.getElementById("matched-list");
    const matchedItems = document.getElementById("matched-items");
    const restartBtn = document.getElementById("restart-btn");
    const backBtn = document.getElementById("back-btn");

    let flippedCards = [];
    let matchedCards = [];
    let isChecking = false;
    let gameWon = false;
    let currentTheme = "";

    // Event Listeners for Theme Selection
    document.getElementById("verbejä-btn").addEventListener("click", () => startGame("verbeja"));
    document.getElementById("apuvälineet-btn").addEventListener("click", () => startGame("apuvalineet"));
    document.getElementById("keho-btn").addEventListener("click", () => startGame("keho"));

    restartBtn.addEventListener("click", restartGame);
    backBtn.addEventListener("click", returnToSelection);

    function startGame(theme) {
        currentTheme = theme;
        themeSelection.style.display = "none"; 
        gameBoard.style.display = "grid"; 
        matchedItems.style.display = "block";
        restartBtn.style.display = "block"; 
        backBtn.style.display = "block";

        createBoard();
    }

    async function fetchImages() {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/memorygame.php?theme=${encodeURIComponent(currentTheme)}`);
            const data = await response.json();

            if (!data || data.error) { 
                console.error("Error:", data.error || "No images found.");
                alert(`Error: ${data.error || "No images found in the database."}`);
                return [];
            }

            return data.map(item => ({
                image: item.image,
                name: item.name,
                audio: item.audio
            }));
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to load images. Please try again.");
            return [];
        }
    }

    async function createBoard() {
        gameBoard.innerHTML = "";
        matchedList.innerHTML = "";
        
        let imageData = await fetchImages();
        if (imageData.length === 0) {
            console.error("No images to display. Board will not be created.");
            return;
        }

        let shuffledCards = [...imageData, ...imageData].sort(() => Math.random() - 0.5);

        shuffledCards.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");
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

        if (card1.dataset.name === card2.dataset.name) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);

            playAudio(card1.dataset.audio);
            displayWinInfo(card1.dataset.name, card1.dataset.audio);
        } else {
            setTimeout(() => {
                card1.querySelector("img").classList.add("hidden");
                card2.querySelector("img").classList.add("hidden");
            }, 800);
        }

        flippedCards = [];
        isChecking = false;

        checkGameStatus();
    }

    function checkGameStatus() {
        if (matchedCards.length === document.querySelectorAll(".card").length) {
            gameWon = true;
            setTimeout(() => {
                alert("Sait kaikki parit kasattua!");
                returnToSelection();
            }, 500);
        }
    }

    function restartGame() {
        flippedCards = [];
        matchedCards = [];
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
        audioButton.textContent = "🔊";
        audioButton.classList.add("play-sound-btn"); 
        audioButton.addEventListener("click", () => playAudio(audioUrl));
    
        winEntry.appendChild(audioButton);
        matchedList.appendChild(winEntry);
    }
    

    function returnToSelection() {
        themeSelection.style.display = "flex"; 
        gameBoard.style.display = "none"; 
        matchedItems.style.display = "none"; 
        restartBtn.style.display = "none"; 
        backBtn.style.display = "none"; 
    }
});
