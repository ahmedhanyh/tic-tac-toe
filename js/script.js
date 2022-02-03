const gameBoard = (function() {
    
    const _gameboard = ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'];

    const _addToGameBoardDiv = (X_O, gridLocation, gameboard) => {
        const X_O_Div = document.createElement("div");
        X_O_Div.classList.add("item");
        X_O_Div.setAttribute("data-loc", gridLocation);
        X_O_Div.textContent = X_O;
        gameboard.appendChild(X_O_Div);
    }

    const renderGameBoard = () => {
        const gameBoardDiv = document.createElement("div");
        gameBoardDiv.setAttribute("id", "gameboard");

        _gameboard.forEach((element, index) => _addToGameBoardDiv(element, index, gameBoardDiv));

        document.querySelector("body")
          .appendChild(gameBoardDiv);
    }

    return {
        renderGameBoard,
    }
})();

gameBoard.renderGameBoard();
