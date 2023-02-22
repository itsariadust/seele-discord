import { Args, Command } from '@sapphire/framework';
import Warn from '../../models/warnSchema';
import ShortUniqueId from 'short-unique-id';
import type { Message } from 'discord.js';

export class WarnCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'warn',
            description: 'Warns a member.',
            quotes: [],
            preconditions: [['OwnerOnly', 'ModOnly']],
        });
    }

    async messageRun(message: Message, args: Args) {
        const warnMember = await args.pick('member').catch(() => null);
        const warnMessage = await args.rest('string').catch(() => 'None provided.');
        const uid = new ShortUniqueId({ length: 5 });

        if (warnMember === null) {
            return message.reply('You didn\'t warn anyone! Mention the user after typing the command before entering.');
        }

        if (warnMember.id === message.client.user!.id) {
            return message.reply('I can\'t warn myself!');
        }

        let warnMemberEntry = await Warn.findOne({ guildID: message.guild!.id, warnedUserID: warnMember.id });
        const warnUID = uid();
        const warnEmbed = {
            color: 0x00FFFF,
            title: `Warning for ${warnMember.user.username}#${warnMember.user.discriminator}`,
            fields: [
                {
                    name: 'ID',
                    value: `${warnUID}`,
                    inline: true,
                },
                {
                    name: 'Target',
                    value: `<@${warnMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${warnMessage}`,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };

        if (!warnMemberEntry) {
            warnMemberEntry = new Warn({
                guildID: message.guild!.id,
                guildName: message.guild!.name,
                warnedUserID: warnMember.id,
                warnedUserName: warnMember.user.username,
                warnings: [],
            });
        }

        warnMemberEntry.warnings.push({
            warningID: warnUID,
            warningMessage: warnMessage,
            warningAuthorUserName: message.author.username,
            warningAuthorUserID: message.author.id,
            warningDate: message.createdAt,
        });
        try {
            await warnMemberEntry.save();
            message.channel.send({ embeds: [warnEmbed] });
        }
        catch (err) {
            console.log(err);
        }
    }
}