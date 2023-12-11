import { UserEndpointParams } from '@/routers/users';
import { jwtAccessSecret } from '@/utils/auth';
import { HttpError } from '@/utils/errors';
import prisma from '@/utils/prisma';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const validateUserById: RequestHandler<UserEndpointParams> = async (
    req,
    _res,
    next
) => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        next();
    } catch (err) {
        next(err);
    }
};

export const parseToken: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new HttpError(400, 'Missing token');
        }

        jwt.verify(token, jwtAccessSecret, async (err, user) => {
            if (err) {
                return next(new HttpError(401, 'Invalid token'));
            }

            const foundUser = await prisma.user.findUnique({
                where: {
                    // @ts-expect-error: user is User type
                    id: user.userId,
                },
            });

            req.user = foundUser;
            next();
        });
    } catch (err) {
        next(err);
    }
};
