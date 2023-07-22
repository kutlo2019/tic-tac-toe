function GameBoard() {
    const _columns = 3;
    const _rows = 3;
    const _board = [];

    for (let i = 0; i < _rows; i++) {
        _board[i] = [];
        for (let j = 0; j < _columns; j++) {
            _board[i].push(Cell());
        }
    }

    const getBoard = () => _board;

    const dropToken = (row, column, playerToken) => {
        if (_board[row][column].getValue() === "") {
            // If the cell is empty add the current player's token
            _board[row][column].setValue(playerToken);
        } else {
            // If there is something in the cell
            return;
        }
    }

    const printBoard = () => {
        const board = _board.map(row => row.map(cell => cell.getValue()));
        console.table(board);
    }

    return {getBoard, printBoard, dropToken}
}

function Cell() {
    // To start as empty strying ""
    let value = "";

    const setValue = (playerToken) => {
        value = playerToken;
    }

    const getValue = () => value;

    return {
        setValue,
        getValue,
    };
}

function GameController(
    playerOne = "Player 1",
    playerTwo = "Player 2"
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOne,
            token: "X"
        },
        {
            name: playerTwo,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} played at coordinate (${row}, ${column})`);
        board.dropToken(row, column, getActivePlayer().token);

        let xInRow = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check for a winner
                console.log('clickVal', board.getBoard()[i][j].getValue())
                if (null) {}
                
            }
        }

        switchPlayer();
        printNewRound();
    }

    printNewRound();
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.player-turn');
    const boardDiv = document.querySelector('.game-board');

    function updateScreen() {
        // clear board
        boardDiv.textContent = "";

        // Get newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        let rowIdx = 0;
        board.forEach(row => {
            row.forEach((cell, columnIdx) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add("cell");

                cellBtn.dataset.row = rowIdx;
                cellBtn.dataset.column = columnIdx;
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
            });
            rowIdx+=1;
        });
    }

    function handleClick(e) {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;

        const clickedToken = e.target.innerText;

        if(!row || !column) return;

        if (clickedToken === "X" || clickedToken === "O") return;

        game.playRound(row, column);
        updateScreen();
    }

    boardDiv.addEventListener('click', handleClick);

    // Initial render
    updateScreen();

}

ScreenController()