import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class YesNoCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'yesno',
            description: 'Make a poll with only the options yes or no.',
        });
    }

    async messageRun(message: Message, args: Args) {
        const poll = await args.rest('string');
        const pollEmbed = new MessageEmbed()
            .setTitle(`${poll}`);
        const msg = await message.channel.send({ embeds: [pollEmbed] });
        msg.react('✅')
            .then(() => msg.react('❌'))
            .catch(error => console.error('One of the emojis failed to react:', error));
    }
}