import { serenaAppStorage } from '@/config/cloud-storage';
import { PrismaClient, UserEmotionResult } from '@prisma/client';
import { deleteStorageFolder } from './cloud-storage';

const prisma = new PrismaClient().$extends({
    model: {
        userEmotionResult: {
            formatEmotion(emotion: UserEmotionResult) {
                return {
                    energetic: {
                        anger: emotion.anger,
                        fear: emotion.fear,
                        surprise: emotion.surprise,
                        total: emotion.anger + emotion.fear + emotion.surprise,
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
                            emotion.sadness,
                    },
                    id: emotion.id,
                    userId: emotion.userId,
                    created_time: emotion.created_time,
                    user_photo: serenaAppStorage
                        .file(emotion.user_photo)
                        .publicUrl(),
                    serenBoxSessionId: emotion.serenBoxSessionId,
                };
            },
            async getFormattedEmotion(emotionId: string) {
                const emotion = await prisma.userEmotionResult.findUnique({
                    where: {
                        id: emotionId,
                    },
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
                        userId,
                    },
                    orderBy: {
                        created_time: 'desc',
                    },
                });

                const formattedEmotions = emotions.map((emotion) =>
                    this.formatEmotion(emotion)
                );

                return formattedEmotions;
            },
        },
        serenPlaceProduct: {
            async findManyAndGetPublicURL() {
                const products = await prisma.serenPlaceProduct.findMany();

                const productsWithPublicURL = products.map((product) => {
                    product.image_name = serenaAppStorage
                        .file(product.image_name)
                        .publicUrl();

                    return product;
                });

                return productsWithPublicURL;
            },
        },
        serenBox: {
            async findManyByUserIdAndGetPublicURL(userId: string) {
                const serenBoxes = await prisma.serenBox.findMany({
                    where: {
                        userId,
                    },
                    include: {
                        slotA: true,
                        slotB: true,
                    },
                });

                const serenBoxesWithPublicURL = serenBoxes.map((serenBox) => {
                    serenBox.image_name = serenaAppStorage
                        .file(serenBox.image_name)
                        .publicUrl();

                    return serenBox;
                });

                return serenBoxesWithPublicURL;
            },
        },
        user: {},
    },
    query: {
        userEmotionResult: {
            async delete({ args, query }) {
                const emotion = await prisma.userEmotionResult.findUnique({
                    where: {
                        id: args.where.id,
                    },
                });

                const image = serenaAppStorage.file(emotion!.user_photo);
                await image.delete();

                const deletedEmotion = await query(args);

                return deletedEmotion;
            },
        },
        user: {
            async delete({ args, query }) {
                const userFolder = serenaAppStorage.file(
                    `users/${args.where.id}/`
                );
                await deleteStorageFolder(serenaAppStorage, userFolder.name);

                const deletedUser = await query(args);

                return deletedUser;
            },
        },
    },
});

export default prisma;
