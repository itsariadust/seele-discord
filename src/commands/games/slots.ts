import { Args, Command } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { stripIndents } from 'common-tags';
import type { Message } from 'discord.js';
import Economy from '../../models/economySchema';

export class SlotsCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'slots',
            description: 'Play slots.',
            cooldownDelay: Time.Second * 10,
        });
    }

    public async messageRun(message: Message, args: Args) {
        const bet = await args.pick('number').catch(() => 1);
        const slots = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
        const { finalSlotOne, finalSlotTwo, finalSlotThree } = this.finalSlots(slots);
        const wallet = await Economy.findOne({ userID: message.author.id });

        // place a bet and update the balance in the DB
        wallet.userBalance = wallet.userBalance - bet;
        await wallet.save().catch((err: any) => console.log(err));
        message.reply(`You placed a bet of $${bet}.`);

        const msg = await message.channel.send(stripIndents`
            ${slots[Math.floor(Math.random() * slots.length)]}|${slots[Math.floor(Math.random() * slots.length)]}|${slots[Math.floor(Math.random() * slots.length)]}
        `);

        for (let i = 0; i < 1; i++) {
            msg.edit(stripIndents`
                ${slots[Math.floor(Math.random() * slots.length)]}|${slots[Math.floor(Math.random() * slots.length)]}|${slots[Math.floor(Math.random() * slots.length)]}
            `);
            msg.edit(stripIndents`
                ${finalSlotOne}|${finalSlotTwo}|${finalSlotThree}
            `);
        }

        if (finalSlotOne === finalSlotTwo && finalSlotOne === finalSlotThree) {
            wallet.userBalance = wallet.userBalance + bet * 2;
            await wallet.save().catch((err: any) => console.log(err));
            return msg.edit(stripIndents`
                ${finalSlotOne}|${finalSlotTwo}|${finalSlotThree}
                Congratulations! You won $${bet * 2}!
            `);
        }
        return msg.edit(stripIndents`
            ${finalSlotOne}|${finalSlotTwo}|${finalSlotThree}
            Aww... You lost... Good luck next time!
        `);
    }

    private finalSlots(slots: string[]) {
        const finalSlotOne = slots[Math.floor(Math.random() * slots.length)];
        const finalSlotTwo = slots[Math.floor(Math.random() * slots.length)];
        const finalSlotThree = slots[Math.floor(Math.random() * slots.length)];
        return { finalSlotOne, finalSlotTwo, finalSlotThree };
    }
}