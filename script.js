const boardSize = 10;
const board = document.getElementById("board");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let players = [];
let currentPlayerIndex = 0;
let grid = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
let gameOver = false;

function updatePlayerInputs() {
    document.getElementById("player3-name").style.display = (document.getElementById("playerCount").value == 3) ? "block" : "none";
}

function setPlayers() {
    players = [
        document.getElementById("player1-name").value.trim() || "Player 1",
        document.getElementById("player2-name").value.trim() || "Player 2"
    ];
    if (document.getElementById("playerCount").value == "3") {
        players.push(document.getElementById("player3-name").value.trim() || "Player 3");
    }

    document.getElementById("player-setup").style.display = "none";
    document.getElementById("game-container").style.display = "flex";

    resetGame();
}

function createBoard() {
    board.innerHTML = "";
    grid = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
    gameOver = false;
    currentPlayerIndex = 0;
    updateTurnDisplay();

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => handleClick(row, col, cell));
            board.appendChild(cell);
        }
    }
}

function updateTurnDisplay() {
    document.getElementById("turn").innerText = `⭐ Current Turn: ${players[currentPlayerIndex]}`;
}

function handleClick(row, col, cell) {
    if (grid[row][col] || gameOver) return;
    
    clickSound.play();
    grid[row][col] = currentPlayerIndex + 1;
    cell.classList.add(`player${currentPlayerIndex + 1}`);
    cell.innerText = players[currentPlayerIndex][0].toUpperCase(); // Set first letter of name

    if (checkWin(row, col)) {
        winSound.play();
        document.getElementById("winner-message").innerText = `🎉 ${players[currentPlayerIndex]} Wins!`;
        document.getElementById("winner-popup").style.display = "block";
        gameOver = true;
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurnDisplay();
}

function checkWin(row, col) {
    let player = grid[row][col];

    // Check directions
    return (
        checkDirection(row, col, 1, 0, player) || // Horizontal
        checkDirection(row, col, 0, 1, player) || // Vertical
        checkDirection(row, col, 1, 1, player) || // Diagonal \
        checkDirection(row, col, 1, -1, player)   // Diagonal /
    );
}

function checkDirection(row, col, rowStep, colStep, player) {
    let count = 1;
    for (let step of [-1, 1]) {
        let r = row + step * rowStep, c = col + step * colStep;
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && grid[r][c] === player) {
            count++;
            if (count === 3) return true;
            r += step * rowStep;
            c += step * colStep;
        }
    }
    return false;
}

function resetGame() {
    createBoard();
}

// function resetGame() {
//     document.getElementById("game-container").style.display = "none";  // Hide game board
//     document.getElementById("player-setup").style.display = "block";   // Show player setup form
// }

function closePopup() {
    document.getElementById("winner-popup").style.display = "none";
    resetGame();
}
