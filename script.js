

let gameActive = true;

const resultType = document.querySelector('.result-type');
const winnerDisplay = document.querySelector('.winner');
const endResult = document.querySelector('.end-result');
const restartBtn = document.querySelector('.restart-btn');


function gameBoard() {
	const array = [];

	for (let i = 0; i < 3; i++) {
		// Each row is an empty array.
		array[i] = [];
		for (let j = 0; j < 3; j++) {
			// Here it's like array[i] which itself is an array with multiple elements inside it.
			// SO, it's accessing 2 arrays at once, with this syntax..

			// When we write array[i][j], we are:

			// Accessing the i-th element of the outer array (array[i]).
			// Then, within that array[i] (which itself is an array), we’re accessing the j-th element.

			// Each null is empty cell.
			array[i][j] = null;
		}
	}
	return array;
}

function playerMark(array, mark, index1, index2) {
	// Sanity check at first : 
	// The game state (array) is updated only if the move is valid. But this function doesn’t know or handle the DOM -- [1] refer [2]
	if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array[1].length) {
		// If index out of bounds, do nothing.
		return;
	}

	// If all indices are correct, proceed.

	if (array[index1][index2] !== null) {
		// If cell is already occupied then alert user 
		alert("Mark an empty cell !!");
	} else {
		// Place the player's mark in empty cell.
		array[index1][index2] = mark;
	}
}

// Win condition check : 
// I've put another function at the very bottom, for scalability purposes. If we had more than 2 players, we use that function.

function winCheck(array, player1Mark, player2Mark) {
	// Check horizontal lines
	for (let i = 0; i < 3; i++) {
		if (array[i][0] === player1Mark && array[i][1] === player1Mark && array[i][2] === player1Mark) {
			return player1Mark;  // Player 1 wins
		} else if (array[i][0] === player2Mark && array[i][1] === player2Mark && array[i][2] === player2Mark) {
			return player2Mark;  // Player 2 wins
		}
	}

	// Check vertical lines
	for (let j = 0; j < 3; j++) {
		if (array[0][j] === player1Mark && array[1][j] === player1Mark && array[2][j] === player1Mark) {
			return player1Mark;  // Player 1 wins
		} else if (array[0][j] === player2Mark && array[1][j] === player2Mark && array[2][j] === player2Mark) {
			return player2Mark;  // Player 2 wins
		}
	}

	// Check diagonals
	if (array[0][0] === player1Mark && array[1][1] === player1Mark && array[2][2] === player1Mark) {
		return player1Mark;  // Player 1 wins
	} else if (array[0][0] === player2Mark && array[1][1] === player2Mark && array[2][2] === player2Mark) {
		return player2Mark;  // Player 2 wins
	}
	if (array[0][2] === player1Mark && array[1][1] === player1Mark && array[2][0] === player1Mark) {
		return player1Mark;  // Player 1 wins
	} else if (array[0][2] === player2Mark && array[1][1] === player2Mark && array[2][0] === player2Mark) {
		return player2Mark;  // Player 2 wins
	}

	return null;  // No winner yet
}

// Check for draw

function checkDraw(array) {
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; i++) {
			if (array[i][j] === null) {
				return false;
			}
		}
	}
	return true;
}



// This will keep the game flow.

function gameFlow(array, player1Mark, player2Mark) {

	const players = [
		{ name: "Player 1", mark: player1Mark },
		{ name: "Player 2", mark: player2Mark },
	];

	let count = 0; // Start with Player1

	function nextTurn() {
		console.log(`It's ${players[count].name}'s turn.`);
		return players[count]; // Return current player object
	}

	function updateBoard(row, col) {

		// Prevent further moves if game is inactive
		if (!gameActive) return;

		const currentPlayer = nextTurn();
		playerMark(array, currentPlayer.mark, row, col); // Update board
		const winner = winCheck(array, player1Mark, player2Mark);

		if (winner) {
			gameActive = false; // Set the flag first
			resultType.textContent = "Winner!";
			winnerDisplay.textContent = `${currentPlayer.name} (${currentPlayer.mark})`;
			endResult.style.visibility = 'visible';
			// Then reset the game
			return;
		}

		if (checkDraw(array)) {
			gameActive = false;
			resultType.textContent = "It's a draw!";
			winnerDisplay.textContent = "";
			endResult.style.visibility = 'visible';
			return;
		}

		/*
			Use a simple formula like count = 1 - count to toggle between the two indices.
			For example:
			If count = 0, 1 - 0 = 1 → switches to Player2.
			If count = 1, 1 - 1 = 0 → switches back to Player1.
		*/

		count = 1 - count;
	}
	return updateBoard;
}

let playerThatGoesFirst = "Player1";
let playerThatGoesSecond = "Player2";



// Initialize the board container
const boardContainer = document.querySelector('.board');

// Get the gameBoard array
const board = gameBoard();
const updateBoard = gameFlow(board, "X", "O");

// Render cells dynamically
for (let i = 0; i < board.length; i++) {
	for (let j = 0; j < board[i].length; j++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		cell.dataset.row = i;
		cell.dataset.col = j;
		boardContainer.appendChild(cell);
	}
}


// Add event listeners to each cell
const cells = document.querySelectorAll('.cell');
cells.forEach((cell) => {
	cell.addEventListener('click', (event) => {
		const row = parseInt(event.target.dataset.row, 10);
		const col = parseInt(event.target.dataset.col, 10);

		// Call the returned updateBoard function

		//[2] The DOM update logic is outside of playerMark—in the updateBoard function and the event listener. 
		// In this code:

		// The click event triggers the listener.
		// The listener extracts the row and col and passes them to updateBoard.
		// Regardless of whether playerMark allows or rejects the move:
		// The DOM (event.target.textContent) is updated with the mark from board.

		// Therefore, check if's its valid move or not before updating the DOM.

		if (board[row][col] === null) {
			updateBoard(row, col);
			// Update cell display
			const currentPlayerMark = board[row][col]; // Get the mark
			event.target.textContent = currentPlayerMark;
		}
		else {
			alert("You Blind ?");
		}
	});
});

// The issue in your resetGame function is that the board array being cleared inside the function is not the same board array passed to the updateBoard function in gameFlow. This mismatch causes the game state to behave incorrectly after resetting.

// Therefore, Pass the board array explicitly to resetGame:
// Update the resetGame function call in the event listener to explicitly pass the board array.

// Objects (including arrays) are passed by reference:
// When you pass the board array to a function, you're passing a reference to the same object in memory. This means modifications made to board inside resetGame directly affect the original array.

restartBtn.addEventListener('click', () => resetGame(board));

// You can remove this arg completely and it'd work. But for better scalability, it's much better that you keep this arg, so that ANY board can be cleared.
function resetGame(board) {
	// Clear the board array
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			board[i][j] = null;
		}
	}

	// Empty all the cells i.e; DOM elements visible.
	cells.forEach((cell) => {
		cell.textContent = '';
	})

	// Reset result display
	resultType.textContent = "";
	winnerDisplay.textContent = "";
	endResult.style.visibility = "hidden";

	// Swap players for fairness
	[playerThatGoesFirst, playerThatGoesSecond] = [playerThatGoesSecond, playerThatGoesFirst];

	console.log(`Next round: ${playerThatGoesFirst} starts.`);
	gameActive = true; // Reset the gameActive flag
}

