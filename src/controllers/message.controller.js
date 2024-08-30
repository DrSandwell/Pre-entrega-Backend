const messageModel = require("../models/message.model");
const { logger } = require("../middlewares/loggerMiddleware");

class MessagesManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            return error;
        }
    };

    createMessage = async (message) => {
        if (message.user.trim() === "" || message.message.trim() === "") {
            return null;
        }

        try {
            return await messageModel.create(message);
        } catch (error) {
            return error;
        }
    };

    deleteAllMessages = async () => {
        try {
            logger.info("Deleting all messages...");
            const result = await messageModel.deleteMany({});
            logger.info("Messages deleted:", result);
            return result;
        } catch (error) {
            logger.error("Error deleting messages:", error);
            return error;
        }
    };
}

module.exports = MessagesManager;