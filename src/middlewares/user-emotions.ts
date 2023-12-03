import {
    analyzeUserEmotion,
    saveUserEmotionImage
} from "@/controllers/user-emotions";
import { UserEmotionResultEndpointParams } from "@/routers/user-emotions";
import { UserEndpointParams } from "@/routers/users";
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

export interface HandleAnalyzeUserEmotionReqBody {
    /**
     * The user's photo file
     */
    image: string;
    serenBoxSessionId?: string;
}

export const handleAnalyzeUserEmotion: RequestHandler<
    UserEndpointParams,
    unknown,
    HandleAnalyzeUserEmotionReqBody
> = async (req, res, next) => {
    try {
        const image = req.file;
        if (!image) {
            throw new HttpError(400, "Missing image");
        }

        const { userId } = req.params;
        const { serenBoxSessionId } = req.body;
        if (userId !== req.user?.id) {
            throw new HttpError(403, "Forbidden");
        }

        const analyzedEmotions = await analyzeUserEmotion(image);

        // If successfully analyzed emotion
        const { path } = await saveUserEmotionImage(userId, image);

        const userEmotionResult = await prisma.userEmotionResult.create({
            data: {
                userId,
                user_photo: path,
                ...analyzedEmotions
            }
        });

        if (serenBoxSessionId) {
            await prisma.userEmotionResult.update({
                where: {
                    id: userEmotionResult.id
                },
                data: {
                    serenBoxSession: {
                        connect: {
                            id: serenBoxSessionId
                        }
                    }
                }
            });
        }

        const formattedUserEmotionResult =
            await prisma.userEmotionResult.getFormattedEmotion(userEmotionResult.id);

        res.status(201).send(formattedUserEmotionResult);
    } catch (err) {
        next(err);
    }
};
