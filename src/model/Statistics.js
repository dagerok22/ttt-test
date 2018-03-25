import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    row: Number,
    column: Number,
    player: Number,
});

const gameSchema = new mongoose.Schema({
    winner: {
        type: Number,
        required: true,
    },
    moves: {
        type: [moveSchema],
        default: [],
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});

gameSchema.virtual('formattedWinner').get(function() {
    return this.winner === 1 ? 'You won' : this.winner === 2 ? 'You lost' : 'Draw';
});

const statisticsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    games: {
        type: [gameSchema],
        required: true,
        default: [],
    },
    date: {
        type: Number,
        required: true,
        default: Date.now(),
        get: (date) => new Date(date).toLocaleDateString(),
        set: (date) => date.getTime(),
    },
});

export default mongoose.model('Statistic', statisticsSchema);
