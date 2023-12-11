import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import setupSwagger from './docs/swagger';
import { handleHttpErrors } from './middlewares/errors';
import musicRecommenderRouter from './routers/music-recommender';
import serenaEmotionDetectorRouter from './routers/serena-emotion-detector';
import serenBoxRouter from './routers/serenbox';
import serenPlaceRouter from './routers/serenplace';
import usersRouter from './routers/users';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use('/users', usersRouter);
app.use('/serenplace', serenPlaceRouter);
app.use('/music-recommender', musicRecommenderRouter);
app.use('/devices/serenbox', serenBoxRouter);
app.use('/serena-emotion-detector', serenaEmotionDetectorRouter);

app.use(handleHttpErrors);

app.listen(port, async () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
