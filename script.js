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

    
    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = cell();
            }
        }
    }

    const cellIsAvailable = (row, column) => !!board[row][column].getValue();
    
    return {
        getBoard,
        getAvailableCells,
        cellIsAvailable,
        printBoard,
        resetBoard,
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
            restart();
            return;
        }
        
        if (board.cellIsAvailable(row, column)) {
            board.createMark(row, column, currentPlayer);
        } else {
            const yeah = board.getBoard();
            console.log(yeah[row][column].getValue());
            return;
        }
        
        const winner = checkWinner(currentPlayer);
        if (winner) {
            console.log((currentPlayer === 1 ? "X" : "O") + " won");
            restart();
            gameOver = true;
            return;
        } 

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    };  

    const restart = () => {
        board.resetBoard();
        currentPlayer = 1;
    }

    const getCurrentPlayer = () => currentPlayer;
    
    
    return {
        playRound,
        restart,
        getCurrentPlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard
    }
}

const screenController = () => {
    // HTML elements
    const HTMLboard = document.getElementById("board");
    const restartGameBtn = document.getElementById("reset-game-btn");
    const restartGameDialog = document.getElementById("reset-game-popup");
    const confirmRestartGame = document.getElementById("confirm-restart");
    const cancelRestartGame = document.getElementById("cancel-restart");
    const winnerDialog = document.getElementById("winner-dialog");
    const confirmNewGame = document.getElementById("new-game-confirm");
    const gtfOut = document.getElementById("new-game-gtf-out");
    const turnIndicator = document.getElementById("turn-indicator");
    
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
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        
        game.resetBoard();
        game.playRound(row, column);
        updateScreen();
    }
    
    const clearAll = () => {

        HTMLboard.innerHTML = "";    
        game.resetBoard();
    }

    HTMLboard.addEventListener('click', clickhandler);
    
    updateScreen();
    
}

screenController();
