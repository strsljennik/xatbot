import path from 'path';
import { fileURLToPath } from 'url';
import Handlers from "./imports/HandlersIndex.js"

export class PacketHandler {
    constructor(bot) {
        this.bot = bot;
        this.handlers = new Map();
        this.handlersPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'handlers');
    }

    async init () {

        for (const handler of Handlers) {
            if (handler.default?.name && handler.default?.execute) {
                this.handlers.set(handler.default.name, handler.default);
            }
        }
    }

    async handle (type, packet) {
        const handler = type.toLowerCase();

        if (this.handlers.has(handler)) {
            await this.handlers.get(handler).execute(this.bot, packet);
        }
    }
}