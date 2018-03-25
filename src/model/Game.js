import _ from 'lodash';
import {
    logger,
} from '../logger';


class Game {
    constructor(indexOfPlayerToTurnFirst) {
        this._field = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
        this._indexOfPlayerToTurn = indexOfPlayerToTurnFirst;
        this._turns = [];
        this._winner = 0;
        this._games = [];
        this.AI_PLAYER = 'O';
        this.HUMAN_PLAYER = 'X';
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

    getStats() {
        const stats = this._games.map((gameStat) => {
            let gameObj = {
                winner: gameStat.winner,
                moves: gameStat.turns,
            };
            return gameObj;
        });
        logger.info(this);
        if (this._winner) {
            stats.push({
                winner: this._winner,
                moves: this._turns,
            });
        }
        return stats;
    }

    retry(indexOfPlayerToTurnFirst) {
        if (this._winner) {
            this._games.push({
                turns: this._turns,
                winner: this._winner,
            });
        }
        this._field = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
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
        logger.info('start', this._indexOfPlayerToTurn, player, this._field[+row][+column]);
        if (!row || !column || this._indexOfPlayerToTurn !== player || !Number.isInteger(this._field[+row][+column])) {
            return;
        }
        this._field[row][column] = player;
        this._turns.push({
            row,
            column,
            player,
        });
        this._indexOfPlayerToTurn = player === this.HUMAN_PLAYER ? this.AI_PLAYER : this.HUMAN_PLAYER;
        let winner = this.isOver();
        if (winner === 0) {
            this.makeTurnForPlayer(player === this.HUMAN_PLAYER ? this.AI_PLAYER : this.HUMAN_PLAYER);
            winner = this.isOver();
        }
        this._winner = winner;
        return this.getState();
    }

    makeTurnForPlayer(player) {
        if (this._indexOfPlayerToTurn !== player) {
            return;
        }
        logger.info(_.flatten(this._field));
        const emptyCells = _.flatten(this._field).filter((e) => e !== this.HUMAN_PLAYER && e !== this.AI_PLAYER);
        let cell;
        logger.info(emptyCells);
        if (emptyCells.length < 8) {
            cell = this.getBestMove(player);
        } else {
            cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        const row = Math.floor(cell / 3);
        const column = cell % 3;
        logger.info(row, column);
        logger.warn(this._field[row][column]);
        this._field[row][column] = player;
        this._turns.push({
            row,
            column,
            player,
        });
        this._indexOfPlayerToTurn = player === this.AI_PLAYER ? this.HUMAN_PLAYER : this.AI_PLAYER;
    }

    isOver() {
        if (this.isWinning(this.HUMAN_PLAYER)) {
            logger.info('Human won', _.flatten(this._field))
            return this.HUMAN_PLAYER;
        }
        if (this.isWinning(this.AI_PLAYER)) {
            logger.info('AI won', _.flatten(this._field))
            return this.AI_PLAYER;
        }

        const emptyCells = _.flatten(this._field).reduce((a, e) => Number.isInteger(e) ? a + 1 : a, 0);
        if (!emptyCells) {
            return -1;
        }

        return 0;
    }

    getBestMove(player) {
        const flattenField = _.flatten(this._field);
        const bestMove = this.minimax(flattenField, player);
        logger.info('best move', bestMove);
        return bestMove.index;
    }

    minimax(newField, player) {
        const availSpots = this.emptyIndexies(newField);

        logger.info('newField', newField);
        logger.info('availSpots', availSpots);
        if (this.isWinning(this.HUMAN_PLAYER, newField)) {
            return {
                score: -10,
            };
        } else if (this.isWinning(this.AI_PLAYER, newField)) {
            return {
                score: 10,
            };
        } else if (availSpots.length === 0) {
            return {
                score: 0,
            };
        }

        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = newField[availSpots[i]];

            newField[availSpots[i]] = player;
            if (player == this.AI_PLAYER) {
                let result = this.minimax(newField, this.HUMAN_PLAYER);
                move.score = result.score;
            } else {
                let result = this.minimax(newField, this.AI_PLAYER);
                move.score = result.score;
            }

            newField[availSpots[i]] = move.index;
            logger.info('move', move);
            moves.push(move);
        }

        let bestMove;
        if (player === this.AI_PLAYER) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    emptyIndexies(board) {
        return board.filter((s) => s !== this.HUMAN_PLAYER && s !== this.AI_PLAYER);
    }

    isWinning(player, board = _.flatten(this._field)) {
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
