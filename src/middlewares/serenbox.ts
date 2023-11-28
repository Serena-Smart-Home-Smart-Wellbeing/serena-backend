import { addSerenBox } from "@/controllers/serenbox";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { SerenBox } from "@prisma/client";
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

export const handleGetSerenBox: RequestHandler<{ serenboxId: string }> = async (
    req,
    res,
    next
) => {
    try {
        if (!req.user) {
            throw new HttpError(401, "Unauthorized");
        }

        const serenBox = await prisma.serenBox.findUnique({
            where: {
                id: req.params.serenboxId
            }
        });

        if (!serenBox) {
            throw new HttpError(404, "SerenBox not found");
        }
        if (serenBox.userId !== req.user.id) {
            throw new HttpError(403, "Forbidden");
        }

        res.status(200).json(serenBox);
    } catch (err) {
        next(err);
    }
};

export const handleGetSerenBoxes: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new HttpError(401, "Unauthorized");
        }

        const serenBoxes = await prisma.serenBox.findMany({
            where: {
                userId: req.user.id
            }
        });

        res.status(200).json(serenBoxes);
    } catch (err) {
        next(err);
    }
};

export const handlePatchSerenBoxIpAddress: RequestHandler<
    unknown,
    unknown,
    Pick<SerenBox, "ip_address" | "credentials">
> = async (req, res, next) => {
    try {
        const { credentials, ip_address } = req.body;
        if (!credentials) {
            throw new HttpError(400, "Missing credentials");
        }
        if (!ip_address) {
            throw new HttpError(400, "Missing ip_address");
        }

        let serenbox: SerenBox;
        try {
            serenbox = await prisma.serenBox.update({
                where: {
                    credentials: credentials
                },
                data: {
                    ip_address: ip_address
                }
            });
        } catch (err) {
            throw new HttpError(404, "SerenBox not found");
        }

        res.status(200).json(serenbox);
    } catch (err) {
        next(err);
    }
};
