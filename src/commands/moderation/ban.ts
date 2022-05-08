import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class BanCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'ban',
            description: 'Bans the member from the server.',
            preconditions: [['OwnerOnly', 'ModOnly']],
            requiredClientPermissions: ['BAN_MEMBERS'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const banMember = await args.pick('member').catch(() => null);
        const banMessage = await args.rest('string').catch(() => 'None provided');

        if (banMember === null) {
            return message.reply('You didn\'t ban anyone! Mention the user after typing the command before entering.');
        }

        if (banMember.id === message.client.user!.id) {
            return message.reply('I can\'t ban myself!');
        }

        if (banMember.bannable === false) {
            return message.reply('I can\'t ban this member. Perhaps his role is higher than mine.');
        }

        const banEmbed = {
            color: 0x00FFFF,
            title: `Banned ${banMember.user.username}#${banMember.user.discriminator}`,
            fields: [
                {
                    name: 'Target',
                    value: `<@${banMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${banMessage}`,
                    inline: true,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };
        message.guild!.members.ban(banMember);
        return message.channel.send({ embeds: [banEmbed] });
    }
}