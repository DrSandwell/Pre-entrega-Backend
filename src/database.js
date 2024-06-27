const mongose = require("mongoose");
const { MONGODB_URI } = require("./config/config.js");

class DataBase {
    static #instance;
    constructor() {
        mongose.connect(MONGODB_URI);
    }
    static getInstance() {
        try {
            if (this.#instance) return this.#instance;
            this.#instance = new DataBase();
            console.log("mongoDB connected succesfully");
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = DataBase.getInstance();
