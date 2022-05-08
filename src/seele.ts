import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import mongoose from './database/mongoose';
import GuildSettings from './models/guildSchema';

mongoose.init();

const client = new SapphireClient({
    logger: {
        level: LogLevel.Debug,
    },
    shards: 'auto',
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_VOICE_STATES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
    ],
});

const main = async () => {
    client.fetchPrefix = async (message) => {
        const guildProfile = await GuildSettings.findOne({ guildID: message.guild!.id });
        return guildProfile?.prefix ?? 's!';
    };

    try {
        client.logger.info('Logging in');
        await client.login();
        const { username, id } = client.user!;
        client.logger.info(`Logged in as ${username} (${id})`);
    }
    catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();
