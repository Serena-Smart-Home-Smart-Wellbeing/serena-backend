import { HttpError } from '@/utils/errors';
import multer from 'multer';

export const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(
                new HttpError(
                    400,
                    `Wrong mime type. Expected: image/jpeg, image/png, image/gif. Received: ${file.mimetype}`
                )
            );
        }
    },
});
