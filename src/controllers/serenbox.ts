import { dayjsIndo } from "@/config/dayjs";
import { HttpError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import {
    SerenBox,
    SerenBoxLabels,
    SerenBoxSlot,
    SerenBoxSlots
} from "@prisma/client";
import axios from "axios";

export const addSerenBox = async (
    data: Pick<SerenBox, "credentials" | "name" | "userId"> & Partial<SerenBox>
) => {
    const newSerenBox = await prisma.serenBox.create({
        data: {
            credentials: data.credentials,
            name: data.name,
            added: data.added,
            image_name: data.image_name,
            ip_address: data.ip_address,
            user: {
                connect: {
                    id: data.userId
                }
            },
            slotA: {
                create: {
                    name: "Cajuput Oil",
                    slot: SerenBoxSlots.A,
                    label: SerenBoxLabels.ENERGETIC,
                    capacity_ml: 100,
                    current_capacity_ml: 100
                }
            },
            slotB: {
                create: {
                    name: "Citronella Oil",
                    slot: SerenBoxSlots.B,
                    label: SerenBoxLabels.RELAX,
                    capacity_ml: 100,
                    current_capacity_ml: 100
                }
            }
        }
    });

    return newSerenBox;
};

/**
 *
 * @deprecated SerenBox uses pub/sub to communicate with the server, so the server doesn't make any requests to the SerenBox
 */
export const verifySerenBoxConnection = async (ip: SerenBox["ip_address"]) => {
    try {
        const res = await axios.get(`${ip}/ping`);

        return res;
    } catch (err) {
        throw new HttpError(503, "SerenBox unavailable");
    }
};

export interface SerenBoxSlotStatus {
    serenBoxId: string;
    sessionId: string;
    startTime: string;
    slotA: boolean;
    slotB: boolean;
    isSessionRunning: boolean;
}

export const changeSerenBoxSlotStatus = async (
    serenBoxId: string,
    slot: SerenBoxSlots,
    status: boolean
): Promise<SerenBoxSlotStatus> => {
    const updatedSerenBox = await prisma.serenBox.update({
        where: {
            id: serenBoxId
        },
        data: {
            [`slot${slot}`]: {
                update: {
                    is_active: status
                } as SerenBoxSlot
            }
        },
        select: {
            id: true,
            slotA: {
                select: {
                    is_active: true
                }
            },
            slotB: {
                select: {
                    is_active: true
                }
            },
            SerenBoxSessions: {
                select: {
                    is_running: true,
                    id: true,
                    start_time: true
                },
                orderBy: {
                    start_time: "desc"
                },
                take: 1
            }
        }
    });

    return {
        serenBoxId: updatedSerenBox.id,
        sessionId: updatedSerenBox.SerenBoxSessions[0]?.id,
        startTime: dayjsIndo(updatedSerenBox.SerenBoxSessions[0]?.start_time).format(
            "DD MMMM YYYY, HH:mm"
        ),
        slotA: updatedSerenBox.slotA?.is_active || false,
        slotB: updatedSerenBox.slotB?.is_active || false,
        isSessionRunning: updatedSerenBox.SerenBoxSessions[0]?.is_running
    };
};

export const getSerenBoxSlotStatusByCredentials = async (
    credentials: SerenBox["credentials"]
): Promise<SerenBoxSlotStatus> => {
    const serenBox = await prisma.serenBox.findUnique({
        where: {
            credentials
        },
        select: {
            id: true,
            slotA: {
                select: {
                    is_active: true
                }
            },
            slotB: {
                select: {
                    is_active: true
                }
            },
            SerenBoxSessions: {
                select: {
                    is_running: true,
                    id: true,
                    start_time: true
                },
                orderBy: {
                    start_time: "desc"
                },
                take: 1
            }
        }
    });

    if (!serenBox) {
        throw new HttpError(404, "SerenBox not found");
    }

    return {
        serenBoxId: serenBox.id,
        sessionId: serenBox.SerenBoxSessions[0]?.id,
        startTime: dayjsIndo(serenBox.SerenBoxSessions[0]?.start_time).format(
            "DD MMMM YYYY, HH:mm"
        ),
        slotA: serenBox.slotA?.is_active || false,
        slotB: serenBox.slotB?.is_active || false,
        isSessionRunning: serenBox.SerenBoxSessions[0]?.is_running
    };
};

export const finishSerenBoxSession = async (sessionId: string) => {
    const finishedSession = await prisma.serenBoxSession.update({
        where: {
            id: sessionId
        },
        data: {
            is_running: false,
            end_time: dayjsIndo().toDate()
        }
    });

    return finishedSession;
};
