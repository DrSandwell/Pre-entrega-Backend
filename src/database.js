const mongose = require("mongoose");
const { MONGODB_URI } = require("./config/config.js");
const { logger } = require("./middlewares/loggerMiddleware.js");

class DataBase {
    static #instance;
    constructor() {
        mongose.connect(MONGODB_URI);
    }
    static getInstance() {
        try {
            if (this.#instance) return this.#instance;
            this.#instance = new DataBase();
            logger.info("mongoDB connected succesfully");
        } catch (error) {
            logger.error(error);
        }
    }
}

module.exports = DataBase.getInstance();
