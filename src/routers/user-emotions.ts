import {
    handleAnalyzeUserEmotion,
    handleGetUserEmotion,
    handleGetUserEmotions,
} from '@/middlewares/user-emotions';
import express from 'express';
import { UserEndpointParams } from './users';
import { upload } from '@/config/multer';

const userEmotionRouter = express.Router({ mergeParams: true });

export interface UserEmotionResultEndpointParams extends UserEndpointParams {
    emotionId: string;
}

userEmotionRouter.route('/').get(handleGetUserEmotions);
userEmotionRouter.route('/:emotionId').get(handleGetUserEmotion);
userEmotionRouter
    .route('/detect')
    .all(upload.single('image'))
    .post(handleAnalyzeUserEmotion);

export default userEmotionRouter;
