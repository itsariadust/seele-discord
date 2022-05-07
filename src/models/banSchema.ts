import mongoose from 'mongoose';

const banSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    banRecord: [{
        banID: String,
        bannedUserID: String,
        bannedUserName: String,
        banMessage: String,
        banAuthorUserName: String,
        banAuthorUserID: String,
        banDate: String,
    }],
});

export default mongoose.model('Ban', banSchema, 'ban');