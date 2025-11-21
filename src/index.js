import { config } from 'dotenv';
import { sequelize } from './core/Database.js';
import { Bot } from './core/Bot.js';
import './ping.js';
import express from 'express';

config();

// Start small HTTP server for Render health check
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('Bot is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

(async () => {
    await sequelize.authenticate();
    await sequelize.sync();
    new Bot();
})();
