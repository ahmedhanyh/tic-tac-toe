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

        document.querySelector("#gameboard-container")
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

const gameFlow = (function(gameBoard) {
    
    const _gameBoard = gameBoard.getGameBoard();
    const _players = [];
    const resultDisplay = document.querySelector("#result");
    let _turn = 0;
    let _gameOver = false;
    
    const markASpot = (event) => {
        
        const { target } = event;
        const player = _players[_turn];
        
        if (!target.classList.contains("item")) {
            return;
        } else if (target.classList.contains("clicked")) {
            return;
        } else if (_gameOver) {
            return;
        }
    
        target.textContent = player.mark;

        const { row, column } = target.dataset;

        gameBoard.updateGameBoard(row, column, player.mark);

        target.classList.add("clicked");

        if(_checkIfWon(row, column, player)) {
            _gameOver = true;
            return;
        };

        if (_checkIfTied()) {
            _gameOver = true;
            resultDisplay.textContent = "It's a tie!";
            return;
        }

        _switchTurns();
    }

    const _checkIfWon = (row, column, player) => {

        const rowComplete = _gameBoard[row].every(mark => mark === player.mark);
        if (rowComplete) {
            resultDisplay.textContent = `${player.name} Wins!`;
            return true;
        }

        const col = [];
        _gameBoard.forEach(row => col.push(row[column]));
        const columnComplete = col.every(mark => mark === player.mark);

        if (columnComplete) {
            resultDisplay.textContent = `${player.name} Wins!`;
            return true;
        }
        
        if ((row === 0 || row === 2) && column === 1) {
            return;
        } else if (row === 1 && column !== 1) {
            return;
        }
        
        const mainDiagonal = [];
        _gameBoard.forEach((row, index) => mainDiagonal.push(row[index]));
        const mainDiagonalComplete = mainDiagonal.every(mark => mark === player.mark);

        if (mainDiagonalComplete) {
            resultDisplay.textContent = `${player.name} Wins!`;
            return true;
        }

        const secondaryDiagonal = [];
        _gameBoard.forEach((row, index) => secondaryDiagonal.push(row[2 - index]));
        const secondaryDiagonalComplete = secondaryDiagonal.every(mark => mark === player.mark);

        if (secondaryDiagonalComplete) {
            resultDisplay.textContent = `${player.name} Wins!`;
            return true;
        }
    }
    
    const _checkIfTied = () => {

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (_gameBoard[row][col] === "") {
                    return false;
                }
            }
        }

        return true;
    }
    
    const _switchTurns = () => {
        _turn = _turn === 0 ? 1 : 0;
    }

    const startGame = () => {
        const input1 = document.querySelector("#name1");
        const input2 = document.querySelector("#name2");

        if (input1.value === "" || input2.value === "") {
            alert("You must fill both fields.");
            return;
        }

        const player1 = Player(input1.value);
        const player2 = Player(input2.value);
        
        player1.mark = "X";
        player2.mark = "O";

        [input1.value, input2.value] = ["", ""];
        input1.disabled = true;
        input2.disabled = true;

        _players.push(player1, player2);

        gameBoard.renderGameBoard();

        document.querySelector("#gameboard")
          .addEventListener("click", e => markASpot(e));
        
        document.querySelectorAll(".item")
          .forEach(item => {
              item.addEventListener("mouseenter", () => {
                  if (!item.classList.contains("clicked") && !_gameOver) {
                      item.textContent = _players[_turn].mark;
                  }
              });

              item.addEventListener("mouseleave", () => {
                if (!item.classList.contains("clicked") && !_gameOver) {
                    item.textContent = "";
                }
            });
          });
    }

    const restartGame = () => {
        document.querySelectorAll("input")
          .forEach(input => input.disabled = false);
        
        document.querySelector("#gameboard-container").innerHTML = "";

        resultDisplay.textContent = "";
    }

    return {
        markASpot,
        startGame,
        restartGame,
    }
    
})(gameBoard);

document.querySelector("#start-btn")
  .addEventListener("click", gameFlow.startGame);

document.querySelector("#restart-btn")
  .addEventListener("click", gameFlow.restartGame);
