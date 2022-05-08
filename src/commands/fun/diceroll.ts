import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class DiceRollCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'diceroll',
            description: 'A simple roll command. Default roll is a d6 dice but providing a number would correspond to a dx dice.',
            aliases: ['roll'],
        });
    }

    public async messageRun(message: Message, args: Args) {
        const dice = await args.pick('number');
        message.reply(`You rolled a ${Math.floor(Math.random() * dice) + 1}!`);
    }
}
