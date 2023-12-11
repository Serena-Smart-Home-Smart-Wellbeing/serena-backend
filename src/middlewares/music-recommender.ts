import { getRecommendations } from '@/controllers/music-recommender';
import { HttpError } from '@/utils/errors';
import spotify from '@/utils/spotify-api';
import { RequestHandler } from 'express';

interface RecommendationsParams {
    energetic: string;
    relax: string;
}

export const handleGetRecommendations: RequestHandler<
    null,
    null,
    null,
    RecommendationsParams
> = async (req, res, next) => {
    try {
        const { energetic, relax } = req.query;

        if (!energetic) {
            throw new HttpError(400, 'Missing energetic');
        }
        if (!relax) {
            throw new HttpError(400, 'Missing relax');
        }

        const parsedEnergetic = parseFloat(energetic);
        const parsedRelax = parseFloat(relax);
        if (parsedEnergetic + parsedRelax !== 1) {
            throw new HttpError(400, 'Energetic + relax must be 1');
        }

        let mood = parsedEnergetic;
        if (parsedRelax > parsedEnergetic) {
            mood = 1 - parsedRelax;
        }

        const spotifyToken = (await spotify.authenticate()).accessToken
            .access_token;
        const recommendations = await getRecommendations(spotifyToken, mood);

        res.status(200).json(recommendations);
    } catch (err) {
        next(err);
    }
};
