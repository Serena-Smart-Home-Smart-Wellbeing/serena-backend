import { UserEmotionResultEndpointParams } from "@/routers/user-emotions";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";

export const handleGetUserEmotion: RequestHandler<
    UserEmotionResultEndpointParams
> = async (req, res, next) => {
    try {
        const { emotionId } = req.params;

        const emotion = await prisma.userEmotionResult.getFormattedEmotion(
            emotionId
        );

        if (!emotion) {
            throw new HttpError(404, "Emotion result not found");
        }
        if (emotion.userId !== req.user?.id) {
            throw new HttpError(403, "Forbidden");
        }

        res.status(200).json(emotion);
    } catch (err) {
        next(err);
    }
};

export const handleGetUserEmotions: RequestHandler<
    UserEmotionResultEndpointParams
> = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (userId !== req.user?.id) {
            throw new HttpError(403, "Forbidden");
        }

        const emotions = await prisma.userEmotionResult.getFormattedEmotions(userId);

        res.status(200).json(emotions);
    } catch (err) {
        next(err);
    }
};
