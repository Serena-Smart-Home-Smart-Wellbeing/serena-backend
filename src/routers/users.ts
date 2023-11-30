import { deleteUser, getUserData, login, registerUser } from "@/controllers/users";
import { parseToken, validateUserById } from "@/middlewares/auth";
import express from "express";
import userEmotionResultRouter from "./user-emotion-result";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.route("/").post(registerUser);

export interface UserEndpointParams {
    userId: string;
}

usersRouter.use("/:userId", parseToken);
usersRouter.use("/:userId", validateUserById);

usersRouter.route("/:userId").get(getUserData).delete(deleteUser);

usersRouter.post("/login", login);

usersRouter.use("/:userId/emotions", userEmotionResultRouter);

export default usersRouter;
