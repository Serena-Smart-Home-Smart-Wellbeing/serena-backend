import { serenaAppStorage } from "@/config/cloud-storage";
import { dayjsIndo } from "@/config/dayjs";
import { UserEmotionResult } from "@prisma/client";

export const getUserEmotionImageFolder = (userId: string) => {
    return `users/${userId}/emotions`;
};

export const saveUserEmotionImage = async (
    userId: string,
    image: Express.Multer.File
) => {
    const path = `${getUserEmotionImageFolder(userId)}/${dayjsIndo.toISOString()}.${
        image.mimetype.split("/")[1]
    }`;
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
    // TODO implement
    console.error("analyzeUserEmotion not implemented");

    const emotionResults = {
        anger: 0,
        disgust: 0,
        fear: 0,
        joy: 0,
        neutral: 0,
        sadness: 0,
        surprise: 0
    };

    return emotionResults;
};
