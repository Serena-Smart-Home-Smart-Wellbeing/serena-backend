import { serenaAppStorage } from "@/config/cloud-storage";
import {
    addSerenBox,
    changeSerenBoxSlotStatus,
    finishSerenBoxSession,
    getSerenBoxSlotStatusByCredentials,
    verifySerenBoxConnection
} from "@/controllers/serenbox";
import {
    SerenBoxRouterParams,
    SerenBoxSessionRouterParams,
    SerenBoxSlotCredentialsRouterParams,
    SerenBoxSlotRouterParams
} from "@/routers/serenbox";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { SerenBox, SerenBoxSession, SerenBoxSlots } from "@prisma/client";
import { RequestHandler } from "express";

export const validateSerenBoxById: RequestHandler<SerenBoxRouterParams> = async (
    req,
    _res,
    next
) => {
    try {
        const { serenboxId } = req.params;

        const serenBox = await prisma.serenBox.findUnique({
            where: {
                id: serenboxId
            }
        });
        if (!serenBox) {
            throw new HttpError(404, "SerenBox not found");
        }
        if (serenBox.userId !== req.user?.id) {
            throw new HttpError(403, "Forbidden");
        }

        next();
    } catch (err) {
        next(err);
    }
};

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

        newSerenBox.image_name = serenaAppStorage
            .file(newSerenBox.image_name)
            .publicUrl();

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

        serenBox.image_name = serenaAppStorage.file(serenBox.image_name).publicUrl();

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

        const serenBoxes = await prisma.serenBox.findManyByUserIdAndGetPublicURL(
            req.user.id
        );

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

        serenbox.image_name = serenaAppStorage.file(serenbox.image_name).publicUrl();

        res.status(200).json(serenbox);
    } catch (err) {
        next(err);
    }
};

export const handleDeleteSerenBox: RequestHandler<{ serenboxId: string }> = async (
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

        await prisma.serenBox.delete({
            where: {
                id: req.params.serenboxId
            }
        });

        serenBox.image_name = serenaAppStorage.file(serenBox.image_name).publicUrl();

        res.status(200).json(serenBox);
    } catch (err) {
        next(err);
    }
};

/**
 *
 * @deprecated SerenBox uses pub/sub to communicate with the server, so the server doesn't make any requests to the SerenBox
 */
export const handleVerifySerenBoxConnection: RequestHandler<
    SerenBoxRouterParams
> = async (req, res, next) => {
    try {
        const { serenboxId } = req.params;

        const serenBox = await prisma.serenBox.findUnique({
            where: {
                id: serenboxId
            }
        });

        if (!serenBox) {
            throw new HttpError(404, "SerenBox not found");
        }

        await verifySerenBoxConnection(serenBox.ip_address);

        serenBox.image_name = serenaAppStorage.file(serenBox.image_name).publicUrl();

        res.status(200).json(serenBox);
    } catch (err) {
        next(err);
    }
};

export const handleChangeSerenBoxSlotStatus: RequestHandler<
    SerenBoxSlotRouterParams,
    unknown,
    { is_active: true }
> = async (req, res, next) => {
    try {
        const { serenboxId, slotOption } = req.params;

        if (!(slotOption in SerenBoxSlots)) {
            throw new HttpError(400, "Wrong slot option");
        }

        const serenBox = await prisma.serenBox.findUnique({
            where: {
                id: req.params.serenboxId
            }
        });
        if (!serenBox) {
            throw new HttpError(404, "SerenBox not found");
        }
        if (serenBox.userId !== req.user?.id) {
            throw new HttpError(403, "Forbidden");
        }

        const updatedSerenBox = await changeSerenBoxSlotStatus(
            serenboxId,
            slotOption as SerenBoxSlots,
            req.body.is_active
        );

        res.status(200).json(updatedSerenBox);
    } catch (err) {
        next(err);
    }
};

export const handleCreateSerenBoxSession: RequestHandler<
    SerenBoxRouterParams,
    SerenBoxSession,
    Pick<SerenBoxSession, "duration_minutes" | "detection_mode" | "diffusion_option">
> = async (req, res, next) => {
    try {
        const { serenboxId } = req.params;
        const { detection_mode, diffusion_option, duration_minutes } = req.body;
        if (!detection_mode) {
            throw new HttpError(400, "Missing detection_mode");
        }
        if (!diffusion_option) {
            throw new HttpError(400, "Missing diffusion_option");
        }
        if (!duration_minutes) {
            throw new HttpError(400, "Missing duration_minutes");
        }

        const serenBoxSession = await prisma.serenBoxSession.create({
            data: {
                serenBox: {
                    connect: {
                        id: serenboxId
                    }
                },
                duration_minutes,
                detection_mode,
                diffusion_option
            }
        });

        res.status(201).json(serenBoxSession);
    } catch (err) {
        next(err);
    }
};

export const handleGetSerenBoxSession: RequestHandler<
    SerenBoxSessionRouterParams,
    SerenBoxSession
> = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const serenBoxSession = await prisma.serenBoxSession.findUnique({
            where: {
                id: sessionId
            }
        });
        if (!serenBoxSession) {
            throw new HttpError(404, "SerenBox session not found");
        }

        res.status(200).json(serenBoxSession);
    } catch (err) {
        next(err);
    }
};

export const handleFinishSerenBoxSession: RequestHandler<
    SerenBoxSessionRouterParams,
    SerenBoxSession
> = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const serenBoxSession = await prisma.serenBoxSession.findUnique({
            where: {
                id: sessionId
            }
        });
        if (!serenBoxSession) {
            throw new HttpError(404, "SerenBox session not found");
        }

        const finishedSession = await finishSerenBoxSession(sessionId);

        res.status(200).json(finishedSession);
    } catch (err) {
        next(err);
    }
};

export const handleGetSerenBoxSlotStatusByCredentials: RequestHandler<
    SerenBoxSlotCredentialsRouterParams
> = async (req, res, next) => {
    try {
        const { credentials } = req.params;

        const serenBoxSlotStatus = await getSerenBoxSlotStatusByCredentials(
            credentials
        );

        res.status(200).json(serenBoxSlotStatus);
    } catch (err) {
        next(err);
    }
};
