import { Command } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import Booru from 'booru';

export class Rule34Command extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'rule34',
            description: 'Fetch images from rule34.xxx.',
            quotes: [],
        });
    }

    async messageRun(message, args) {
        const tag = await args.rest('string').catch(() => '*');
        const img = await Booru.search('r34', [`${tag}`], { random: true });
        if (img.length === 0) return message.channel.send('This is not a valid search term!');
        img.forEach((i) => {
            const booruEmbed = new MessageEmbed()
                .addField('URL', `${i.fileUrl}`)
                .addField('Tags', `\`${i.tags.join(', ')}\``)
                .setImage(`${i.fileUrl}`);
            message.channel.send({ embeds: [booruEmbed] });
        });
    }
}
