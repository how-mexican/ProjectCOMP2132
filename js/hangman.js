document.addEventListener("DOMContentLoaded", () => {
    let selectedWord = "";
    let hint = "";
    let guessedLetters = [];
    let incorrectGuesses = 0;
    const maxGuesses = 6;
    
    const wordDisplay = document.getElementById("word-display");
    const hintDisplay = document.getElementById("hint");
    const messageDisplay = document.getElementById("message");
    const hangmanImage = document.getElementById("hangman-image");
    const lettersContainer = document.getElementById("letters-container");
    const resetButton = document.getElementById("reset-button");
    
    async function fetchWords() {
        try {
            const response = await fetch('words.json');
            if (!response.ok) throw new Error('Failed to load words');
            return await response.json();
        } catch (error) {
            console.error("Error fetching words:", error);
            return [];
        }
    }
    
    async function initializeGame() {
        const words = await fetchWords();
        if (words.length === 0) return;
        
        const randomEntry = words[Math.floor(Math.random() * words.length)];
        selectedWord = randomEntry.word.toUpperCase();
        hint = randomEntry.hint;
        guessedLetters = [];
        incorrectGuesses = 0;
        updateGameState();
    }
    
    function updateGameState() {
        hintDisplay.textContent = `Hint: ${hint}`;
        wordDisplay.textContent = selectedWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
        hangmanImage.src = `img/${incorrectGuesses}.png`;
        messageDisplay.textContent = "";
        lettersContainer.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => 
            `<button class='letter-btn' onclick='guessLetter("${letter}")' ${guessedLetters.includes(letter) ? "disabled" : ""}>${letter}</button>`
        ).join('');
    }
    
    window.guessLetter = function(letter) {
        if (guessedLetters.includes(letter)) return;
        guessedLetters.push(letter);
        if (selectedWord.includes(letter)) {
            if (selectedWord.split('').every(l => guessedLetters.includes(l))) {
                messageDisplay.textContent = "You Win!";
                lettersContainer.innerHTML = "";
            }
        } else {
            incorrectGuesses++;
            if (incorrectGuesses >= maxGuesses) {
                messageDisplay.textContent = "Game Over! The word was " + selectedWord;
                lettersContainer.innerHTML = "";
            }
        }
        updateGameState();
    }
    
    resetButton.addEventListener("click", initializeGame);
    initializeGame();
});
