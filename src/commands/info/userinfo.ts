import { Command, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

export class UserInfoCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'userinfo',
            description: 'Retrives user information.',
            aliases: ['user'],
        });
    }

    async messageRun(message: Message, args: Args) {
        const userInfo = await args.pick('member').catch(() => message.member);
        const roleMap = userInfo.roles.cache.mapValues(roles => roles.name);
        const roleArray = Array.from(roleMap.values());

        const userEmbed = new MessageEmbed()
            .setTitle(`Information about ${userInfo.displayName}#${userInfo.user.discriminator}`)
            .setColor(0xC63D85)
            .setThumbnail(userInfo.displayAvatarURL())
            .addField('ID', `${userInfo.id}`, true)
            .addField('Status', `${userInfo.presence ? userInfo.presence.status : 'offline'}`, true)
            .addField('Account Created:', `${userInfo.user.createdAt}`)
            .addField('Joined on:', `${userInfo.joinedAt}`)
            .addField('Server Nickname:', `${userInfo.displayName}`)
            .addField('Server Roles:', `${roleArray.join(', ')}`);
        return message.channel.send({ embeds: [userEmbed] });
    }
}