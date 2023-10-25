import { Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class BathCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'bath',
            description: 'Sends a bath GIF.',
        });
    }

    public async messageRun(message: Message) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const gif = await weeby.gif.fetch('bath');
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${message.author.username} is taking a nice bath~`,
                iconURL: `${message.author.avatarURL()}`,
            })
            .setImage(gif);
        return message.channel.send({ embeds: [embed] });
    }
}