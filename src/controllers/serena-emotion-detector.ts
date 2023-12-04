import { getSerenaEmotionDetectorUri } from "@/config/cloud-run";
import { HttpError } from "@/utils/errors";
import axios, { AxiosResponse } from "axios";

export interface SerenaEmotionDetectorResults {
    angry: number;
    fear: number;
    surprise: number;
    disgust: number;
    happy: number;
    neutral: number;
    sad: number;
}

export const callSerenaEmotionDetector = async (
    file: Express.Multer.File
): Promise<SerenaEmotionDetectorResults> => {
    const url = await getSerenaEmotionDetectorUri();

    if (!url) {
        throw new HttpError(503, "Serena Emotion Detector services not available");
    }

    const { data } = await axios.post<
        unknown,
        AxiosResponse<SerenaEmotionDetectorResults>
    >(url, {
        file
    });

    return data;
};
