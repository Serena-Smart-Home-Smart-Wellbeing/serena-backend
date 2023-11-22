import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./serena-backend.oas.json";

const setupSwagger = (app: Application) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            swaggerOptions: {
                persistAuthorization: true
            }
        })
    );
};

export default setupSwagger;
