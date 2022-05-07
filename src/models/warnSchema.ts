import mongoose from 'mongoose';

const warnSchema = new mongoose.Schema({
    guildID: String,
    guildName: String,
    warnedUserID: String,
    warnedUserName: String,
    warnings: [{
        warningID: String,
        warningMessage: String,
        warningAuthorUserName: String,
        warningAuthorUserID: String,
        warningDate: String,
    }],
});

export default mongoose.model('Warn', warnSchema, 'warn');