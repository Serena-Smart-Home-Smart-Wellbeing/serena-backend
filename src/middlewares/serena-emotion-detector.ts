import { callSerenaEmotionDetector } from "@/controllers/serena-emotion-detector";
import { HttpError } from "@/utils/errors";
import { RequestHandler } from "express";

export const handleCallSerenaEmotionDetector: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const image = req.file;
        if (!image) {
            throw new HttpError(400, "Missing image");
        }

        const analyzedEmotions = await callSerenaEmotionDetector(image);

        res.status(200).json(analyzedEmotions);
    } catch (err) {
        next(err);
    }
};
