import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import answers from '../../assets/json/8ball.json';

export class EightBallCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: '8ball',
            description: 'A simple 8ball command.',
        });
    }

    public async messageRun(message: Message, args: Args) {
        await args.rest('string');
        const answer = answers.answer;
        await message.reply(`${answer[Math.floor(Math.random() * answer.length)]}, ${message.author.username}.`);
    }
}
