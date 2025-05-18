import path from 'path';
import { fileURLToPath } from 'url';
import Commands from "./imports/CommandsIndex.js"

export class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = new Map();
        this.commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'commands');
    }

    async init () {

        for (const command of Commands) {
            if (command.default?.name && command.default?.execute) {
                this.commands.set(command.default.name, command.default);
            }
        }

        this.bot.commands = this.commands;
    }

    async handle (text, xatID, from = 'main') {
        const [cmd, ...args] = text.split(' ');
        const command = cmd.slice(1).toLowerCase();

        if (this.commands.has(command)) {
            await this.commands.get(command).execute(this.bot, xatID, args.join(' '), from);
        }
    }
}