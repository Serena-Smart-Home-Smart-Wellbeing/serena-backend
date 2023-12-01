import {
    handleGetUserEmotion,
    handleGetUserEmotions
} from "@/middlewares/user-emotions";
import express from "express";
import { UserEndpointParams } from "./users";

const userEmotionRouter = express.Router({ mergeParams: true });

export interface UserEmotionResultEndpointParams extends UserEndpointParams {
    emotionId: string;
}

userEmotionRouter.route("/").get(handleGetUserEmotions);
userEmotionRouter.route("/:emotionId").get(handleGetUserEmotion);

export default userEmotionRouter;
