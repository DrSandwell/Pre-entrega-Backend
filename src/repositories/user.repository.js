const { userDAO } = require('../daos/mongo');

class UserRepository {
    async getUserByEmail(email) {
        return await userDAO.getUserByEmail(email);
    }

    async createUser(user) {
        return await userDAO.createUser(user);
    }

    async getUserById(id) {
        return await userDAO.getUserById(id);
    }
}

module.exports = new UserRepository();