import { Args, Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class BiteCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'bite',
            description: 'Sends a bite GIF.',
        });
    }

    public async messageRun(message: Message, args: Args) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const target = await args.pick('member').catch(() => null);
        if (!target) return message.reply('You didn\'t mention any user!');
        const gif = await weeby.gif.fetch('bite');
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${message.author.username} bites ${target.user.username}!`,
                iconURL: `${message.author.avatarURL()}`,
            })
            .setImage(gif);
        return message.channel.send({ embeds: [embed] });
    }
}