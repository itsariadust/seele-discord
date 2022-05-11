import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

export class FuckCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'fuck',
            description: 'Sends a fuck GIF.',
        });
    }

    public async messageRun(message: Message) {
        interface JsonResponse {
            error: boolean;
            link: string;
            time: number;
        }

        const data = await fetch<JsonResponse>(
            'https://purrbot.site/api/img/nsfw/fuck/gif/',
            FetchResultTypes.JSON,
        );
        return message.reply(data.link);
    }
}