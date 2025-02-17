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
            // Muotoillaan taulun nimi
            let formattedTableName = tableName
                .replace(/_/g, " ") // Korvataan alaviivat väleillä
                .replace(/\b\w/g, char => char.toUpperCase()); 
    
            const tableHeader = document.createElement("h3");
            tableHeader.textContent = formattedTableName;
            wordList.appendChild(tableHeader);
    

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
