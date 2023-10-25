import { Args, Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class PunchCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'punch',
            description: 'Sends a punch GIF.',
        });
    }

    public async messageRun(message: Message, args: Args) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const target = await args.pick('member').catch(() => null);
        if (!target) return message.reply('You didn\'t mention any user!');
        const gif = await weeby.gif.fetch('punch');
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${message.author.username} punches ${target.user.username}!`,
                iconURL: `${message.author.avatarURL()}`,
            })
            .setImage(gif);
        return message.channel.send({ embeds: [embed] });
    }
}