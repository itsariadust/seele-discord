import mongoose from 'mongoose';

const kickSchema = new mongoose.Schema({
    guildID: String,
    guildName: String,
    kickRecord: [{
        kickID: String,
        kickedUserID: String,
        kickedUserName: String,
        action: String,
        kickMessage: String,
        kickAuthorUserName: String,
        kickAuthorUserID: String,
        kickDate: String,
    }],
});

export default mongoose.model('Kick', kickSchema, 'kick');