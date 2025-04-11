document.addEventListener("DOMContentLoaded", function () {
    let playbackRate = 1;
    let selectorExists = false;
    
    function createPlaybackRateSelector() {
        if (!selectorExists) {
            const selector = document.createElement("select");
            selector.innerHTML = `
                <option value="1">Normaali</option>
                <option value="0.75">Hidastettu</option>
                <option value="0.5">Hitain</option>
            `;
            selector.addEventListener("change", function () {
                playbackRate = parseFloat(this.value);
            });
            document.getElementById("dictionary-container").prepend(selector);
            selectorExists = true;
        }
    }
    
    async function fetchWords() {
        try {
            const response = await fetch(`http://localhost/Edulingo/edulingo_api/get_words.php`);
            const wordsByTable = await response.json();
            console.log("API Response:", wordsByTable); 
            displayWords(wordsByTable);
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    }
    

    function correctTableName(tableName) {
        const corrections = {
            "apuvalineet": "Apuvälineet",
            "verbeja": "Verbejä",
            "keho": "Keho",
  
        };
        return corrections[tableName] || tableName;
    }
    
    function displayWords(wordsByTable) {
        const wordList = document.getElementById("word-list");
        wordList.innerHTML = "";
    
        Object.keys(wordsByTable).forEach(tableName => {
            let formattedTableName = tableName.replace(/_/g, " ");
            formattedTableName = correctTableName(formattedTableName);
    
            const tableHeader = document.createElement("h3");
            tableHeader.textContent = formattedTableName;
            wordList.appendChild(tableHeader);
    
            const ul = document.createElement("ul");
    
            wordsByTable[tableName].forEach(entry => {
                const li = document.createElement("li");
                li.textContent = entry.word;
                li.style.cursor = "pointer"; 
                const audioElement = new Audio(entry.audio);
                li.addEventListener("click", function () {
                    if (entry.audio) {
                        audioElement.playbackRate = playbackRate;
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
        createPlaybackRateSelector();
        document.getElementById("dictionary-container").classList.add("show");
    });

    document.getElementById("close-button").addEventListener("click", function () {
        document.getElementById("dictionary-container").classList.remove("show");
    });
});