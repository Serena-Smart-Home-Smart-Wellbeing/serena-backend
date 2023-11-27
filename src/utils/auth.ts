import { Request } from "express";
import { HttpError } from "./errors";

export const isRequestedBySameUser = (req: Request, userId: string) => {
    if (req.user?.id !== userId) {
        throw new HttpError(403, "Forbidden");
    }

    return true;
};
