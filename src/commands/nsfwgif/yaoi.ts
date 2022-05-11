import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

export class YaoiCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'yaoi',
            description: 'Sends a yaoi GIF.',
        });
    }

    public async messageRun(message: Message) {
        interface JsonResponse {
            error: boolean;
            link: string;
            time: number;
        }

        const data = await fetch<JsonResponse>(
            'https://purrbot.site/api/img/nsfw/yaoi/gif/',
            FetchResultTypes.JSON,
        );
        return message.reply(data.link);
    }
}