import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class KickCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'kick',
            description: 'Kicks the member from the server.',
            preconditions: [['OwnerOnly', 'ModOnly']],
            requiredClientPermissions: ['KICK_MEMBERS'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const kickMember = await args.pick('member').catch(() => null);
        const kickMessage = await args.rest('string').catch(() => 'None provided');

        if (kickMember === null) {
            return message.reply('You didn\'t kick anyone! Mention the user after typing the command before entering.');
        }

        if (kickMember.id === message.client.user!.id) {
            return message.reply('I can\'t kick myself!');
        }

        if (kickMember.kickable === false) {
            return message.reply('I can\'t kick this member. Perhaps their role is higher than mine.');
        }

        const kickEmbed = {
            color: 0x00FFFF,
            title: `Kicked ${kickMember.user.username}#${kickMember.user.discriminator}`,
            fields: [
                {
                    name: 'Target',
                    value: `<@${kickMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${kickMessage}`,
                    inline: true,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };
        message.guild!.members.kick(kickMember, kickMessage);
        return message.channel.send({ embeds: [kickEmbed] });
    }
}