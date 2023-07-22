function GameBoard() {
    const _columns = 3;
    const _rows = 3;
    const _board = [];

    const resetBoard = () => {
        for (let i = 0; i < _rows; i++) {
            _board[i] = [];
            for (let j = 0; j < _columns; j++) {
                _board[i].push(Cell());
            }
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
    }

    resetBoard()

    return {resetBoard, getBoard, printBoard, dropToken}
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

    const resetPlayer = () => {
        activePlayer = players[0];
    }

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkWinner = (playerToken) => {
        // Check for a winner in a row
        for (let i = 0; i < 3; i++) {
            let tokenInRow = 0
            for (let j = 0; j < 3; j++) {
                const cellToken = board.getBoard()[i][j].getValue()
                if (playerToken === cellToken) tokenInRow += 1;
            }
            if (tokenInRow === 3) return `${getActivePlayer().name} Wins!!`;
        }

        // Check for a winner in a column
        for (let i = 0; i < 3; i++) {
            let tokenInCol = 0
            for (let j = 0; j < 3; j++) {
                const cellToken = board.getBoard()[j][i].getValue()
                if (playerToken === cellToken) tokenInCol += 1;
            }
            if (tokenInCol === 3) return `${getActivePlayer().name} Wins!!`;
        }

        // Check for winner in a diagonal
        // *
        //      *
        //          *
        let tokenInDiagonal1 = 0;
        for (let i = 0; i < 3; i++) {
            if (playerToken === board.getBoard()[i][i].getValue()) tokenInDiagonal1 += 1;
        }
        if (tokenInDiagonal1 === 3) return `${getActivePlayer().name} Wins!!`;

        // Check for winner in a diagonal
        //          *
        //      *
        // *
        let tokenInDiagonal2 = 0;
        let k = 2;
        for (let i = 0; i < 3; i++) {
            if (playerToken === board.getBoard()[k][i].getValue()) tokenInDiagonal2 += 1;
            k -= 1;
        }
        if (tokenInDiagonal2 === 3) return `${getActivePlayer().name} Wins!!`;
    }

    const playRound = (row, column) => {
        const playerToken = getActivePlayer().token;
        board.dropToken(row, column, playerToken);

        const winner = checkWinner(playerToken)
        if (winner === undefined) {
            switchPlayer();
            printNewRound();
        } else {
            return winner;
        }
    }

    printNewRound();
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard,
        resetPlayer,
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

        const winner = game.playRound(row, column);
        updateScreen();
        if (winner === undefined){
            return
        } else {
            const winnerDiv = document.getElementById('winner');
            winnerDiv.innerText = winner;
            updateScreen();
            setTimeout(() => {
                winnerDiv.innerText = "";
                game.resetPlayer();
            }, 3200);
            setTimeout(() => {
                game.resetBoard();
            }, 3000);
            updateScreen();
        }
    }

    boardDiv.addEventListener('click', handleClick);

    // Initial render
    updateScreen();

}

ScreenController()