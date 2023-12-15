import { HttpError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';

export const handleHttpErrors = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err) {
        console.error(err);
        return res.status(err.status).json({
            message: err.message,
            status: err.status,
        });
    }
    next(err);
};
