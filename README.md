# Free Xat Bot

A free, open-source bot for xat.com chat rooms built with Node.js. This bot provides various commands and automated features to enhance your chat room experience.

## Features

- **Automated Welcome Messages**: Greet new users joining the chat
- **Command System**: Various commands for bot management and user interaction
- **User Management**: Track users joining and leaving the chat
- **Customizable Settings**: Configure bot appearance, messages, and behavior
- **Database Storage**: Persistent settings using SQLite
- **Permission System**: Owner-only commands for security
- **Auto-reconnection**: Handles disconnections and reconnects automatically
- **New WebSocket System**: Compatible with xat's latest WebSocket implementation

## Requirements

- Node.js (version 18 or higher)
- npm package manager
- Xat.com account with API access
- Valid xat username and API key

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xlaming/free-xat-bot
   cd free-xat-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit the `.env` file in the root directory and configure the following:
   ```env
   # Account information
   BOT_USER=your_xat_username
   BOT_APIKEY=your_xat_api_key

   # Main configuration
   BOT_CHAT=your_chat_name

   # Users with special permissions (user IDs separated by commas)
   BOT_OWNERS=[123456,789012]

   # Disabled powers (power IDs separated by commas)
   DISABLED_POWERS=[29]

   # Websocket configuration (⚠️ DO NOT MODIFY! ⚠️)
   WEBSOCKET_URL=wss://wss.xat.com/v2
   WEBSOCKET_ORIGIN=https://xat.com
   ```

## Usage

### Starting the Bot

**Start the bot:**
```bash
npm run start
```

**Development mode (with auto-restart):**
```bash
npm run dev
```

🎉 **If everything is configured correctly, the bot will magically connect to your chat!** 🎉

### Available Commands

All commands start with the configured command character (default: `!`). Most commands require owner permissions.

#### General Commands (Available to all users)
- `!ping` - Check if the bot is responsive
- `!info` - Display bot information
- `!commands` - List all available commands
- `!id [username]` - Get user ID from username
- `!reg [userid]` - Get username from user ID

#### Bot Management (Owner only)
- `!restart` - Restart the bot connection
- `!clear` - Clear the chat (sends multiple delete commands)
- `!say [message]` - Make the bot say something in chat

#### Bot Configuration (Owner only)
- `!char [character]` - Change the command prefix character
- `!nick [nickname]` - Change the bot's nickname
- `!status [message]` - Set the bot's status message (use `clear` to remove)
- `!avatar [id]` - Change the bot's avatar ID
- `!home [url]` - Set the bot's homepage (use `clear` to remove)
- `!pcback [url]` - Set the bot's PC background (use `clear` to remove)
- `!pstyle [url]` - Set the bot's profile style image
- `!stealth [on/off]` - Toggle stealth mode

#### Welcome System (Owner only)
- `!welcomemsg [message]` - Set welcome message for new users (use `off` to disable)
  - Available placeholders: `{chatname}`, `{chatid}`, `{user}`, `{name}`, `{uid}`
- `!welcometype [pc/pm]` - Set how welcome messages are sent (PC or PM)

### Welcome Message Placeholders

When configuring welcome messages, you can use these placeholders:
- `{chatname}` - The chat room name
- `{chatid}` - The chat room ID
- `{user}` - The user's registered name (or "Unregistered")
- `{name}` - The user's display name (cleaned)
- `{uid}` - The user's ID

Example: `Welcome to {chatname}, {name}! Your ID is {uid}.`

## Configuration

### Getting XAT API Credentials

1. **Username**: Your xat registered username that will be used for the bot
2. **API Key**: Obtain from the xat login page after successfully logging in
3. **Chat Name**: The name of the chat room where you want to run the bot

### Bot Owners
Add user IDs to the `BOT_OWNERS` array in the `.env` file. These users will have permission to use all bot commands. You can find your user ID using the `!id` command with your username.

### Disabled Powers
If you want to disable certain xat powers for the bot, add their power IDs to the `DISABLED_POWERS` array. Power ID 29 (ban) is disabled by default for safety.

## Creating Custom Commands

To create new commands, simply:

1. **Create a new file** inside the `src/commands` folder
2. **Follow the structure** of existing command files to ensure compatibility
3. **Restart your bot** to load the new command

### Command File Structure
```javascript
export default {
    name: "yourcommand", // Command name

    /**
     * Executes the command.
     * @param {Bot} bot - Bot instance
     * @param {string} xatID - User ID
     * @param {string} message - Message/arguments
     * @param {string} from - Source (main, pc, pm)
     */
    async execute(bot, xatID, message, from) {
        // Check permissions if needed
        if (!bot.hasPermission(xatID, from)) return;

        // Your command logic here
        await bot.reply("Your response", xatID, from);
    },
};
```

**Note**: In the `src/api` directory, you will find many useful functions that can help you make new commands.

## Logging

The bot automatically logs all activities to:
- **Console output** (with colors for better readability)
- **File**: `logs/app.log` (persistent logging)

## Troubleshooting

### Common Issues

1. **Bot won't connect:**
   - Verify your xat credentials in the `.env` file
   - Check if the chat name exists and is accessible
   - Ensure you have proper API access on your xat account
      - Check network connectivity and firewall settings

2. **Commands not working:**
   - Verify your user ID is in the `BOT_OWNERS` array
   - Check the command prefix character (default: `!`)
   - Ensure the bot has necessary permissions in the chat room
   - Check console logs for permission errors

3. **Database errors:**
   - Delete `database.db` and restart the bot to recreate tables
   - Check file permissions in the bot directory
   - Ensure SQLite3 is properly installed

4. **WebSocket connection issues:**
   - Check if xat.com is accessible
   - Verify WebSocket URLs in `.env` are correct
   - Look for network proxy or firewall blocking WebSocket connections

### Error Codes

The bot handles various xat-specific error codes:
- `e45` - Temporary ban (bot will exit with error message)
- `e03`, `e16`, `f011`, `e43` - Connection issues (automatic reconnection)
- Login errors `21`, `36` - Automatic reconnection attempts
- `DUP` - Duplicate connection (bot will exit to prevent conflicts)

## API Integration

The bot integrates with the [XatBlog API](https://api.xatblog.net/) for additional functionality:
- User ID/username lookups (`!id` and `!reg` commands)
- Chat information retrieval
- Power information and various other useful functions

## Notes

- ⚠️ **Do NOT modify the WebSocket section in the `.env` file!** ⚠️
- The bot is compatible with xat's new WebSocket system
- The bot includes built-in commands and is ready to use out of the box
- All questions should be asked in the project's GitHub issues or discussions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

**If you find a bug, instead of just reporting it, please fix it and submit a PR.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- **Created by**: @xlaming
- **Powered by**: [XatBlog API](https://api.xatblog.net/)
- **Built with**: Node.js, WebSocket, Sequelize, Winston

## Support

For support and questions:
- Visit [bot.xatblog.net](https://bot.xatblog.net)
- Check the [GitHub Issues](https://github.com/xlaming/free-xat-bot/issues) page
- Review the troubleshooting section above
