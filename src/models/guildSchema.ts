import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
    guildName: String,
    guildID: String,
    prefix: { type: String, default: 's!' },
    modroles: [String],
});

export default mongoose.model('GuildSettings', guildSchema, 'guildSettings');