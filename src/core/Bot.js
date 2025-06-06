import { promises as fs } from "fs";
import { setupLogger } from "../services/logger.js";
import { BotState } from "../services/state.js";
import { WebSocketData } from "../services/websocket.js";
import { XatBlogAPI } from "../api/XatBlogAPI.js";
import { sanitize, runIfConnected } from "../utils/helpers.js";
import { PacketHandler } from "./PacketHandler.js";
import { CommandHandler } from "./CommandHandler.js";
import { Settings } from "../models/Settings.js";
import { OpenAI } from "../api/OpenAI.js";

export class Bot {
    /**
     * Initializes the bot instance, handlers and WebSocket.
     */
    constructor() {
        this.logger = setupLogger();
        this.state = new BotState();

        this.OpenAI = new OpenAI(this.state);
        this.xatBlogAPI = new XatBlogAPI();

        this.packetHandler = new PacketHandler(this);
        this.commandHandler = new CommandHandler(this);

        this.init();
    }

    /**
     * Initializes the bot, loads settings, logs in,
     * and connects to the chat server.
     */
    async init () {
        try {
            await this.getFromDb();

            if (!this.state.settings) {
                await Settings.create({ id: 1 });
                await this.getFromDb();
            }

            await this.getChatInfo();

            await this.packetHandler.init();
            await this.commandHandler.init();

            await this.login();
            await this.connect();
            await this.keepRunning();
        } catch (error) {
            this.logger.error(`Init error: ${error.message} - ${error.stack}`);
            process.exit(1);
        }
    }

    /**
     * Log in to xat.
     */
    async login () {
        var loginData;

        try {
            loginData = JSON.parse(await fs.readFile("./cache/login.json", "utf-8"));
        } catch { }

        if (loginData?.i === undefined) {
            this.state.isLoggingIn = true;
        } else {
            this.state.loginInfo = loginData;
        }
    }

    /**
     * Establishes a WebSocket connection.
     * @param {number} room - Chat ID
     */
    async connect (room = 0) {
        this.state.ws = WebSocketData(this, room);
    }

    /**
     * Sends a packet to xat.
     * @param {string} name - Packet name
     * @param {object} data - Packet data
     */
    async send (name, data) {
        if (!this.state.ws) return;

        try {
            let packet = `<${name} `;

            for (const [key, value] of Object.entries(data)) {
                if (value !== false) {
                    packet += `${key}="${sanitize(value.toString())}" `;
                }
            }
            packet += packet.endsWith(" ") ? "/>" : " />";
            this.logger.info(`>> ${packet}`);
            this.state.ws.send(packet + "\x00");
        } catch (error) {
            this.logger.error(`Send error: ${error.message} - ${error.stack}`);
        }
    }

    /**
     * Retrieves about the current chat.
     */
    async getChatInfo () {
        const data = await this.xatBlogAPI.chatInfo(this.state.envData.chat);
        if (!data?.chat?.id) {
            this.logger.error("Chat not found");
            process.exit(1);
        }
        this.state.chatInfo = data.chat;
    }

    /**
     * Reply to a message.
     * @param {string} message - Message
     * @param {string} to - User ID
     */
    async reply (message, userId, to) {
        if (to === "pm") {
            return await this.sendPM(message, userId);
        } else if (to === "pc") {
            return await this.sendPC(message, userId);
        }
        await this.sendMessage(message);
    }

    /**
     * Sends a PC to a user.
     * @param {string} message - Message
     * @param {number} userId - User ID
     */
    async sendPC (message, userId) {
        await this.send("p", {
            u: userId,
            t: message,
            s: 2,
            d: this.state.loginInfo.i,
        });
    }

    /**
     * Sends a PM to a user.
     * @param {string} message - Message
     * @param {number} userId - User ID
     */
    async sendPM (message, userId) {
        await this.send("p", {
            u: userId,
            t: message,
        });
    }

    /**
     * Sends a message to the chat room.
     * @param {string} message - Message
     */
    async sendMessage (message) {
        await this.send("m", {
            t: message,
            u: this.state.loginInfo.i,
        });
    }

    /**
     * Restart xat bot.
     */
    async restart () {
        await this.send("C", {});
        this.state.isConnected = false;
        this.state.ws.terminate();
        this.connect();
    }

    /**
     * Force the bot to relogin.
     */
    async relogin () {
        await this.send("v", {
            n: this.state.loginInfo.i,
            p: 0,
        });
    }

    /**
     * Load data from settings.
     */
    async getFromDb () {
        this.state.settings = await Settings.findOne({
            where: { id: 1 }
        });
    }

    /**
     * Update fields on database.
     * @param {object} toUpdate 
     */
    async updateDb (toUpdate) {
        try {
            await Settings.update(toUpdate, {
                where: { id: 1 }
            });
            await this.getFromDb();
        } catch (error) {
            this.logger.error(`Error updating settings: ${error} - ${error.stack}`)
        }
    }

    /**
     * Kicks a user.
     * @param {number} userId - User ID to kick.
     * @param {string} [reason=''] - Reason for kick.
     * @param {string} [sound=''] - Optional sound string.
     */
    async kick (userId, reason = '', sound = '') {
        const maxKicks = Number(this.state.settings.maxKicks);
        const banDurationHours = Number(this.state.settings.banDurationHours);
        const user = this.state.getUser(userId);

        if (!user || user.isMod() || user.isOwner() || user.isMain()) return;

        if (maxKicks > 0 && banDurationHours > 0) {
            const kicks = this.state.incrementKick(userId);
            reason += ` [${kicks}/${maxKicks}]`;

            if (kicks >= maxKicks) {
                this.state.resetKicks(userId);
                return this.ban(userId, banDurationHours, reason);
            }
        }

        this.send("c", {
            p: reason + sound,
            u: userId,
            t: '/k'
        });
    }

    /**
     * Bans a user for a specified number of hours.
     * @param {number} userId - User ID to ban.
     * @param {number} hours - Duration in hours.
     * @param {string} reason - Reason for ban.
     * @param {string} [type='g'] - Ban type (default global).
     * @param {string} [gamebanid=''] - Optional gameban ID.
     */
    async ban (userId, hours, reason, type = 'g', gamebanid = '') {
        if (hours < 0) hours = 1;

        const seconds = hours * 3600;

        const packet = {
            p: reason,
            u: userId,
            t: `/${type}${seconds}`
        };

        if (gamebanid) packet.w = gamebanid;

        this.send("c", packet);
    }

    /**
     * Unbans a user.
     * @param {number} userId - User ID to unban.
     */
    async unban (userId) {
        this.send("c", {
            u: userId,
            t: '/u'
        });
    }

    /**
     * Changes a user's rank.
     * @param {number} userId - User ID.
     * @param {string} rank - Rank string: 'owner', 'moderator', 'member', 'guest'.
     */
    async giveRank (userId, rank) {
        const rankCmd = {
            owner: '/M',
            moderator: '/m',
            member: '/e',
            guest: '/r',
        };

        if (!rankCmd[rank]) return;

        this.send("c", {
            u: userId,
            t: rankCmd[rank]
        });
    }

    /**
     * Gives a temporary rank to a user.
     * @param {number} userId - User ID.
     * @param {string} rank - Rank string: 'owner', 'moderator', 'member'.
     * @param {number} hours - Number of hours (1-24).
     */
    async giveTempRank (userId, rank, hours) {
        if (!hours || hours < 1 || hours > 24) hours = 1;

        const rankCmd = {
            owner: '/mo',
            moderator: '/m',
            member: '/mb',
        };

        if (!rankCmd[rank]) return;

        await this.sendPC(userId, `${rankCmd[rank]}${hours}`);
    }

    /**
     * Moderation filter based on OpenAI.
     * @param {number} userId - User ID
     * @param {string} message - Message to check
     */
    async moderationFilters (userId, message) {
        if (!message || !userId) return;

        try {
            const result = await this.OpenAI.moderate(message);
            const flags = this.OpenAI.constructor.parseModerationResult(result);

            if (flags.isFlagged) {
                const flagged = Object.entries(flags)
                    .filter(([k, v]) => k !== 'isFlagged' && v === true)
                    .map(([k]) => k.replace(/^is/, ''));
                const reason = `Mod Filter: [${flagged.join(', ') || 'Unknown'}]`;
                await this.kick(userId, reason);
            }
        } catch (e) { }
    }

    /**
     * Keeps the bot running and run tasks.
     */
    async keepRunning () {
        runIfConnected(() => this.state.ws.ping(), this, 30000);
        runIfConnected(() => this.send("ping", []), this, 60000);
        runIfConnected(() => this.send("c", {
            u: this.state.loginInfo.i,
            t: "/KEEPALIVE",
        }), this, 900000);
    }

    /**
     * Checks if a user has enough permissions.
     * @param {number} uid - User ID
     * @param {string} from - Source (main, pc, pm)
     * @returns {boolean} - True or False
     */
    hasPermission (uid, from) {
        const hasPermission = this.state.envData.owners?.includes(Number(uid));

        if (!hasPermission) {
            this.reply(
                "You can not use this command.",
                uid,
                from === "main" ? "pm" : from
            );

            return false;
        }

        return true;
    }
}
