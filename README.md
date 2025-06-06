# Free xatbot

A powerful, open-source moderation and utility bot for xat.com chat rooms built with Node.js. Enhance your chat experience with automated features, AI-powered moderation, and comprehensive management tools.

## 🌟 Features

- **AI-Powered Moderation**: Intelligent content filtering using OpenAI integration
- **Automated User Management**: Welcome messages, user tracking, and activity monitoring  
- **Comprehensive Command System**: Extensive set of commands for chat administration
- **Real-time Configuration**: Modify bot settings directly through chat commands
- **Persistent Data Storage**: SQLite database for settings and user data
- **Advanced Permission System**: Secure owner-only commands with role-based access
- **Auto-Recovery**: Automatic reconnection handling and error recovery
- **Modern WebSocket Integration**: Compatible with xat's latest WebSocket implementation
- **Extensive Logging**: Detailed console and file-based logging system

## 📋 Prerequisites

- **Node.js**: Version 18.0 or higher
- **NPM**: Package manager (comes with Node.js)
- **xat Account**: Valid xat.com account with API access
- **Chat Permissions**: Appropriate powers in your target chat room

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/xlaming/free-xat-bot
cd free-xat-bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:

```env
# Bot Account Credentials
BOT_USER=your_xat_username
BOT_APIKEY=your_xat_api_key

# Target Chat Configuration
BOT_CHAT=your_chat_name

# Authorization (User IDs with admin access)
BOT_OWNERS=[123456,789012]

# Power Restrictions (Optional - Power IDs to disable)
DISABLED_POWERS=[29]

# AI Integration (Optional - For intelligent moderation)
OPENAI_KEY=sk-your_openai_key_here

# WebSocket Configuration (DO NOT MODIFY)
WEBSOCKET_URL=wss://wss.xat.com/v2
WEBSOCKET_ORIGIN=https://xat.com
```

### 4. Launch Bot
```bash
# Production mode
npm run start

# Development mode (auto-reload)
npm run dev
```

## 🔧 Configuration Guide

### Obtaining xat Credentials

1. **Username**: Your registered xat username for the bot account
2. **API Key**: Available from xat's login interface after authentication
3. **Chat Name**: Target chat room name (e.g., "help", "lobby")

### Setting Up Bot Owners

Add user IDs to the `BOT_OWNERS` array for administrative access. Users can find their ID using the bot's lookup commands once running.

### Power Management

Configure `DISABLED_POWERS` to restrict certain xat powers. Power ID 29 (ban) is disabled by default for security.

## 🎯 Command System

The bot features an extensive command system with role-based permissions:

- **Everyone Commands**: Available to all users (information, utilities)
- **Admin Commands**: Owner-only access (moderation, configuration)

All commands use a configurable prefix (default: `!`) and support dynamic help generation.

## 🔌 API Integration

### xatBlog API
- User/ID resolution services
- Chat information retrieval  
- Power data and utilities
- Extended functionality for advanced features

### OpenAI Integration (Optional)
- Intelligent content moderation
- Context-aware filtering

## 🛠️ Development & Customization

### Creating Custom Commands

1. Create a new file in `src/commands/`
2. Follow the established command structure:

```javascript
export default {
    name: "commandname",
    
    async execute(bot, xatID, message, from) {
        // Permission check
        if (!bot.hasPermission(xatID, from)) {
            return bot.reply("Insufficient permissions", xatID, from);
        }
        
        // Command logic
        await bot.reply("Command response", xatID, from);
    }
};
```

3. Restart the bot to load new commands

### Available Utilities

The `src/api` directory contains numerous helper functions for:
- User management and lookup
- Chat operations and moderation
- Database interactions
- WebSocket communication
- Logging and error handling

## 📊 Logging & Monitoring

### Logging Features
- **Console Output**: Color-coded real-time logging
- **File Logging**: Persistent logs in `logs/app.log`
- **Error Tracking**: Detailed error reporting and stack traces

### Monitoring Capabilities
- User activity tracking
- Command execution statistics
- Connection health monitoring
- Automated error recovery logging

## 🔍 Troubleshooting

### Connection Issues
- Verify xat credentials and API key validity
- Confirm chat accessibility and bot permissions
- Check network connectivity and firewall settings
- Review WebSocket configuration (do not modify URLs)

### Command Problems
- Ensure user ID is in `BOT_OWNERS` array
- Verify command prefix and syntax
- Check bot permissions in target chat
- Review console logs for detailed error information

### Database Errors
- Delete `database.db` to reset and recreate tables
- Verify file system permissions
- Ensure SQLite3 installation integrity

### Performance Issues
- Monitor memory usage and connection stability
- Review log files for recurring errors
- Check AI API rate limits and quotas
- Verify Node.js version compatibility

## 🔒 Security Considerations

### Best Practices
- **Never share**: `.env` files, `database.db`, or login credentials
- **Restrict access**: Limit `BOT_OWNERS` to trusted individuals only
- **Regular updates**: Keep dependencies and Node.js current
- **Monitor usage**: Review logs for suspicious activity

### Protected Files
The `.gitignore` configuration excludes sensitive files:
- Environment variables (`.env`)
- Database files (`database.db`)  
- Cache and temporary files
- Log files and credentials

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Test** thoroughly before committing
4. **Follow** existing code style and conventions
5. **Submit** a pull request with detailed description

### Development Guidelines
- Use modern JavaScript (ES6+) features
- Follow consistent naming conventions
- Include appropriate error handling
- Add comments for complex logic
- Test with various chat scenarios

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

## 🙏 Acknowledgments

- **Developer**: @xlaming
- **API Services**: [xatBlog API](https://api.xatblog.net/)
- **Technologies**: Node.js, WebSocket, Sequelize, Winston, OpenAI
- **Community**: Contributors and beta testers

## 📞 Support & Resources

- **Project Website**: [bot.xatblog.net](https://bot.xatblog.net)
- **Issue Tracker**: [GitHub Issues](https://github.com/xlaming/free-xat-bot/issues)
- **Documentation**: Complete guides and API references
- **Community**: Active support community

---

**Ready to enhance your xat chat experience? Get started today!**