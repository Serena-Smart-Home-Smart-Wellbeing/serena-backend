import { Request } from "express";
import { HttpError } from "./errors";
import dotenv from "dotenv";
dotenv.config();

export const isRequestedBySameUser = (req: Request, userId: string) => {
    if (req.user?.id !== userId) {
        throw new HttpError(403, "Forbidden");
    }

    return true;
};

export const jwtAccessSecret = process.env.JWT_ACCESS_SECRET!;
