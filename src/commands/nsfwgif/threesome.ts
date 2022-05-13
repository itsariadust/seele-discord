import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

export class ThreesomeCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'threesome',
            description: 'Sends a threesome GIF.',
            nsfw: true,
        });
    }

    public async messageRun(message: Message) {
        interface JsonResponse {
            error: boolean;
            link: string;
            time: number;
        }
        const flavors = ['threesome_fff', 'threesome_ffm', 'threesome_mmf'];
        const data = await fetch<JsonResponse>(
            `https://purrbot.site/api/img/nsfw/${flavors[Math.floor(Math.random() * flavors.length)]}/gif/`,
            FetchResultTypes.JSON,
        );
        return message.reply(data.link);
    }
}