import { Command } from '@sapphire/framework';
import axios from 'axios';
import type { Message } from 'discord.js';

export class CatCommand extends Command {
    constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'cat',
            description: 'Posts a cat image.'
        });
    }

    async messageRun(message: Message) {
        axios.get('https://aws.random.cat/meow')
            .then(function(response) {
                message.reply(response.data.file);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}