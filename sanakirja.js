document.addEventListener("DOMContentLoaded", function () {
    async function fetchWords() {
        try {
            const response = await fetch('http://localhost/Edulingo/edulingo_api/get_words.php');
            const words = await response.json();
            displayWords(words);
        } catch (error) {
            console.error('Error fetching words:', error);
        }
    }

    function displayWords(words) {
        const wordList = document.getElementById("word-list");
        wordList.innerHTML = "";
        words.sort().forEach(word => {
            const li = document.createElement("li");
            li.textContent = word;
            wordList.appendChild(li);
        });
    }

    document.getElementById("dictionary-button").addEventListener("click", function () {
        document.getElementById("dictionary-container").classList.add("show");
    });

    document.getElementById("close-button").addEventListener("click", function () {
        document.getElementById("dictionary-container").classList.remove("show");
    });

    fetchWords();
});
