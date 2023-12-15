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
                    `Wrong mime type. Received: ${file.mimetype}. Expected: image/jpeg, image/png, image/gif.`
                )
            );
        }
    },
});
