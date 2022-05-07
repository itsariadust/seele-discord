import mongoose from 'mongoose';

export default {
    init: () => {
        mongoose.connect(`${process.env.DATABASE_URL}`);

        mongoose.connection.on('connected', () => {
            console.log('The bot has connected to the database.');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('The bot has been disconnected to the database.');
        });
        mongoose.connection.on('err', (err) => {
            console.log('There was an error while connecting to the database:' + err);
        });
    },
};