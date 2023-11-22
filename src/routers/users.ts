import { deleteUser, getUserData, login, registerUser } from "@/controllers/users";
import { parseToken } from "@/middlewares/auth";
import express from "express";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.route("/").post(registerUser);

usersRouter
    .route("/:userId")
    .get(parseToken, getUserData)
    .delete(parseToken, deleteUser);

usersRouter.post("/login", login);

export default usersRouter;
