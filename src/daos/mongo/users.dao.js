const userModel = require('../../models/user.model.js');
const UserModel = require('../../models/user.model.js');

class UserDAO {

    async get(params) {
        return userModel.find(params);
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async createUser(user) {
        return await UserModel.create(user);
    }

    async getUserById(id) {
        return await UserModel.findById(id);
    }
}

module.exports = UserDAO;
