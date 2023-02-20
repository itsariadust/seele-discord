import { Args, Command } from '@sapphire/framework';
import Warn from '../../models/warnSchema';
import type { Message } from 'discord.js';

export class RemoveWarnCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'removewarn',
            description: 'Removes a member\'s warning.',
            quotes: [],
            preconditions: [['OwnerOnly', 'ModOnly']],
        });
    }

    async messageRun(message: Message, args: Args) {
        const warnMember = await args.pick('member').catch(() => null);
        const warnID = await args.rest('string').catch(() => null);

        if (warnMember === null) {
            return message.reply('You didn\'t mention anyone! Mention the user after typing the command before entering.');
        }

        if (warnMember.id === message.client.user!.id) {
            return message.reply('I can\'t warn myself so I can\'t remove a warning that can\'t be made.');
        }

        if (warnID === null) {
            return message.reply('You didn\'t provided an ID. An ID is needed to find the specific warning.');
        }

        Warn.updateOne(
            { guildID: message.guild!.id, warnedUserID: warnMember.id },
            { $pull: { warnings: { warningID: warnID } } },
            (err: any) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Warning removed successfully.');
                }
            },
        );
        return message.channel.send('Warning removed.');
    }
}