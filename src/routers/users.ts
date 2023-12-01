import { deleteUser, getUserData, login, registerUser } from "@/controllers/users";
import { parseToken, validateUserById } from "@/middlewares/auth";
import express from "express";
import userEmotionRouter from "./user-emotions";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.route("/").post(registerUser);

export interface UserEndpointParams {
    userId: string;
}

usersRouter.post("/login", login);

usersRouter.use("/:userId", parseToken);
usersRouter.use("/:userId", validateUserById);

usersRouter.route("/:userId").get(getUserData).delete(deleteUser);

usersRouter.use("/:userId/emotions", userEmotionRouter);

export default usersRouter;
