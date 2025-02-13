document.addEventListener("DOMContentLoaded", function () {
    async function fetchWords() {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/get_words.php`);
            const wordsByTable = await response.json();
            displayWords(wordsByTable);
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    }

    function displayWords(wordsByTable) {
        const wordList = document.getElementById("word-list");
        wordList.innerHTML = "";

        Object.keys(wordsByTable).forEach(tableName => {
            // Create a heading for each table
            const tableHeader = document.createElement("h3");
            tableHeader.textContent = tableName;
            wordList.appendChild(tableHeader);

            // Create a list for words in this table
            const ul = document.createElement("ul");

            wordsByTable[tableName].sort().forEach(word => {
                const li = document.createElement("li");
                li.textContent = word;
                ul.appendChild(li);
            });

            wordList.appendChild(ul);
        });
    }

    document.getElementById("dictionary-button").addEventListener("click", function () {
        fetchWords();
        document.getElementById("dictionary-container").classList.add("show");
    });

    document.getElementById("close-button").addEventListener("click", function () {
        document.getElementById("dictionary-container").classList.remove("show");
    });
});
