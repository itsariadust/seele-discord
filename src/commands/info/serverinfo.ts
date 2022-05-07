import { Command } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';

export class ServerInfoCommand extends Command {
    constructor(context: Command.Context, options:Command.Options) {
        super(context, {
            ...options,
            name: 'serverinfo',
            description: 'Retrives server information.',
        });
    }

    async messageRun(message: Message) {
        const guildData = message.guild;
        // get the array of roles in a server
        const fetchRoles = await guildData!.roles.fetch();
        const roleMap = fetchRoles.mapValues(roles => roles.name);
        const roleArray = Array.from(roleMap.values());
        // get the array of channels in a server
        const guildChannelCount = await guildData!.channels.cache;
        const guildChannelCountMap = guildChannelCount.mapValues(channels => channels.type);
        const guildChannelCountArray = Array.from(guildChannelCountMap.values());
        const counts = {};
        guildChannelCountArray.forEach(function(x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        const serverEmbed = new MessageEmbed()
            .setTitle(`Information about ${guildData!.name}`)
            .setColor(0xC63D85)
            .setThumbnail(`${guildData?.iconURL()}`)
            .addField('ID', `${guildData!.id}`, true)
            .addField('Server Owner', `${await guildData!.fetchOwner()}`, true)
            .addField('Created On', `${guildData!.createdAt}`)
            .addField('Channels', `Category: ${counts.GUILD_CATEGORY}\nText: ${counts.GUILD_TEXT}\nVoice: ${counts.GUILD_VOICE}`)
            .addField('Members', `${guildData!.memberCount}`)
            .addField('Roles', `${roleArray.join(', ')}`);
        return message.channel.send({ embeds: [serverEmbed] });
    }
}