import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class SayCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'say',
            description: 'Make the bot say something.',
        });
    }

    async messageRun(message: Message, args: Args) {
        const say = await args.rest('string');
        await message.reply(`${say}`);
    }
}