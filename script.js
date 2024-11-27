
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
		{ name: "Player1", mark: player1Mark },
		{ name: "Player2", mark: player2Mark },
	];

	let count = 0; // Start with Player1

	function nextTurn() {
		console.log(`It's ${players[count].name}'s turn.`);
		return players[count]; // Return current player object
	}

	function updateBoard(row, col) {
		const currentPlayer = nextTurn();
		playerMark(array, currentPlayer.mark, row, col); // Update board
		const winner = winCheck(array, player1Mark, player2Mark);

		if (winner) {
			console.log(`${winner} wins!`);
			resetGame(array); // Reset the game
			return;
		}

		if (checkDraw(array)) {
			console.log("It's a draw!");
			resetGame(array); // Reset the game
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

	// Example flow: Replace with user input or interaction
	updateBoard(0, 0); // Player1 marks (row 0, col 0)
	updateBoard(1, 1); // Player2 marks (row 1, col 1)
	updateBoard(0, 1); // Player1 marks (row 0, col 1)
	updateBoard(2, 2); // Player2 marks (row 2, col 2)
}



let playerThatGoesFirst = "Player1";
let playerThatGoesSecond = "Player2";

function resetGame(array) {
	// Clear the board
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			array[i][j] = null;
		}
	}

	// Swap players when round ends, so that the both players get equal chance.
	[playerThatGoesFirst, playerThatGoesSecond] = [playerThatGoesSecond, playerThatGoesFirst];

	console.log(`Next round: ${playerThatGoesFirst} starts.`);
}





// Example usage : 
const board = gameBoard(); // Create a new board.

playerMark(board, "X", 0, 0); // Mark the top-left corner with "X".
console.log(board); // Check the board after marking.

playerMark(board, "O", 0, 0); // Try to mark the same cell with "O".




























/* Scalability for winCheck : 

function winCheck(array, players) {
	const gridSize = array.length; // Size of the grid (e.g., 3 for a 3x3 grid)
  
	// Check rows
	for (let i = 0; i < gridSize; i++) {
	  for (let player of players) {
		if (array[i].every(cell => cell === player.mark)) {
		  return player.mark;  // Winner found
		}
	  }
	}
  
	// Check columns
	for (let j = 0; j < gridSize; j++) {
	  for (let player of players) {
		if (array.every(row => row[j] === player.mark)) {
		  return player.mark;  // Winner found
		}
	  }
	}
  
	// Check diagonals (two diagonals in any grid)
	if (array.every((row, idx) => row[idx] === players[0].mark)) {
	  return players[0].mark;  // Winner found
	}
	if (array.every((row, idx) => row[gridSize - 1 - idx] === players[0].mark)) {
	  return players[0].mark;  // Winner found
	}
  
	return null;  // No winner yet
  }

  */