import mongoose from 'mongoose';
import express from 'express';
import {io} from '../server';
import {Game} from '../model/Game';
import Statistics from '../model/Statistics';
import {logger} from '../logger';

const router = express.Router();

router.get('/', (req, res) => {
  io.on('connection', (socket) => {
    logger.info('Connected');
    const game = new Game(1);
    socket.emit('connection-status', 'connected');
    socket.emit('update-field', game.getState());

    socket.on('save-stats', async ()=>{
        const stats = new Statistics();
        stats.user = socket.handshake.address;
        stats.games = game.getStats();
        await stats.save();
        logger.info('stats saved', stats);
        socket.emit('stats-saved', stats._id);
    });

    socket.on('player-turn', (cords) => {
      let result = game.playerTurn(cords, 1);
      socket.emit('update-field', result);
    });

    socket.on('retry', () => {
      let result = game.retry(1);
      socket.emit('update-field-retry', result);
    });
    socket.on('disconnect', () => {
      logger.info('Disconnected');
      socket.emit('connection-status', 'Disconnected');
    });
  });
  return res.render('game');
});

router.get('/statistics/:statsId', async (req, res, next)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.statsId)) {
        return res.json({error: 1, message: 'Invalid ID'});
    }

    const stats = await Statistics.findById(req.params.statsId);
    if (!stats) {
        res.status = 404;
        return next();
    }

    return res.render('stats', stats.toJSON());
});

export default router;
