import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { search } from 'booru';

export class DanbooruCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'danbooru',
            description: 'Fetch images from danbooru, a popular imageboard site for anime pictures.',
            quotes: [],
        });
    }

    async messageRun(message: Message, args: Args) {
        const tag = await args.rest('string').catch(() => '*');
        const img = await search('danbooru', [`${tag}`], { random: true });
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
