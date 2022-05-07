import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { search } from 'booru';

export class KonachanCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'konachan',
            description: 'Fetch images from Konachan.com.',
            quotes: [],
        });
    }

    async messageRun(message: Message, args: Args) {
        const tag = await args.rest('string').catch(() => '*');
        const img = await search('konachan.com', [`${tag}`], { random: true });
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
