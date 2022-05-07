import { Command } from '@sapphire/framework';
import { Permissions } from 'discord.js';
import Ban from '../../models/banSchema.js';
import ShortUniqueId from 'short-unique-id';

export class BanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ban',
            description: 'Bans the member from the server.',
            quotes: [],
            preconditions: ['OwnerOnly'],
        });
    }

    async messageRun(message, args) {
        const banMember = await args.pick('member').catch(() => null);
        const banMessage = await args.rest('string').catch(() => 'None provided');
        const uid = new ShortUniqueId({ length: 5 });

        if (banMember === null) {
            return message.reply('You didn\'t ban anyone! Mention the user after typing the command before entering.');
        }

        if (banMember.id === message.client.user.id) {
            return message.reply('I can\'t ban myself!');
        }

        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return message.reply('I have no permissions to do this command. Please give me the Ban Members permissions.');
        }

        if (banMember.bannable === false) {
            return message.reply('I can\'t ban this member. Perhaps his role is higher than mine.');
        }

        let bannedList = await Ban.findOne({ guildID: message.guild.id });
        const banUID = uid();
        const banEmbed = {
            color: 0x00FFFF,
            title: `Banned ${banMember.user.username}#${banMember.user.discriminator}`,
            fields: [
                {
                    name: 'ID',
                    value: `${banUID}`,
                    inline: true,
                },
                {
                    name: 'Target',
                    value: `<@${banMember.id}>`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${banMessage}`,
                },
            ],
            timestamp: message.createdAt,
            footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.avatarURL()}`,
            },
        };

        if (!bannedList) {
            const entry = {
                guildID: message.guild.id,
                guildName: message.guild.name,
                banRecord: [{
                    banID: banUID,
                    bannedUserID: banMember.id,
                    bannedUserName: banMember.user.username,
                    banMessage: banMessage,
                    banAuthorUserName: message.author.username,
                    banAuthorUserID: message.author.id,
                    banDate: message.createdAt,
                }],
            };
            bannedList = new Ban(entry);
            await bannedList.save().catch(err => console.log(err));
            message.guild.members.ban(banMember);
            return message.channel.send({ embeds: [banEmbed] });
        }

        bannedList.banRecord.push({
            banID: banUID,
            bannedUserID: banMember.id,
            bannedUserName: banMember.user.username,
            banMessage: banMessage,
            banAuthorUserName: message.author.username,
            banAuthorUserID: message.author.id,
            banDate: message.createdAt,
        });
        await bannedList.save().catch(err => console.log(err));
        message.guild.members.ban(banMember);
        return message.channel.send({ embeds: [banEmbed] });
    }
}