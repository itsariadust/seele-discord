import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class TimeoutCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'timeout',
            description: 'Times out a member.',
            preconditions: [['OwnerOnly', 'ModOnly']],
            requiredClientPermissions: ['MODERATE_MEMBERS'],
        });
    }

    public async messageRun(message: Message, args: Args) {
        const timeoutMember = await args.pick('member').catch(() => null);
        const timeoutDuration = await args.pick('number').catch(() => 5);
        const timeoutReason = await args.pick('string').catch(() => 'Non provided.');
        if (timeoutMember === null) {
            return message.reply('You never provided a member to time out. You can provide it by mentioning the member.');
        }
        if (timeoutMember.isCommunicationDisabled() === true) {
            return message.reply('This user is already timed out.');
        }
        timeoutMember!.timeout(timeoutDuration * 60 * 1000, `${timeoutReason}`);
        return message.reply(`<@${timeoutMember.id}> has been timed out for ${timeoutDuration} minutes.`);
    }
}