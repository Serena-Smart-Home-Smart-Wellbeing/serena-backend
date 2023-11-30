import {
    handleGetUserEmotion,
    handleGetUserEmotions
} from "@/middlewares/user-emotion-result";
import express from "express";
import { UserEndpointParams } from "./users";

const userEmotionResultRouter = express.Router({ mergeParams: true });

export interface UserEmotionResultEndpointParams extends UserEndpointParams {
    emotionId: string;
}

userEmotionResultRouter.route("/").get(handleGetUserEmotions);
userEmotionResultRouter.route("/:emotionId").get(handleGetUserEmotion);

export default userEmotionResultRouter;
