import { Command } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import type { Message } from 'discord.js';
import Economy from '../../models/economySchema';

export class DailyCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'daily',
            description: 'Receive $500 credits every day.',
            cooldownDelay: Time.Day * 1,
        });
    }

    public async messageRun(message: Message) {
        const wallet = await Economy.findOne({ userID: message.author.id });
        if (!wallet) {
            return message.reply('You don\'t have a wallet! Please use the `s!wallet create` command to make one.');
        }
        const newBalance = wallet.userBalance + 500;
        wallet.userBalance = newBalance;
        await wallet.save().catch((err: any) => console.log(err));
        return message.reply('You have received $500 credits!');
    }
}