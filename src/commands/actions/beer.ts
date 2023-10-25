import { Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class BeerCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'beer',
            description: 'Sends a beer GIF.',
        });
    }

    public async messageRun(message: Message) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const gif = await weeby.gif.fetch('beer');
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${message.author.username} is chugging on some good beer!`,
                iconURL: `${message.author.avatarURL()}`,
            })
            .setImage(gif);
        return message.channel.send({ embeds: [embed] });
    }
}