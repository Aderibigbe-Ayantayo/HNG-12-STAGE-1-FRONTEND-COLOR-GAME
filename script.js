
const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2', '#FF4500'];
const colorBox = document.getElementById("colorBox");
const colorOptions = document.querySelectorAll(".colorOption");
const gameStatus = document.getElementById("gameStatus");
const scoreElement = document.querySelector("[data-testid='score']");
const newGameButton = document.getElementById("newGameButton");

let targetColor;
let score = 0;
let gameInProgress = true; // Track if the game is still ongoing

// Function to normalize color format to a consistent RGB format
function normalizeColor(color) {
    const tempElement = document.createElement('div');
    tempElement.style.backgroundColor = color;
    document.body.appendChild(tempElement);
    const computedColor = window.getComputedStyle(tempElement).backgroundColor;
    document.body.removeChild(tempElement);
    return computedColor;
}

// Function to start a new game (only resets game state after a loss)
function startNewGame() {
    if (!gameInProgress) {
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        gameStatus.textContent = '';
        gameStatus.classList.remove('fadeOut', 'celebration');  // Remove any previous animations
    }
    // Pick a random target color
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    colorBox.style.backgroundColor = targetColor;

    // Normalize the target color to RGB format for comparison
    const normalizedTargetColor = normalizeColor(targetColor);

    // Generate color options (including the target color)
    let shuffledColors = [...colors];
    shuffledColors.sort(() => Math.random() - 0.5);  // Shuffle colors

    shuffledColors = shuffledColors.slice(0, 5);  // Pick 5 random colors
    shuffledColors.push(targetColor);  // Add the target color
    shuffledColors.sort(() => Math.random() - 0.5);  // Shuffle again to randomize positions

    // Reset the buttons by removing all previous click listeners
    colorOptions.forEach((button) => {
        button.onclick = null;  // Remove existing event listener
    });

    // Assign the colors to the buttons
    colorOptions.forEach((button, index) => {
        button.style.backgroundColor = shuffledColors[index];
        // Normalizing the button color and adding click listener
        button.onclick = () => checkGuess(button.style.backgroundColor, normalizedTargetColor);  // Add click handler
    });

    // Ensure the game is back in progress
    gameInProgress = true;
}

// Function to check if the guess is correct
function checkGuess(guess, normalizedTargetColor) {
    if (!gameInProgress) return; // Stop the game if it has ended

    const normalizedGuess = normalizeColor(guess);

    // Compare the normalized colors
    if (normalizedGuess === normalizedTargetColor) {
        score++;  // Increase score
        scoreElement.textContent = `Score: ${score}`;
        
        // Show the "Correct!" message and trigger celebration animation
        gameStatus.textContent = 'Correct! Well done 🎊🎊🎉🎉';
        gameStatus.style.color = 'green';
        gameStatus.classList.add('celebration');  // Trigger celebration animation

        // Remove the celebration class after animation ends to reset for next animation
        setTimeout(() => {
            gameStatus.classList.remove('celebration');
        }, 1000); // Wait for animation duration (1s)

        // After a short delay, continue to the next round (with the same score)
        setTimeout(startNewGame, 1000);  // Wait for celebration animation before continuing
    } else {
        // If the guess is wrong, the player loses and game resets
        gameInProgress = false;
        gameStatus.textContent = 'Game Over! You lost!';
        gameStatus.style.color = 'red';
        gameStatus.classList.add('fadeOut');  // Trigger fade-out effect for wrong answers

        // Automatically restart the game after a short delay
        setTimeout(() => {
            gameStatus.classList.remove('fadeOut');
            startNewGame(); // Automatically restart the game after a short delay
        }, 1000);
    }
}

const reshuffleButton = document.getElementById("reshuffleButton");  // Get the reshuffle button

// Function to reshuffle color options
function reshuffleColors() {
    if (!gameInProgress) return; // Don't reshuffle if game is over
    
    // Shuffle the colors array
    let shuffledColors = [...colors];
    shuffledColors.sort(() => Math.random() - 0.5); // Shuffle colors
    
    // Reset the color options with new shuffled colors
    colorOptions.forEach((button, index) => {
        button.style.backgroundColor = shuffledColors[index];
        button.onclick = () => checkGuess(button.style.backgroundColor, normalizeColor(targetColor)); // Reattach the event listener
    });
}

// Attach event listener to reshuffle button
reshuffleButton.onclick = reshuffleColors;


// Set up new game button to manually reset the game
newGameButton.onclick = startNewGame;

// Initialize the first game
startNewGame();
