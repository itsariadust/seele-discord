import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class PollCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'poll',
            description: 'Make a poll.',
        });
    }

    async messageRun(message: Message, args: Args) {
        const items = await args.repeat('string');
        const numbers: any = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const optionsString = items.slice(1).join('\r\n');
        const pollEmbed = new MessageEmbed()
            .setTitle(`${items[0]}`)
            .addField('Options', `${optionsString}`);
        const msg = await message.channel.send({ embeds: [pollEmbed] });
        for (let i = 1; i < items.length; i++) {
            await msg.react(numbers[i]);
        }
    }
}