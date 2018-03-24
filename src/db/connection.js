import mongoose from 'mongoose';
import config from '../config';


mongoose.Promise = global.Promise;
try {
    mongoose.connect(config.connectionAddress);
} catch (error) {
    console.log(error);
}
