import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import WeebyAPI from 'weeby-js';

export class LickCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'lick',
            description: 'Sends a lick GIF.',
        });
    }

    public async messageRun(message: Message) {
        const weeby = new WeebyAPI(`${process.env.WEEBY_TOKEN}`);
        const gif = await weeby.gif.fetch('lick');
        return message.reply(gif);
    }
}