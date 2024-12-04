
Scalability for winCheck : 

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
