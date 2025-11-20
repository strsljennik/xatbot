import { config } from 'dotenv';
import { sequelize } from './core/Database.js';
import { Bot } from './core/Bot.js';
import express from 'express';

config();

(async () => {
    await sequelize.authenticate();
    await sequelize.sync();

    // Dummy HTTP server da Render ne prijavljuje timeout
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.get('/', (req, res) => res.send('Bot is running'));
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

    // Admin bot
    const mainBot = new Bot({
        username: process.env.BOT_USER,
        apikey: process.env.BOT_APIKEY,
        chat: process.env.BOT_CHAT
    });

    // Obični botovi (bez komandi, samo da se pojave u chat-u)
    const guestBots = [
        { user: process.env.BOT_USER_2, key: process.env.BOT_APIKEY_2 },
        { user: process.env.BOT_USER_3, key: process.env.BOT_APIKEY_3 },
        { user: process.env.BOT_USER_4, key: process.env.BOT_APIKEY_4 },
        { user: process.env.BOT_USER_5, key: process.env.BOT_APIKEY_5 },
        { user: process.env.BOT_USER_6, key: process.env.BOT_APIKEY_6 },
    ];

    guestBots.forEach(g => {
        new Bot({ username: g.user, apikey: g.key, chat: process.env.BOT_CHAT });
    });
})();
