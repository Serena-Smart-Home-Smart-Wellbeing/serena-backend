import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import usersRouter from "./routers/users";
import { handleHttpErrors } from "./middlewares/errors";
import cors from "cors";
import setupSwagger from "./docs/swagger";
import serenPlaceRouter from "./routers/serenplace";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use("/users", usersRouter);
app.use("/serenplace", serenPlaceRouter);

app.use(handleHttpErrors);

app.listen(port, async () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
