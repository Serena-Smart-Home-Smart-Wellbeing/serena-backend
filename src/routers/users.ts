import { deleteUser, registerUser } from "@/controllers/users";
import express from "express";

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/", registerUser);

usersRouter.route("/:userId").delete(deleteUser);

usersRouter.get("/login", (req, res) => {});

export default usersRouter;
