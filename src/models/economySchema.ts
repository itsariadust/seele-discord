import mongoose from 'mongoose';

const economySchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userBalance: Number,
    nextDaily: Date,
});

export default mongoose.model('Economy', economySchema, 'economy');