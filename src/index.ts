import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import usersRouter from "./routers/users";
import { handleHttpErrors } from "./middlewares/errors";
import cors from "cors";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server");
});

app.use("/users", usersRouter);

app.use(handleHttpErrors);

app.listen(port, async () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
