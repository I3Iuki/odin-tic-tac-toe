const HTMLboard = document.getElementById("board");
const restartGameBtn = document.getElementById("restart-game-btn");
const restartGameDialog = document.getElementById("restart-game-popup");
const confirmRestartGame = document.getElementById("confirm-restart");
const cancelRestartGame = document.getElementById("cancel-restart");
const winnerDialog = document.getElementById("winner-popup");
const confirmNewGame = document.getElementById("new-game-confirm");
const gtfOut = document.getElementById("new-game-gtf-out");
const turnIndicator = document.getElementById("turn-indicator");

// this factory function creates the cells

const cell = function() {
    let value = "";
    
    const addMark = (playerValue) => {
        value = playerValue === 1 ? "X" : "O";
    }
    
    const getValue = () => value;
    
    return {
        addMark, 
        getValue
    };
}

// this factory function creates the gameboard

const gameBoard = function() {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(cell());
        }
    }

    const getAvailableCells = () => {
        let availableCells = [];
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board[i][j].getValue()) {
                    availableCells.push(`${i}${j}`);
                }
            }
        } 

        return availableCells;
    }
    
    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue())); 

        console.log(boardWithCellValues);
    }

    const createMark = function(row, column, player) {
        board[row][column].addMark(player);  
    }

    
    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = cell();
            }
        }
    }

    const cellIsAvailable = (row, column) => board[row][column].getValue() === "";
    
    return {
        getBoard,
        getAvailableCells,
        cellIsAvailable,
        printBoard,
        clearBoard,
        createMark
    }
}

const gameController = function() {
    const board = gameBoard();
    const winConditions = [
        // rows
        [
            [0, 0],
            [0, 1],
            [0, 2]
        ],
        [
            [1, 0],
            [1, 1],
            [1, 2]
        ],
        [
            [2, 0],
            [2, 1],
            [2, 2]
        ],
        // columns
        [
            [0, 0],
            [1, 0],
            [2, 0]
        ],
        [
            [0, 1],
            [1, 1],
            [2, 1]
        ],
        [
            [0, 2],
            [1, 2],
            [2, 2]
        ],
        // diagonals
        [
            [0, 0],
            [1, 1],
            [2, 2]
        ],
        [
            [0, 2],
            [1, 1],
            [2, 0]
        ]
    ];  

    
    let currentPlayer = 1;
    let gameOver = false;

    
    const checkWinner = (currentPlayer) => {
        const currentSymbol = currentPlayer === 1 ? "X" : "O";
        
        for (let i = 0; i < 8; i++) {
            const cur = winConditions[i];
            if (
                board.getBoard()[cur[0][0]][cur[0][1]].getValue() === currentSymbol && 
                board.getBoard()[cur[1][0]][cur[1][1]].getValue() === currentSymbol && 
                board.getBoard()[cur[2][0]][cur[2][1]].getValue() === currentSymbol
            ){ return true;}
        }
    
        return false;
    }

    const randomGridSpace = () => {
        return Math.ceil(Math.random() * 3);
    }
    
    const playRound = (row, column) => {
        if (gameOver) {
            return;
        }   
        
        if (board.cellIsAvailable(row, column)) {
            board.createMark(row, column, currentPlayer);
        } else {
            const yeah = board.getBoard();
            console.log(row + " " + column + " :" + yeah[row][column].getValue());
            return;
        }
        
        const winner = checkWinner(currentPlayer);

        if (winner) {
            gameOver = true;
            winnerDialog.querySelector("p").textContent = `${currentPlayer === 1 ? "Player 1" : "Player 2"} won!`
            winnerDialog.showModal();
            return;
        } 

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    };  

    const restart = () => {
        board.clearBoard();
        currentPlayer = 1;
        gameOver = false;
    }

    const getCurrentPlayer = () => currentPlayer;
        
    return {
        playRound,
        restart,
        getCurrentPlayer,
        getBoard: board.getBoard,
        clearBoard: board.clearBoard
    }
}

const screenController = () => {
    // HTML elements
    
    const game = gameController();
    
    const updateScreen = () => {
        const board = game.getBoard();

        HTMLboard.innerHTML = "";
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const gridSpace = document.createElement("div");
                gridSpace.classList.add("grid-space");
                gridSpace.dataset.row = i;
                gridSpace.dataset.column = j;
                gridSpace.textContent = board[i][j].getValue();
                HTMLboard.append(gridSpace);
            }
        }
        
        turnIndicator.textContent = game.getCurrentPlayer() === 1 ? "Player 1's turn" : "Player 2's turn";
        
        console.log("screen updated");
    }
    
    const clickhandler = (e) => {        
        game.playRound(e.target.dataset.row, e.target.dataset.column);
        updateScreen();
    }

    HTMLboard.addEventListener('click', clickhandler);
    
    restartGameBtn.addEventListener('click', () => {
        restartGameDialog.showModal();        
    });

    confirmRestartGame.addEventListener('click', (e) => {
        e.preventDefault();

        restartGameDialog.close();
        game.restart();

        updateScreen();
    });

    cancelRestartGame.addEventListener('click', (e) => {
        restartGameDialog.close();
    });
    
    confirmNewGame.addEventListener('click', (e) => {
        e.preventDefault();
        
        winnerDialog.close();
        game.restart();
    
        updateScreen();
    });
    
    gtfOut.addEventListener('click', () => {
        console.log("close");
        
    });

    updateScreen();
    
}

screenController();
