export default {
    name: 'mod', // Command name

    /**
     * Executes the command.
     * @param {Bot} bot - Bot instance
     * @param {string} xatID - User ID
     * @param {string} message - Message
     * @param {string} from - Source (main, pc, pm)
     */
    async execute (bot, xatID, message, from) {
        if (!bot.hasPermission(xatID, from)) return;

        const opts = bot.state.settings;
        if (!message) {
            return await bot.reply(
                `maxKicks: ${opts.maxKicks} | banTime: ${opts.banDurationHours} | filters: ${opts.modFilters}`,
                xatID, from
            );
        }

        const [option, ...rest] = message.trim().split(/\s+/);
        const value = rest.join(' ');
        let updateObj = {};
        
        switch (option.toLowerCase()) {
            case 'maxkicks':
                if (!/^[0-9]+$/.test(value))
                    return await bot.reply('Invalid value.', xatID, from);
                updateObj.maxKicks = parseInt(value);
                break
                ;
            case 'bantime':
                if (!/^[0-9]+$/.test(value))
                    return await bot.reply('Invalid value.', xatID, from);
                updateObj.banDurationHours = parseInt(value);
                break;

            case 'status':
                if (!['on', 'off'].includes(value.toLowerCase()))
                    return await bot.reply('Invalid value.', xatID, from);
                updateObj.modFilters = value.toLowerCase();
                break;
                
            default:
                return await bot.reply('Use: maxkicks, bantime, status', xatID, from);
        }
        await bot.updateDb(updateObj);
        await bot.reply('Updated.', xatID, from);
        await bot.restart();
    }
};
