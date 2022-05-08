import { Command } from '@sapphire/framework';
import GuildSettings from '../../models/guildSchema.js';

export class SetPrefixCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'setprefix',
            description: 'Set server-specific prefix for the bot.',
            quotes: [],
            preconditions: ['ownerOnly'],
        });
    }

    async messageRun(message, args) {
        let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
        const settingValue = await args.pick('string').catch(() => null);

        if (settingValue === null) {
            return message.reply('You didn\'t specify a prefix to modify the default one. Please type `s!setprefix your_prefix` to change it.');
        }

        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guildName: message.guild.name,
                guildID: message.guild.id,
            });
            await guildSettings.save().catch(err => console.log(err));
        }

        await GuildSettings.findOneAndUpdate({ guildID: message.guild.id }, { prefix: settingValue });
        message.reply(`Your prefix has been changed to ${settingValue}`);
    }
}