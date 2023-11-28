import { addSerenBox } from "@/controllers/serenbox";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";

interface HandleAddSerenBoxBody {
    credentials: string;
    name: string;
}

export const handleAddSerenBox: RequestHandler<
    unknown,
    HandleAddSerenBoxBody
> = async (req, res, next) => {
    try {
        const { credentials, name } = req.body;
        if (!credentials) {
            throw new HttpError(400, "Missing credentials");
        }
        if (!name) {
            throw new HttpError(400, "Missing name");
        }
        if (await prisma.serenBox.findUnique({ where: { credentials } })) {
            throw new HttpError(409, "SerenBox already exists");
        }

        if (!req.user) {
            throw new HttpError(401, "Unauthorized");
        }
        const { id } = req.user;
        const newSerenBox = await addSerenBox({
            credentials,
            name,
            userId: id
        });

        res.status(201).json(newSerenBox);
    } catch (err) {
        next(err);
    }
};
