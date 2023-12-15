import { HttpError } from '@/utils/errors';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import FormData from 'form-data';
import { saveUserEmotionImage } from './user-emotions';
import sharp from 'sharp';

const resizeImage = async (image: Buffer): Promise<Buffer> => {
    return await sharp(image)
        .resize({
            width: 500,
            height: 500,
            fit: 'cover',
        })
        .toBuffer();
};

export interface SerenaEmotionDetectorResults {
    angry: number;
    fear: number;
    surprise: number;
    disgust: number;
    happy: number;
    neutral: number;
    sad: number;
}

export const callSerenaEmotionDetector = async (file: Express.Multer.File) => {
    const url = process.env.SERENA_EMOTION_DETECTOR_URL;

    if (!url) {
        throw new HttpError(
            503,
            'Serena Emotion Detector services not available'
        );
    }

    const formData = new FormData();

    // Reduce file if more than 500kb, don't reduce smaller files to avoid affecting the model accuracy
    const image =
        file.size > 1000 * 500 ? await resizeImage(file.buffer) : file.buffer;

    formData.append('file', image, { filename: file.originalname });

    const { data } = await axios.post<
        unknown,
        AxiosResponse<SerenaEmotionDetectorResults | HttpError>
    >(url, formData);

    if (!('angry' in data)) {
        console.error(data);
        await saveUserEmotionImage('not_detected', file);
        throw new HttpError(400, 'Face not detected');
    }

    // Fix decimal to 2 points
    const results = {} as SerenaEmotionDetectorResults;
    for (const [key, value] of Object.entries(data)) {
        results[key as keyof SerenaEmotionDetectorResults] = Number(
            value.toFixed(2)
        );
    }

    return results;
};
