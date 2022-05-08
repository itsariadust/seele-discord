import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UnbanCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'unban',
            description: 'Unbans the member from the server.',
            quotes: [],
            preconditions: [['OwnerOnly', 'ModOnly']],
            requiredClientPermissions: ['BAN_MEMBERS'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const unbanMember = await args.pick('user').catch(() => null);
        const unbanMessage = await args.rest('string').catch(() => 'None provided');

        if (unbanMember === null) {
            return message.reply('You didn\'t unban anyone! Mention the user after typing the command before entering.');
        }

        if (unbanMember.id === message.client.user!.id) {
            return message.reply('I can\'t unban myself!');
        }

        const banEmbed = {
            color: 0x00FFFF,
            title: `Unbanned ${unbanMember.username}#${unbanMember.discriminator}`,
            fields: [
                {
                    name: 'Target',
                    value: `<@${unbanMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${unbanMessage}`,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };

        message.guild!.members.unban(unbanMember);
        return message.channel.send({ embeds: [banEmbed] });
    }
}