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
            let formattedTableName = tableName
                .replace(/_/g, " ")
                .replace(/\b\w/g, char => char.toUpperCase());
    
            const tableHeader = document.createElement("h3");
            tableHeader.textContent = formattedTableName;
            wordList.appendChild(tableHeader);
    
            const ul = document.createElement("ul");
    
            wordsByTable[tableName].forEach(entry => {
                const li = document.createElement("li");
                li.textContent = entry.word; // Käytetään vain sanan tekstiä
                li.style.cursor = "pointer"; 
    
                li.addEventListener("click", function () {
                    if (entry.audio) {
                        const audioElement = new Audio(entry.audio);
                        audioElement.play();
                    } else {
                        console.warn("Ei äänitiedostoa saatavilla tälle sanalle:", entry.word);
                    }
                });
    
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
