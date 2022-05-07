import { Command } from '@sapphire/framework';
import axios from 'axios';

export class CatCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'cat',
            description: 'Posts a cat image.',
        });
    }

    async messageRun(message) {
        axios.get('https://aws.random.cat/meow')
            .then(function(response) {
                message.reply(response.data.file);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}