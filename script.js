// this factory function creates the cells

const cell = function() {
    let value = "";
    
    const addMark = (playerValue) => {
        value = playerValue == 1 ? "X" : "O";
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

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board;
        
        for(let i = 0; i < boardWithCellValues.length; i++) {
            boardWithCellValues[i] = boardWithCellValues[i].map(cell => cell.getValue());
        }  

        console.log(boardWithCellValues);
    }

    const createMark = function(row, column, player) {
        board[row][column].addMark(player);  
    }

    return {
        getBoard,
        printBoard,
        createMark
    }
}

board = gameBoard();
board.createMark(0, 0, 2);
board.printBoard();