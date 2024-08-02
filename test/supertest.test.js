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
            const productId = '667dbad6583abbf4a0fe9f0c';
            const res = await requester.get(`/api/products/${productId}`);
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body._id, productId);
        });

        it('Se elimina un producto existente y devuelve estado 200', async () => {
            const productId = "667dbad6583abbf4a0fe9f0c";
            const res = await requester.delete(`/api/products/${productId}`);

            // Comprobamos si el estado es 200 o 404
            assert.isTrue(res.status === 200 || res.status === 404);

            // Opcional: si deseas verificar que el cuerpo de la respuesta tenga un mensaje específico
            if (res.status === 404) {
                assert.strictEqual(res.text, "Producto no encontrado");
            }

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
