import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class ThinkCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'think',
            description: 'Sends a think GIF.',
        });
    }

    public async messageRun(message: Message) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const gif = await weeby.gif.fetch('think');
        return message.reply(gif);
    }
}