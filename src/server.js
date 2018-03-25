import socketIO from 'socket.io';
import app from './app';
import {logger} from './logger';

const http = require('http').Server(app);
const io = socketIO(http);

http.listen(process.env.PORT || 3000, () => {
    logger.warn(`Listening on port ${process.env.port || 3000}`);
});

export {io, http};
