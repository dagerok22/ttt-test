import _ from 'lodash';


class Game {
    constructor(indexOfPlayerToTurnFirst) {
        this._field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this._indexOfPlayerToTurn = indexOfPlayerToTurnFirst;
        this._turns = [];
        this._winner = 0;
        this._games = [];
    }

    getTurns() {
        return this._turns;
    };

    getState() {
        return {
            field: this._field,
            winner: this._winner,
        };
    };

    retry(indexOfPlayerToTurnFirst) {
        if (this._winner) {
            this._games.push({
                turns: this._turns,
                winner: this._winner,
            });
        }
        this._field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this._indexOfPlayerToTurn = indexOfPlayerToTurnFirst;
        this._turns = [];
        this._winner = 0;
        return this.getState();
    }

    playerTurn({
        row,
        column,
    }, player) {
        if (!row || !column || this._indexOfPlayerToTurn !== player || this._field[+row][+column] !== 0) {
            return;
        }
        this._field[row][column] = player;
        this._turns.push({
            row,
            column,
            player,
        });
        this._indexOfPlayerToTurn = player === 1 ? 2 : 1;
        let winner = this.isOver();
        if (winner === 0) {
            this.makeTurnForPlayer(player === 1 ? 2 : 1);
            winner = this.isOver();
        }
        this._winner = winner;
        return this.getState();
    }

    makeTurnForPlayer(player) {
        if (this._indexOfPlayerToTurn !== player) {
            return;
        }

        let availableCells = this._field.map((row, i) => {
            let available = row.map((cell, i) => {
                if (cell === 0) {
                    return i;
                }
            });
            return available.map((cell) => [i, cell]).filter((a) => a[0] !== undefined && a[1] !== undefined);
        }).reduce((a, b) => a.concat(b), []);

        console.log(availableCells);
        let cell = availableCells[Math.round(Math.random() * (availableCells.length - 1))];
        this._field[cell[0]][cell[1]] = player;
        this._turns.push({
            row: cell[0],
            column: cell[1],
            player,
        });
        this._indexOfPlayerToTurn = player === 2 ? 1 : 2;
    }

    isOver() {
        if (this.isWinning(1)) {
            return 1;
        }
        if (this.isWinning(2)) {
            return 2;
        }

        const emptyCells = _.flatten(this._field).reduce((a, e) => e === 0 ? a + 1 : a, 0);
        if (!emptyCells) {
            return -1;
        }

        return 0;
    }

    isWinning(player) {
        const board = _.flatten(this._field);
        return (board[0] === player && board[1] === player && board[2] === player) ||
            (board[3] === player && board[4] === player && board[5] === player) ||
            (board[6] === player && board[7] === player && board[8] === player) ||
            (board[0] === player && board[3] === player && board[6] === player) ||
            (board[1] === player && board[4] === player && board[7] === player) ||
            (board[2] === player && board[5] === player && board[8] === player) ||
            (board[0] === player && board[4] === player && board[8] === player) ||
            (board[2] === player && board[4] === player && board[6] === player);
    }
}

export {
    Game,
};
