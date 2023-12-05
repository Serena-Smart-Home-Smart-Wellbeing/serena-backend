import { HttpError } from "@/utils/errors";
import axios, { AxiosResponse } from "axios";
import "dotenv/config";
import FormData from "form-data";

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
    const url = process.env.SERENA_EMOTION_DETECTOR_URL;

    if (!url) {
        throw new HttpError(503, "Serena Emotion Detector services not available");
    }

    const formData = new FormData();
    formData.append("file", file.buffer, { filename: file.originalname });

    const { data } = await axios.post<
        unknown,
        AxiosResponse<SerenaEmotionDetectorResults>
    >(url, formData);

    return data;
};
