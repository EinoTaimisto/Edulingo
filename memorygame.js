const cardsArray = ["🍎", "🍌", "🍒", "🍇", "🍎", "🍌", "🍒", "🍇", "🥑", "🍉", "🥑", "🍉", "🍋", "🍍", "🍋", "🍍"];
let shuffledCards = [];
let flippedCards = [];
let matchedCards = [];
let wrongAttempts = 0;
let isChecking = false;
let gameWon = false; // New flag to disable clicks after winning

const gameBoard = document.getElementById("gameBoard");

function shuffleCards() {
    shuffledCards = [...cardsArray].sort(() => Math.random() - 0.5);
}

function createBoard() {
    gameBoard.innerHTML = "";
    shuffleCards();
    gameWon = false; // Reset win state
    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        card.addEventListener("click", () => {
            if (!flippedCards.includes(card) && flippedCards.length < 2 && !isChecking && !gameWon) {
                card.textContent = emoji;
                card.classList.add("flipped");
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    isChecking = true;
                    setTimeout(checkMatch, 800);
                }
            }
        });

        gameBoard.appendChild(card);
    });
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedCards.push(card1, card2);
        wrongAttempts = 0;
    } else {
        wrongAttempts++;
        setTimeout(() => {
            card1.textContent = "";
            card2.textContent = "";
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }, 800);
    }

    flippedCards = [];
    isChecking = false;

    if (matchedCards.length === shuffledCards.length) {
        gameWon = true; // Disable further clicks
        setTimeout(() => alert("🎉 You won!"), 500);
    }

    if (wrongAttempts >= 4) {
        setTimeout(() => {
            alert("❌ 4 wrong attempts in a row! Restarting the game...");
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

createBoard();