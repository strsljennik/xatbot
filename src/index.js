import { config } from 'dotenv';
import express from 'express';
import { sequelize } from './core/Database.js';
import { Bot } from './core/Bot.js';

config();

// Dummy Express server za Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot server running'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

(async () => {
    try {
        // Konektuj bazu
        await sequelize.authenticate();
        await sequelize.sync();

        // Pokreni admin bota
        console.log("Starting admin bot...");
        await new Bot({
            username: process.env.BOT_USER,
            apikey: process.env.BOT_APIKEY,
            chat: process.env.BOT_CHAT
        });

        // Definiši guest botove (svi koriste isti API key)
        const guestBots = [
            { user: process.env.BOT_USER_2 || process.env.BOT_USER, key: process.env.BOT_APIKEY },
            { user: process.env.BOT_USER_3 || process.env.BOT_USER, key: process.env.BOT_APIKEY },
            { user: process.env.BOT_USER_4 || process.env.BOT_USER, key: process.env.BOT_APIKEY },
            { user: process.env.BOT_USER_5 || process.env.BOT_USER, key: process.env.BOT_APIKEY },
            { user: process.env.BOT_USER_6 || process.env.BOT_USER, key: process.env.BOT_APIKEY }
        ];

        // Startuj botove serijski sa malim delay-om
        for (const g of guestBots) {
            console.log(`Starting guest bot: ${g.user}`);
            await new Bot({
                username: g.user,
                apikey: g.key,
                chat: process.env.BOT_CHAT
            });
            await new Promise(r => setTimeout(r, 200)); // 200ms pauza između botova
        }

        console.log("All bots started successfully!");
    } catch (error) {
        console.error("Error initializing bots:", error);
        process.exit(1);
    }
})();
