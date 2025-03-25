document.addEventListener("DOMContentLoaded", () => {
    class HangmanGame {
        constructor() {
            this.selectedWord = "";
            this.hint = "";
            this.guessedLetters = [];
            this.incorrectGuesses = 0;
            this.maxGuesses = 6;
            this.gameOver = false;
            
            this.wordDisplay = document.getElementById("word-display");
            this.hintDisplay = document.getElementById("hint");
            this.messageDisplay = document.getElementById("message");
            this.hangmanImage = document.getElementById("hangman-image");
            this.lettersContainer = document.getElementById("letters-container");
            this.resetButton = document.getElementById("reset-button");

            this.resetButton.addEventListener("click", () => this.initializeGame());
            this.initializeGame();
        }

        fadeIn(element) {
            element.style.opacity = 0;
            element.style.display = "block";
            let opacity = 0;
            const fadeInterval = setInterval(() => {
                if (opacity < 1) {
                    opacity += 0.05;
                    element.style.opacity = opacity;
                } else {
                    clearInterval(fadeInterval);
                }
            }, 50);
        }

        async fetchWords() {
            try {
                console.log("Fetching words.json via HTTP...");
                const response = await fetch('words.json');
                if (!response.ok) throw new Error('Failed to load words');
                const data = await response.json();
                console.log("Words fetched successfully:", data);
                return data;
            } catch (error) {
                console.error("Error fetching words:", error);
                return [];
            }
        }

        async initializeGame() {
            this.gameOver = false;
            const words = await this.fetchWords();
            if (words.length === 0) return;

            const randomEntry = words[Math.floor(Math.random() * words.length)];
            this.selectedWord = randomEntry.word.toUpperCase();
            this.hint = randomEntry.hint;
            this.guessedLetters = [];
            this.incorrectGuesses = 0;
            this.updateGameState();
        }

        updateGameState() {
            this.hintDisplay.textContent = `Hint: ${this.hint}`;
            this.wordDisplay.textContent = this.selectedWord.split('').map(letter => this.guessedLetters.includes(letter) ? letter : '_').join(' ');
            this.hangmanImage.src = `images/${this.incorrectGuesses}.png`;
            this.fadeIn(this.hangmanImage);
            this.messageDisplay.textContent = "";

            if (this.gameOver) {
                this.lettersContainer.innerHTML = "";
                return;
            }

            this.lettersContainer.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => 
                `<button class='letter-btn' onclick='game.guessLetter("${letter}")' ${this.guessedLetters.includes(letter) ? "disabled" : ""}>${letter}</button>`
            ).join('');
        }

        guessLetter(letter) {
            if (this.gameOver || this.guessedLetters.includes(letter)) return;
            this.guessedLetters.push(letter);
            if (this.selectedWord.includes(letter)) {
                if (this.selectedWord.split('').every(l => this.guessedLetters.includes(l))) {
                    this.messageDisplay.textContent = "You Win!";
                    this.gameOver = true;
                }
            } else {
                this.incorrectGuesses++;
                if (this.incorrectGuesses >= this.maxGuesses) {
                    this.messageDisplay.textContent = "Game Over! The word was " + this.selectedWord;
                    this.gameOver = true;
                }
            }
            this.updateGameState();
        }
    }

    // Create an instance of the HangmanGame object
    window.game = new HangmanGame();
});
