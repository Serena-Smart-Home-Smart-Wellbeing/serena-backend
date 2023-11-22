import { getJwtAccessSecret } from "@/config/secret-manager";
import { HttpError } from "@/utils/errors";
import { User } from "@prisma/client";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const parseToken: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new HttpError(400, "Missing token");
        }

        jwt.verify(token, await getJwtAccessSecret(), (err, user) => {
            if (err) {
                throw new HttpError(401, "Invalid token");
            }

            req.user = user as User;
        });
        next();
    } catch (err) {
        next(err);
    }
};
