import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Economy from '../../models/economySchema';

export class WalletCommand extends SubCommandPluginCommand {
    public constructor(context: SubCommandPluginCommand.Context, options: SubCommandPluginCommand.Options) {
        super(context, {
            ...options,
            name: 'wallet',
            description: 'Check out your wallet to see your balance',
            subCommands: ['create', 'view', { input: 'view', default: true }],
        });
    }

    public async create(message: Message) {
        let wallet = await Economy.findOne({ userID: message.author.id });
        if (wallet) {
            return message.reply('You already have a wallet.');
        }
        wallet = new Economy({
            userID: message.author.id,
            userName: message.author.username,
            userBalance: 500,
        });
        await wallet.save().catch((err: any) => console.log(err));
        return message.reply('Your wallet has been created! Your initial balance is $500.');
    }

    public async view(message: Message) {
        const wallet = await Economy.findOne({ userID: message.author.id });
        if (!wallet) {
            return message.reply('You don\'t have a wallet! Please use the `s!wallet create` command to make one.');
        }
        const walletEmbed = new MessageEmbed()
            .setTitle(`${message.author.username}#${message.author.discriminator}'s wallet`)
            .setThumbnail(message.author.displayAvatarURL())
            .addField('Balance:', `$${wallet.userBalance}`);
        return message.channel.send({ embeds: [walletEmbed] });
    }
}