import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { sendLoadingMessage } from '../../lib/utils';
import Warn from '../../models/warnSchema';

export class WarningsCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'warnings',
            description: 'Displays a user\'s warnings.',
            preconditions: [['OwnerOnly', 'ModOnly']],
        });
    }

    public async messageRun(message: Message, args: Args) {
        const warnMember = await args.pick('member').catch(() => null);
        const warnMemberEntry = await Warn.findOne({ guildID: message.guild!.id, warnedUserID: warnMember!.id });

        if (warnMember === null) {
            return message.reply('You didn\'t mention anyone! Mention the user that you want to view.');
        }

        const response = await sendLoadingMessage(message);

        const paginatedMessage = new PaginatedMessage({
            template: new MessageEmbed()
                .setTitle(`Warnings for ${warnMember.user.username}#${warnMember.user.discriminator}`)
                .setColor('#FF0000')
            // Be sure to add a space so this is offset from the page numbers!
                .setFooter({ text: ' footer after page numbers' }),
        });

        for (let i = 0; i < warnMemberEntry.warnings.length; i++) {
            paginatedMessage
                .addPageEmbed((embed) =>
                    embed
                        .setFields([
                            {
                                name: 'ID',
                                value: `${warnMemberEntry.warnings[i].warningID}`,
                                inline: true,
                            },
                            {
                                name: 'Reason',
                                value: `${warnMemberEntry.warnings[i].warningMessage}`,
                                inline: true,
                            },
                            {
                                name: 'Moderator',
                                value: `${warnMemberEntry.warnings[i].warningAuthorUserID}`,
                                inline: true,
                            },
                            {
                                name: 'Timestamp',
                                value: `${warnMemberEntry.warnings[i].warningDate}`,
                            },
                        ]),
                );
        }

        await paginatedMessage.run(response, message.author);
        return response;
    }
}