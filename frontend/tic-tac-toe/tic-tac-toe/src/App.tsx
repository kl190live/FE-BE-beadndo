import React, {useState} from 'react';
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import GameTurn from "./classes/GameTurn";
import Square from "./classes/Square";
import GameOver from "./components/GameOver";
import Players from "./classes/Players";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

const initialGameBoard: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

function App() {
    const [gameTurns, setGameTurns] = useState<GameTurn[]>([]);
    const [players, setPlayers] = useState(new Players('Player 1', 'Player 2'));

    let gameBoard = [...initialGameBoard].map(innerArray => [...innerArray]);
    let activePlayer = gameTurns.length === 0 ? 'X' : (gameTurns[0].player === 'X' ? 'O' : 'X');
    let winner = undefined;

    for (const turn of gameTurns) {
        const {square, player} = turn;
        const {row, column} = square;
        gameBoard[row][column] = player;
    }

    if (isRowWinning() || isColumnWinning() || isDiagonalWinning()) {
        winner = activePlayer === 'X' ? players.o : players.x;
    }

    const isDraw = gameTurns.length === 9 && !winner;

    function isRowWinning() {
        for (let i = 0;i < gameBoard.length;i++) {
            if (gameBoard[i][0] !== '' && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2]) {
                return true;
            }
        }
        return false;
    }

    function isColumnWinning() {
        for (let i = 0;i < gameBoard.length;i++) {
            if (gameBoard[0][i] !== '' && gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i]) {
                return true;
            }
        }
        return false;
    }

    function isDiagonalWinning() {
        if (gameBoard[0][0] !== '' && gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2]) {
            return true;
        }
        if (gameBoard[2][0] !== '' && gameBoard[2][0] === gameBoard[1][1] && gameBoard[2][0] === gameBoard[0][2]) {
            return true;
        }
        return false;
    }

    function handleSelectSquare(rowIndex: number, columnIndex: number) {
        setGameTurns(previousGameTurns => {
            return [new GameTurn(new Square(rowIndex, columnIndex), activePlayer), ...previousGameTurns];
        })
    }

    function handleRestart() {
        setGameTurns([]);
    }

    function handleNameChange(playerSymbol: string, newPlayerName: string) {
        setPlayers(previousPlayers => {
            let updatedPlayers;
            if ('X' === playerSymbol) {
                updatedPlayers = new Players(newPlayerName, previousPlayers.o)
            } else {
                updatedPlayers = new Players(previousPlayers.x, newPlayerName)
            }
            return updatedPlayers;
        })
    }

  return (
      <main>
        <div id="game-container">
            <ol id="players" className="highlight-player">
                <Player playerName='Player 1' playerSymbol='X' isActive={activePlayer === 'X'} onNameChange={handleNameChange}/>
                <Player playerName='Player 2' playerSymbol='O' isActive={activePlayer === 'O'} onNameChange={handleNameChange}/>
            </ol>
            {(winner || isDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
            <GameBoard onSelectSquare={handleSelectSquare} activePlayer={activePlayer} gameBoard={gameBoard} winner={winner}/>
        </div>
          <ol id="log">
              <Log gameTurns={gameTurns}/>
          </ol>
      </main>
  );
}

export default App;
