import { getJwtAccessSecret } from "@/config/secret-manager";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const parseToken: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new HttpError(400, "Missing token");
        }

        jwt.verify(token, await getJwtAccessSecret(), async (err, user) => {
            if (err) {
                return next(new HttpError(401, "Invalid token"));
            }

            const foundUser = await prisma.user.findUnique({
                where: {
                    // @ts-expect-error
                    id: user.userId
                }
            });

            req.user = foundUser;
            next();
        });
    } catch (err) {
        next(err);
    }
};
