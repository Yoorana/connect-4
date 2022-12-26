class Game {
  constructor() {
    // object board
    this.board = {
      // Vertical, attribut
      rows: 6,
      // Horizontal
      columns: 7,
    };
    // object game
    this.game = {
      // property (attribute)
      turn: 1,
      // property with an array of object (one and two)
      players: [
        // the object itself has 2 attributes (colour and img)
        (this.one = {
          name: "",
          colour: "red",
          img: "",
          winCounter: 0,
          winCounterDiagonalOne: 0,
          winCounterDiagonalTwo: 0,
        }),
        (this.two = {
          name: "",
          colour: "blue",
          img: "",
          winCounter: 0,
          winCounterDiagonalOne: 0,
          winCounterDiagonalTwo: 0,
        }),
      ],
    };
    // Create 2D array not visually on the site but the back-end for the data
    this.boxesData = new Array(this.board.columns);
    for (let row = 0; row < this.boxesData.length; row++) {
      this.boxesData[row] = new Array(this.board.rows);
    }
  }

  /**
   * Method that builds the game (Connect 4)
   */
  build() {
    // let data = 0;

    // To call a function within a function in a class you need to use "this."
    this.cssGrid();
    this.visualGameBoard(document.getElementById("board"));
    this.makeButtonsForColumns(document.getElementById("nav"));
  }

  /**
   * CSS only provides fixed grid.
   * With this I can change the grid within JS without double work
   */
  cssGrid() {
    board.style.gridTemplateColumns = "repeat(" + this.board.columns + ", 1fr)";
    board.style.gridTemplateRows = "repeat(" + this.board.rows + ", 1fr)";
    nav.style.gridTemplateColumns = "repeat(" + this.board.columns + ", 1fr)";
  }

  /**
   * Create 2D array and each box has own ID number
   * First number is row, second number is column number
   * @param {*} boardElement section in HTML called board
   */
  visualGameBoard(boardElement) {
    for (let row = 0; row < this.board.rows; row++) {
      for (let column = 0; column < this.board.columns; column++) {
        boardElement.innerHTML += `<div class="box" id="${column}${row}"></div>`;
      }
    }
  }

  /**
   * Creates buttons for each column
   * @param navElement elements from the navigationbar in html
   */
  makeButtonsForColumns(navElement) {
      for (let boxIndex = 0; boxIndex < this.board.columns; boxIndex++) {
        navElement.innerHTML +=
          `<button class="btColumnSelection" id="column_${boxIndex}" onmouseover="game.hoverColour(this.id)" onmouseout="game.defaultColour(this.id)"` +
          ` onclick="game.spawnDisk(${boxIndex},'modal','winnerScreen')">`;
      }
  }
  /**
   * On hover the button and it change it's colour to the current player
   * player 1 = red, player 2 = blue
   * @param id the id of each column button
   */
  hoverColour(id) {
    document.getElementById(id).style.backgroundColor =
      this.game.players[this.game.turn - 1].colour;
  }
  /**
   * When not hovered over the button change the button back to it's default
   * @param id the id of each column button
   */
  defaultColour(id) {
    document.getElementById(id).style.backgroundColor = "#e3d9d955";
  }

  /**
   * fill the box with the value and draws it in the box (visually)
   * @param column The selected column number
   */
  spawnDisk(column, modal , winnerScreen) {
    for (let row = this.boxesData[column].length - 1; row > -1; row--) {
      // Checks if there is an empty boxes, if empty fills box with either 1 or 2 value
      // falsy is undefined, NaN, Null and number zero
      if (!this.boxesData[column][row]) {
        this.boxesData[column][row] = this.game.turn;

        // Change background colour of the spawned disk
        document.getElementById(`${column}${row}`).style.backgroundColor =
          this.game.players[this.game.turn - 1].colour;

        // place here wincondition with as parameter(column)
        // this.winColumn(column)
        this.checkWinner(
          this.winColumn(column),
          this.winRow(column, row),
          this.winDiagonal(column, row), 
          modal, 
          winnerScreen
        ) 

        //swap player
        if (this.game.turn == 2) {
          // change to player 1 turn
          this.game.turn = 1;
        } else {
          // change to player 2 turn
          this.game.turn = 2;
        }

        break;
      }
    }
  }

  /**
   * Win condition: Have 4 of the same disk in a column
   * @param inputColumn the column number where the disk is in
   */
  winColumn(inputColumn) {
    this.game.players[this.game.turn - 1].winCounter = 0;

    for (let row = this.boxesData[inputColumn].length - 1; row > -1; row--) {
      // if the previous box of the column is not the same value, reset the wincounter
      if (this.boxesData[inputColumn][row] != this.game.turn) {
        this.game.players[this.game.turn - 1].winCounter = 0;
      }
      // if the previous box of the column is the same value as the one you have now, +1 on the wincounter
      else if (this.boxesData[inputColumn][row] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounter++;
        // if the wincounter is 4 of any of the players, return true
        if (this.game.players[this.game.turn - 1].winCounter == 4) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Win condition: Have 4 of the same disk in a row
   * @param inputColumn the column number where the disk is in
   * @param inputRow the row number where the disk is in
   */
  winRow(inputColumn, inputRow) {
    this.game.players[this.game.turn - 1].winCounter = 0;

    for (
      let column = 0;
      column <= this.boxesData[inputColumn].length;
      column++
    ) {
      // if the previous box of the row is not the same value, reset the wincounter
      if (this.boxesData[column][inputRow] != this.game.turn) {
        this.game.players[this.game.turn - 1].winCounter = 0;
      }
      // if the previous box of the row is the same value as the one you have now, +1 on the wincounter
      else if (this.boxesData[column][inputRow] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounter++;
        // if the wincounter is 4 of any of the players, return true
        if (this.game.players[this.game.turn - 1].winCounter == 4) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Win condition: Have 4 of the same disk in a diagonal
   * @param inputColumn the column number where the disk is in
   * @param inputRow the row number where the disk is in
   */
  winDiagonal(inputColumn, inputRow) {
    let newColumn, newRow;
    this.game.players[this.game.turn - 1].winCounterDiagonalOne = 1;
    this.game.players[this.game.turn - 1].winCounterDiagonalTwo = 1;

    try {
      // index column -1, row -1
      if (this.boxesData[inputColumn - 1][inputRow - 1] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounterDiagonalOne++;
        newColumn = inputColumn - 1;
        newRow = inputRow - 1;
        if (this.boxesData[newColumn - 1][newRow - 1] == this.game.turn) {
          this.game.players[this.game.turn - 1].winCounterDiagonalOne++;
          newColumn = newColumn - 1;
          newRow = newRow - 1;
          if (this.boxesData[newColumn - 1][newRow - 1] == this.game.turn) {
            return true;
          }
        }
      }

      // index column +1, row +1
      if (this.boxesData[inputColumn + 1][inputRow + 1] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounterDiagonalOne++;
        if (this.game.players[this.game.turn - 1].winCounterDiagonalOne == 4) {
          return true;
        }
        newColumn = inputColumn + 1;
        newRow = inputRow + 1;
        if (this.boxesData[newColumn + 1][newRow + 1] == this.game.turn) {
          this.game.players[this.game.turn - 1].winCounterDiagonalOne++;
          newColumn = newColumn + 1;
          newRow = newRow + 1;
          if (this.boxesData[newColumn + 1][newRow + 1] == this.game.turn) {
            return true;
          }
        }
      }

      // index column +1, row -1
      if (this.boxesData[inputColumn + 1][inputRow - 1] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounterDiagonalTwo++;
        newColumn = inputColumn + 1;
        newRow = inputRow - 1;
        if (this.boxesData[newColumn + 1][newRow - 1] == this.game.turn) {
          this.game.players[this.game.turn - 1].winCounterDiagonalTwo++;
          newColumn = newColumn + 1;
          newRow = newRow - 1;
          if (this.boxesData[newColumn + 1][newRow - 1] == this.game.turn) {
            return true;
          }
        }
      }

      // index column -1, row +1
      if (this.boxesData[inputColumn - 1][inputRow + 1] == this.game.turn) {
        this.game.players[this.game.turn - 1].winCounterDiagonalOne++;
        if (this.game.players[this.game.turn - 1].winCounterDiagonalTwo == 4) {
          return true;
        }
        newColumn = inputColumn - 1;
        newRow = inputRow + 1;
        if (this.boxesData[newColumn - 1][newRow + 1] == this.game.turn) {
          this.game.players[this.game.turn - 1].winCounterDiagonalTwo++;
          newColumn = newColumn - 1;
          newRow = newRow + 1;
          if (this.boxesData[newColumn - 1][newRow + 1] == this.game.turn) {
            return true;
          }
        }
      }
    } catch (e) {
      // "e" stands for the error object
      // dir = way to see all the properties of an object.
      // console.dir(e);
    }

    return false;
  }

  /**
   * Win conditions of Connect 4
   * Have 4 of the same disk either in a row, column or diagonal
   * @param {*} winRow win condition of having 4 of the same disk in a row
   * @param {*} winColumn win condition of having 4 of the same disk in a column
   * @param {*} winDiagonal win condition of having 4 of the same disk in a diagonal
   */
  checkWinner(winColumn, winRow, winDiagonal, modal, winnerScreen) {
    if (winColumn == true || winRow == true || winDiagonal == true) {
        console.log('we have a winner');

        this.revealElementsByClassName(modal);
        this.printWinnerName();
        this.revealElementsByClassName(winnerScreen);
    } 
  }

  /**
   * Print winnerName in pop-up
   */
  printWinnerName() {
    if (this.game.turn === 1) {
      // print player 1 name
      document.getElementById("winnerName").innerHTML =
        this.game.players[0].name;
      return this.game.players[0].name;
    } else {
      // print player 2 name
      document.getElementById("winnerName").innerHTML =
        this.game.players[1].name;
      return this.game.players[1].name;
    }
  }

  replayScreen(winnerPopUp, replayGame) {
    this.hideElementsByClassName(winnerPopUp);
    this.revealElementsByClassName(replayGame);
  }

  replayGame() {
    window.location.reload();
  }

  quitGame(replayBtn, quitBtn, farewellMsg) {
    this.hideElementsByClassName(replayBtn);
    this.hideElementsByClassName(quitBtn);
    this.revealElementsByClassName(farewellMsg);

    setTimeout(self.close(), 10000);
  }

  // closing window with JS is not allowed anymore due security
  closeWindow() {
    let new_window = open("", "_self");
    new_window.close();
    return false;
  }

  /**
   * Both 2 players have to fill in their name to be either player one or two
   * Can't fill identical names for player one and two
   */
  enterPlayerNames() {
    this.enterPlayerTwoName(this.enterPlayerOneName());
  }

  /**
   * Temporarily hides the elements with a certain classname using CSS
   * @param inputClassName the name of the class
   */
  hideElementsByClassName(className) {
    for (const element of document.getElementsByClassName(className)) {
      element.style.display = "none";
    }
  }

  revealElementsByClassName(className) {
    for (const element of document.getElementsByClassName(className)) {
      element.style.display = "block";
    }
  }

  /**
   * Fill in player One name with a promptbox
   * Check; you can't leave the promptbox empty
   */
  enterPlayerOneName(warning, playerTwoScreen, playerOneScreen) {
    // let playerOneName = prompt("Please enter your name (player 1):", this.game.players[0].name);
    let playerOneName = document.getElementById("playerOneName").value;
    if (!playerOneName) {
      this.revealElementsByClassName(warning);
    } else {
      this.game.players[0].name = playerOneName;
      this.hideElementsByClassName(playerOneScreen);
      this.revealElementsByClassName(playerTwoScreen);
    }
  }

  /**
   *  Fill in player two name with a promptbox,
   *  Check; you can't leave the promptbox empty nor can you fill in the same name as player one
   */
  enterPlayerTwoName(warning, modalWindow, playerTwoScreen) {
    let playerTwoName = document.getElementById("playerTwoName").value;
    if (!playerTwoName || playerTwoName == this.game.players[0].name) {
      this.revealElementsByClassName(warning);
    } else {
      this.game.players[1].name = playerTwoName;
      this.hideElementsByClassName(modalWindow);
      this.hideElementsByClassName(playerTwoScreen);
    }
  }
}
