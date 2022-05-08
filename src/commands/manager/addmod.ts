import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import GuildSettings from '../../models/guildSchema.js';

export class AddModCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'addmod',
            description: 'Add moderator roles.',
            quotes: [],
            preconditions: ['OwnerOnly'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const settingValue = await args.pick('role').catch(() => null);
        let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });

        if (settingValue === null) {
            return message.reply('You didn\'t specify a role to add as a moderator.');
        }

        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guildName: message.guild.name,
                guildID: message.guild.id,
                modroles: settingValue.id,
            });
            await guildSettings.save().catch((err: any) => console.log(err));
            return message.reply(`I made an entry in the database for your server settings since you're a first time user. I added the role ${settingValue} to the database.`);
        }

        if (guildSettings.modroles.includes(settingValue)) {
            return message.reply('This role is already present.')
        }

        guildSettings.modroles.push(settingValue.id);
        await guildSettings.save().catch((err: any) => console.log(err));
        return message.reply(`I added the role ${settingValue} to the database.`);
    }
}