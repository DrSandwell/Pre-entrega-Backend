const supertest = require("supertest");
const expect = require('chai').expect;
const assert = require('chai').assert;

const requester = supertest("http://localhost:5000");


describe("Testing de la web otaku", function () {

    describe("Testing de productos: ", () => {

        it('El array de productos me deberia retornar un status 200', async () => {
            const res = await requester.get('/api/products');
            assert.strictEqual(res.status, 200);
            assert(Array.isArray(res.body.docs));
        });

        it('Obtener un producto por su ID y devolver estado 200', async () => {
            const productId = '66270b74653c4016d5224f3a';
            const res = await requester.get(`/api/products/${productId}`);
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body._id, productId);
        });

        it('Se elimina un producto existente y devuelve estado 200', async () => {
            const productId = "66270b74653c4016d5224f3b";

            const res = await requester.delete(`/api/products/${productId}`);
            assert.strictEqual(res.status, 200);

        });

        it("Endpoint POST /api/products debe crear un producto correctamente", async () => {
            const manga = {
                title: "Berserk",
                description: "the maxim",
                price: 9000,
                code: 353637,
                stock: 5,
                category: "Seinen",
                status: true,
            };
        });
    });
    describe("Testing de Usuarios", () => {
        it("Se crean usuarios correctamente", async () => {

            const nuevoUsuario = {
                first_name: "TestingFirstName",
                last_name: "TestingLastName",
                email: "testing@test.ts",
                password: "12345678",
                age: 45,
            };

            const res = await requester.post('/api/users/register').send(nuevoUsuario);
            assert.strictEqual(res.status, 302);
        });

        it("No permitir iniciar sesión con contraseña incorrecta", async () => {
            const loginData = {
                email: "testing@test.ts",
                password: "1234"
            };

            const res = await requester.post('/api/users/login').send(loginData);
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.text, "Contraseña incorrecta");
        });
    });


});
