import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class RemoveTimeoutCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'removetimeout',
            description: 'Removes a member\'s timeout.',
            preconditions: [['OwnerOnly', 'ModOnly']],
            requiredClientPermissions: ['MODERATE_MEMBERS'],
            aliases: ['removeto'],
        });
    }

    public async messageRun(message: Message, args: Args) {
        const timeoutMember = await args.pick('member').catch(() => null);
        if (timeoutMember === null) {
            return message.reply('You never provided a member to time out. You can provide it by mentioning the member.');
        }
        if (timeoutMember.isCommunicationDisabled() === false) {
            return message.reply('This user is no longer timed out.');
        }
        timeoutMember!.disableCommunicationUntil(null);
        return message.reply(`<@${timeoutMember.id}>'s timeout has been removed.`);
    }
}