import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class ChoiceCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'choice',
            aliases: ['choose'],
            description: 'A choice command. Let the bot choose for you.',
        });
    }

    public async messageRun(message: Message, args: Args) {
        const option1 = await args.pick('string');
        const option2 = await args.pick('string');
        const options = [option1, option2];
        const result = options[Math.floor(Math.random() * options.length)];

        await message.reply(`I choose ${result}!`);
    }
}
