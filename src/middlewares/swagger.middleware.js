const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Ecommerce",
            description:
                "Venta de mangas otakus",
        },
    },
    apis: ["./src/docs/**/*.yaml"],
};

module.exports = { swaggerOptions };