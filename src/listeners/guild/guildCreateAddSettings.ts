import GuildSettings from '../../models/guildSchema';
import { Listener, container } from '@sapphire/framework';
import type { Guild } from 'discord.js';

export class UserEvent extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildCreate',
        });
    }

    public async run(guild: Guild) {
        let guildSettings = await GuildSettings.findOne({ guildID: guild.id });
        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guildName: guild!.name,
                guildID: guild!.id,
                prefix: 's!',
            });
            await guildSettings.save().catch((err: any) => console.log(err));
            return container.logger.info(`Bot entered Guild ${guild.name} (${guild.id}) for the first time.`);
        }

        return container.logger.info(`Bot entered Guild ${guild.name} (${guild.id}).`);
    }
}
