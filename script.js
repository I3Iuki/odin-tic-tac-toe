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
        if (getAvailableCells().includes(`${row}${column}`)) {
            board[row][column].addMark(player);  
        } else {
            console.log("Not an available space.");
        }
    }

    const checkWinner = (currentPlayer) => {
        const currentSymbol = currentPlayer === 1 ? "X" : "O";
        for (let i = 0; i < 8; i++) {
            const cur = winConditions[i];
            if (
                board[cur[0][0]][cur[0][1]].getValue() === currentSymbol && 
                board[cur[1][0]][cur[1][1]].getValue() === currentSymbol && 
                board[cur[2][0]][cur[2][1]].getValue() === currentSymbol
            ){ return true;}
        }

        return false;
        
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = cell()
            }
        }
    }
    
    return {
        getBoard,
        getAvailableCells,
        printBoard,
        resetBoard,
        createMark,
        checkWinner
    }
}

const gameController = function() {
    const board = gameBoard();
    let currentPlayer = 1;
    let gameOver = false;

    const playRound = (row, column) => {
        if (gameOver) return;   

        board.createMark(row, column, currentPlayer);

        const winner = board.checkWinner(currentPlayer);
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

    return {
        playRound,
        restart,
        
    }
}

let game = gameController();