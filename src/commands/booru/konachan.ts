import { Command } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import Booru from 'booru';

export class KonachanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'konachan',
            description: 'Fetch images from Konachan.com.',
            quotes: [],
        });
    }

    async messageRun(message, args) {
        const tag = await args.rest('string').catch(() => '*');
        const img = await Booru.search('konachan.com', [`${tag}`], { random: true });
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
