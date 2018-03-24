import express from 'express';
import game from './game';

const router = express.Router();

router.get('/', (req, res) => res.render('index'));

router.use('/game', game);

export default router;
