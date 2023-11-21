import { deleteUser, login, registerUser } from "@/controllers/users";
import { parseToken } from "@/middlewares/auth";
import express from "express";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/", registerUser);

usersRouter.route("/:userId").delete(parseToken, deleteUser);

usersRouter.post("/login", login);

export default usersRouter;
