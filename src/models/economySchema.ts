import mongoose from 'mongoose';

const economySchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userBalance: Number,
});

export default mongoose.model('Economy', economySchema, 'economy');