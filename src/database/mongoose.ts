import mongoose from 'mongoose';
import { container } from '@sapphire/framework';

export default {
    init: () => {
        mongoose.connect(`${process.env.DATABASE_URL}`);

        mongoose.connection.on('connected', () => {
            container.logger.info('MongoDB connection successful.');
        });
        mongoose.connection.on('disconnected', () => {
            container.logger.info('The bot has been disconnected to the database.');
        });
        mongoose.connection.on('err', (err) => {
            container.logger.info('There was an error while connecting to the database:' + err);
        });
    },
};