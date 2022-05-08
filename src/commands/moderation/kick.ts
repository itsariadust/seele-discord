import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import Kick from '../../models/kickSchema.js';
import ShortUniqueId from 'short-unique-id';

export class KickCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'kick',
            description: 'Kicks the member from the server.',
            quotes: [],
            preconditions: ['OwnerOnly'],
            requiredClientPermissions: ['KICK_MEMBERS'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const kickMember = await args.pick('member').catch(() => null);
        const kickMessage = await args.rest('string').catch(() => 'None provided');
        const uid = new ShortUniqueId({ length: 5 });

        if (kickMember === null) {
            return message.reply('You didn\'t kick anyone! Mention the user after typing the command before entering.');
        }

        if (kickMember.id === message.client.user!.id) {
            return message.reply('I can\'t kick myself!');
        }

        if (kickMember.kickable === false) {
            return message.reply('I can\'t kick this member. Perhaps his role is higher than mine.');
        }

        let kickedList = await Kick.findOne({ guildID: message.guild!.id });
        const kickUID = uid();
        const kickEmbed = {
            color: 0x00FFFF,
            title: `Banned ${kickMember.user.username}#${kickMember.user.discriminator}`,
            fields: [
                {
                    name: 'ID',
                    value: `${kickUID}`,
                    inline: true,
                },
                {
                    name: 'Target',
                    value: `<@${kickMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${kickMessage}`,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };

        if (!kickedList) {
            const entry = {
                guildID: message.guild!.id,
                guildName: message.guild!.name,
                kickRecord: [{
                    kickID: kickUID,
                    kickedUserID: kickMember.id,
                    kickedUserName: kickMember.user.username,
                    kickMessage: kickMessage,
                    kickAuthorUserName: message.author.username,
                    kickAuthorUserID: message.author.id,
                    kickDate: message.createdAt,
                }],
            };
            kickedList = new Kick(entry);
            await kickedList.save().catch((err: any) => console.log(err));
            message.guild!.members.kick(kickMember, kickMessage);
            return message.channel.send({ embeds: [kickEmbed] });
        }

        kickedList.kickRecord.push({
            kickID: kickUID,
            kickedUserID: kickMember.id,
            kickedUserName: kickMember.user.username,
            kickMessage: kickMessage,
            kickAuthorUserName: message.author.username,
            kickAuthorUserID: message.author.id,
            kickDate: message.createdAt,
        });
        await kickedList.save().catch((err: any) => console.log(err));
        message.guild!.members.kick(kickMember, kickMessage);
        return message.channel.send({ embeds: [kickEmbed] });
    }
}