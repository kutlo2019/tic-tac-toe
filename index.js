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
            console.log("in here");
            _board[row][column].addToken(playerToken);
        } else {
            // If there is something in the cell
            console.log("or here");
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

    const addToken = (playerToken) => {
        value = playerToken;
    }

    const getValue = () => value;

    return {
        addToken,
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
    const board = game.getBoard();

    game.playRound(0, 0);
    game.playRound(1, 1);
    game.playRound(1, 0);
    game.playRound(2, 0);
    game.playRound(0, 2);
    game.playRound(0, 1);
    game.playRound(2, 1);
    game.playRound(2, 2);
    game.playRound(1, 2);    

}

ScreenController()