import { Command } from '@sapphire/framework';
import Guild from '../../models/guildSchema.js';

export class AddModCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'addmod',
            description: 'Add moderator roles.',
            quotes: [],
            preconditions: ['ownerOnly'],
        });
    }

    async messageRun(message, args) {
        let guildSettings = await Guild.findOne({ guildID: message.guild.id });
        const settingValue = await args.pick('role').catch(() => null);

        if (settingValue === null) {
            return message.reply('You didn\'t specify a role to add as a moderator.');
        }

        if (!guildSettings) {
            guildSettings = new Guild({
                guildName: message.guild.name,
                guildID: message.guild.id,
                modroles: settingValue.id,
            });
            await guildSettings.save().catch(err => console.log(err));
            return message.reply(`I made an entry in the database for your server settings since you're a first time user. I added the role ${settingValue} to the database.`);
        }

        guildSettings.modroles.push(settingValue.id);
        await guildSettings.save().catch(err => console.log(err));
        return message.reply(`I added the role ${settingValue} to the database.`);
    }
}