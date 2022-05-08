import { Precondition } from '@sapphire/framework';
import Guild from '../models/guildSchema';
import type { Message } from 'discord.js';

export class ModOnlyPrecondition extends Precondition {
    public async run(message: Message) {
        const guildSettings = await Guild.findOne({ guildID: message.guild!.id });
        const memberRoleMap = message.member!.roles.cache.mapValues(roles => roles.id);
        const memberRoleArray = Array.from(memberRoleMap.values());
        const modRoleArray = guildSettings.modroles;

        return memberRoleArray.some(role => modRoleArray.includes(role))
            ? this.ok()
            : this.error({ message: 'Only moderators can use this command! Perhaps your moderator role hasn\'t been added to the bot, in this case contact the owner to add it.' });
    }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ModOnly: never;
	}
}