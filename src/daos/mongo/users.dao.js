const UserModel = require('../../models/user.model.js');

class UserDAO {
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

module.exports = new UserDAO();
