import ChatConnectionHandler from "~/src/handlers/ChatConnectionHandler.js"
import ChatControllerHandler from "~/src/handlers/ChatControllerHandler.js"
import DoneHandler from "~/src/handlers/DoneHandler.js"
import DuplicateHandler from "~/src/handlers/DuplicateHandler.js"
import IdleConnectionHandler from "~/src/handlers/IdleConnectionHandler.js"
import KissTransferGiftHandler from "~/src/handlers/KissTransferGiftHandler.js"
import LoginErrorHandler from "~/src/handlers/LoginErrorHandler.js"
import LogoutHandler from "~/src/handlers/LogoutHandler.js"
import MessageHandler from "~/src/handlers/MessageHandler.js"
import PrivateMessageHandler from "~/src/handlers/PrivateMessageHandler.js"
import TickleHandler from "~/src/handlers/TickleHandler.js"
import UserJoinedHandler from "~/src/handlers/UserJoinedHandler.js"
import UserLeftHandler from "~/src/handlers/UserLeftHandler.js"

export default [
    ChatConnectionHandler,
    ChatControllerHandler,
    DoneHandler,
    DuplicateHandler,
    IdleConnectionHandler,
    KissTransferGiftHandler,
    LoginErrorHandler,
    LogoutHandler,
    MessageHandler,
    PrivateMessageHandler,
    TickleHandler,
    UserJoinedHandler,
    UserLeftHandler
]