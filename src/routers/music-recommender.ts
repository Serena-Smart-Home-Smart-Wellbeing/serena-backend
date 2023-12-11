import { handleGetRecommendations } from '@/middlewares/music-recommender';
import express from 'express';

const musicRecommenderRouter = express.Router({ mergeParams: true });

musicRecommenderRouter.get('/', handleGetRecommendations);

export default musicRecommenderRouter;
