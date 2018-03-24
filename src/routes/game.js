import express from 'express';
import {io} from "../server";
import {Game} from "../model/Game";
import {logger} from "../logger";

const router = express.Router();

router.get('/', (req, res)=>{
    io.on('connection', (socket)=>{
        logger.info('Connected');
        const game = new Game(1);
        // const room = '' +  Math.ceil(Math.random() * 100) + Date.now();
        // logger.info(`Room ${room}`);
        // socket.join(room);
        socket.emit('connection-status', 'connected');
        socket.emit('update-field', game.getState());

        socket.on('player-turn', (cords)=>{
            let result = game.playerTurn(cords, 1);
                socket.emit('update-field', result);
        });

        socket.on('retry', ()=>{
            let result = game.retry(1);
            socket.emit('update-field-retry', result);
        });
        socket.on('disconnect', ()=>{
            logger.info('Disconnected');
            socket.emit('connection-status', 'Disconnected');
            game.retry();
        })
    });
    return res.render('game');
});

export default router;