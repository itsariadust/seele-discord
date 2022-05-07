// Will wait for weeby API token before I finish this. The function is currently a placeholder.

import { Command } from '@sapphire/framework';
import fetch from 'node-fetch';

export class AngryReactCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'angry',
            description: 'Angry reaction image.',
        });
    }

    async messageRun() {
        const myFunc = async () => {
            const response = await fetch('https://anime-reactions.uzairashraf.dev/api/categories');
            const data = await response.json();
            console.log(data);
        };
        myFunc();
    }
}
