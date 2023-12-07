import { serenaAppStorage } from "@/config/cloud-storage";
import { dayjsIndo } from "@/config/dayjs";
import { UserEmotionResult } from "@prisma/client";
import { callSerenaEmotionDetector } from "./serena-emotion-detector";

export const getUserEmotionImageFolder = (userId: string) => {
    return `users/${userId}/emotions`;
};

export const saveUserEmotionImage = async (
    userId: string,
    image: Express.Multer.File
) => {
    const path = `${getUserEmotionImageFolder(
        userId
    )}/${dayjsIndo().toISOString()}.${image.mimetype.split("/")[1]}`;
    const blob = serenaAppStorage.file(path);
    await blob.save(image.buffer);

    const publicUrl = blob.publicUrl();
    return {
        path,
        publicUrl
    };
};

export type AnalyzedUserEmotions = Pick<
    UserEmotionResult,
    "anger" | "disgust" | "fear" | "joy" | "neutral" | "sadness" | "surprise"
>;

export const analyzeUserEmotion = async (
    image: Express.Multer.File
): Promise<AnalyzedUserEmotions> => {
    const analyzedEmotions = await callSerenaEmotionDetector(image);

    const emotionResults = {
        anger: analyzedEmotions.angry,
        disgust: analyzedEmotions.disgust,
        fear: analyzedEmotions.fear,
        joy: analyzedEmotions.happy,
        neutral: analyzedEmotions.neutral,
        sadness: analyzedEmotions.sad,
        surprise: analyzedEmotions.surprise
    };

    return emotionResults;
};
