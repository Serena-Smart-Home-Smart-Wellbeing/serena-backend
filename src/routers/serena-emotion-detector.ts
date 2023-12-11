import { upload } from '@/config/multer';
import { handleCallSerenaEmotionDetector } from '@/middlewares/serena-emotion-detector';
import express from 'express';

const serenaEmotionDetectorRouter = express.Router({ mergeParams: true });

serenaEmotionDetectorRouter.post(
    '/detect',
    upload.single('image'),
    handleCallSerenaEmotionDetector
);

export default serenaEmotionDetectorRouter;
