import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import Guild from '../../models/guildSchema.js';

export class DeleteModCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'delmod',
            description: 'Delete moderator roles.',
            quotes: [],
            preconditions: ['OwnerOnly'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const settingValue = await args.pick('role').catch(() => null);
        let guildSettings = await Guild.findOne({ guildID: message.guild!.id });

        if (settingValue === null) {
            return message.reply('You didn\'t specify a role to remove as a moderator.');
        }

        if (!guildSettings) {
            guildSettings = new Guild({
                guildName: message.guild!.name,
                guildID: message.guild!.id,
            });
            await guildSettings.save().catch((err: any) => console.log(err));
            return message.reply(`You don't have any settings in the database, so I made one instead. You can onl add settings for now. You can only remove settings that have been inserted.`);
        }

        if (!guildSettings.modroles.includes(settingValue)) {
            return message.reply('This role is not present.')
        }

        guildSettings.modroles.pull(settingValue.id);
        await guildSettings.save().catch((err: any) => console.log(err));
        return message.reply(`I removed the role ${settingValue} to the database.`);
    }
}