const gameBoard = (function() {
    
    const _gameboard = [['', '', ''], ['', '', ''], ['', '', '']];

    const _addToGameBoardDiv = (X_O, row, column, gameboard) => {
        const X_O_Div = document.createElement("div");
        X_O_Div.classList.add("item");
        X_O_Div.setAttribute("data-row", row);
        X_O_Div.setAttribute("data-column", column);
        X_O_Div.textContent = X_O;
        gameboard.appendChild(X_O_Div);
    }

    const renderGameBoard = () => {
        const gameBoardDiv = document.createElement("div");
        gameBoardDiv.setAttribute("id", "gameboard");

        _gameboard.forEach((element, row) => {
            element.forEach((item, column) => {
                _addToGameBoardDiv(item, row, column, gameBoardDiv);
            })
        });

        document.querySelector("body")
          .appendChild(gameBoardDiv);
    }

    const getGameBoard = () => _gameboard;

    const updateGameBoard = (row, column, mark) => {
        _gameboard[row][column] = mark;
    }

    return {
        renderGameBoard,
        updateGameBoard,
        getGameBoard,
    }
})();

const Player = (name, mark) => {
    return {
        name,
        mark,
    }
}

const player1 = Player("Name1", "X");
const player2 = Player("Name2", "O");
const gameboard = gameBoard.getGameBoard();

gameBoard.renderGameBoard();

const gameFlow = (function() {
    
    const _players = [player1, player2];
    let _turn = 0;
    let _gameOver = false;
    
    const markASpot = (event) => {
        
        const { target } = event;
        const player = _players[_turn];
        
        if (!target.classList.contains("item")) {
            return;
        } else if (target.textContent !== "") {
            return;
        } else if (_gameOver) {
            return;
        }
    
        target.textContent = player.mark;

        const { row, column } = target.dataset;

        gameBoard.updateGameBoard(row, column, player.mark);

        if(_checkIfWon(row, column, player)) {
            _gameOver = true;
            return;
        };

        _switchTurns();
    }

    const _checkIfWon = (row, column, player) => {
        
        const gameBoard = gameboard;

        const rowComplete = gameBoard[row].every(mark => mark === player.mark);
        if (rowComplete) {
            console.log(`${player.name} Wins!`);
            return true;
        }

        const col = [];
        gameBoard.forEach(row => col.push(row[column]));
        const columnComplete = col.every(mark => mark === player.mark);

        if (columnComplete) {
            console.log(`${player.name} Wins!`);
            return true;
        }
        
        if ((row === 0 || row === 2) && column === 1) {
            return;
        } else if (row === 1 && column !== 1) {
            return;
        }
        
        const mainDiagonal = [];
        gameBoard.forEach((row, index) => mainDiagonal.push(row[index]));
        const mainDiagonalComplete = mainDiagonal.every(mark => mark === player.mark);

        if (mainDiagonalComplete) {
            console.log(`${player.name} Wins!`);
            return true;
        }

        const secondaryDiagonal = [];
        gameBoard.forEach((row, index) => secondaryDiagonal.push(row[2 - index]));
        const secondaryDiagonalComplete = secondaryDiagonal.every(mark => mark === player.mark);

        if (secondaryDiagonalComplete) {
            console.log(`${player.name} Wins!`);
            return true;
        }
    }
    
    const _switchTurns = () => {
        _turn = _turn === 0 ? 1 : 0;
        console.log(`It's ${_players[_turn].name}'s turn.`);   
    }

    const startGame = () => {
        document.querySelector("#gameboard")
          .addEventListener("click", e => gameFlow.markASpot(e));
    }

    return {
        startGame,
        markASpot,
    }
    
})();

gameFlow.startGame();