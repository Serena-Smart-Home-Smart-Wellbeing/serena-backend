import { PrismaClient, UserEmotionResult } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        userEmotionResult: {
            formatEmotion(emotion: UserEmotionResult) {
                return {
                    energetic: {
                        anger: emotion.anger,
                        fear: emotion.fear,
                        surprise: emotion.surprise,
                        total: emotion.anger + emotion.fear + emotion.surprise
                    },
                    relax: {
                        disgust: emotion.disgust,
                        joy: emotion.joy,
                        neutral: emotion.neutral,
                        sadness: emotion.sadness,
                        total:
                            emotion.disgust +
                            emotion.joy +
                            emotion.neutral +
                            emotion.sadness
                    },
                    id: emotion.id,
                    userId: emotion.userId,
                    created_time: emotion.created_time,
                    user_photo: emotion.user_photo
                };
            },
            async getFormattedEmotion(emotionId: string) {
                const emotion = await prisma.userEmotionResult.findUnique({
                    where: {
                        id: emotionId
                    }
                });

                if (!emotion) {
                    return null;
                }

                const formattedEmotion = this.formatEmotion(emotion);

                return formattedEmotion;
            },
            async getFormattedEmotions(userId: string) {
                const emotions = await prisma.userEmotionResult.findMany({
                    where: {
                        userId
                    },
                    orderBy: {
                        created_time: "desc"
                    }
                });

                const formattedEmotions = emotions.map(emotion =>
                    this.formatEmotion(emotion)
                );

                return formattedEmotions;
            }
        }
    }
});

export default prisma;
