const mongoose = require("mongoose");
const { MONGODB_URI } = require("../src/config/config.js");

const assert = require("assert")

const UserDAO = require("../src/daos/mongo/users.dao.js")

mongoose.connect(MONGODB_URI)

describe("Testeamos el DAO de Usuarios", function () {

    before(function () {
        this.usersDao = new UserDAO();
    })

    beforeEach(async function () {
        await mongoose.connection.collections.users.drop();
    })

    it("El get de usuarios me retorne un array", async function () {
        const resultado = await this.usersDao.get();
        assert.strictEqual(Array.isArray(resultado), true);
    })

    it("El DAO DEBE PODER AGREGAR UN USUARIO NUEVO A LA BASE DE DATOS", async function () {
        let usuario = {
            first_name: "Mirtha",
            last_name: "Legrand",
            email: "lachiqui@legrand.com",
            password: 1234,
            age: 21
        }
        const resultado = await this.usersDao.createUser(usuario);
        assert.ok(resultado._id);
    })

    it("El Dao Puede obtener un usuario por email",async function(){
        let usuario = {
            first_name: "Mirtha",
            last_name: "Legrand",
            email: "lachiqui@legrand.com",
            password: 1234,
            age: 21
        }
        await this.usersDao.createUser(usuario);

        const UserBuscado = await this.usersDao.getBy({email: usuario.email});
        assert.strictEqual(typeof UserBuscado, "object")
    })

    after(async function () {
        await mongoose.disconnect()
    })
})