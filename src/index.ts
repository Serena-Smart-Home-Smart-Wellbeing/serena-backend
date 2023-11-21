import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import usersRouter from "./routers/users";
import { handleHttpErrors } from "./middlewares/errors";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server");
});

app.use("/users", usersRouter);

app.use(handleHttpErrors);

app.listen(port, async () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
