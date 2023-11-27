import { getRecommendations } from "@/controllers/music-recommender";
import { HttpError } from "@/utils/errors";
import spotify from "@/utils/spotify-api";
import { RequestHandler } from "express";

interface RecommendationsParams {
    energetic: number;
    relax: number;
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
            throw new HttpError(400, "Missing energetic");
        }
        if (!relax) {
            throw new HttpError(400, "Missing relax");
        }

        const mood = energetic > relax ? energetic : relax;
        const spotifyToken = (await spotify.getAccessToken())!.access_token;
        const recommendations = await getRecommendations(spotifyToken, mood);

        res.status(200).json(recommendations);
    } catch (err) {
        next(err);
    }
};
