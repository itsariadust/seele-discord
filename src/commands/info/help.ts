import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class HelpCommand extends Command {
    constructor(context: Command.Context, options:Command.Options) {
        super(context, {
            ...options,
            name: 'help',
            description: 'Gives you information about this bot\'s function like commands.',
        });
    }

    async messageRun(message: Message) {
        return message.channel.send('The help command will be built soon!');
    }
}