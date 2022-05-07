import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
    prefix: { type: String, default: 's!' },
    modroles: [String],
});

export default mongoose.model('Guild', guildSchema, 'guildSettings');