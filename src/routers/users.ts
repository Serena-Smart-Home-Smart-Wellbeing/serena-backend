import { deleteUser, login, registerUser } from "@/controllers/users";
import express from "express";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/", registerUser);

usersRouter.route("/:userId").delete(deleteUser);

usersRouter.post("/login", login);

export default usersRouter;
