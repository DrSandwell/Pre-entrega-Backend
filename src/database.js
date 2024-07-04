const mongose = require("mongoose");
const { MONGODB_URI } = require("./config/config.js");
const winston = require("winston");

class DataBase {
    static #instance;
    constructor() {
        mongose.connect(MONGODB_URI);
    }
    static getInstance() {
        try {
            if (this.#instance) return this.#instance;
            this.#instance = new DataBase();
            winston.info("mongoDB connected succesfully");
        } catch (error) {
            winston.error(error);
        }
    }
}

module.exports = DataBase.getInstance();
