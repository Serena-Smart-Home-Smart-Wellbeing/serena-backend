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

export const verifySerenBoxConnection = async (ip: SerenBox["ip_address"]) => {
    try {
        const res = await axios.get(`${ip}/ping`);

        return res;
    } catch (err) {
        throw new HttpError(503, "SerenBox unavailable");
    }
};

export const changeSerenBoxSlotStatus = async (
    serenBoxId: string,
    slot: SerenBoxSlots,
    status: boolean
) => {
    try {
        const path = `/diffusers/${slot}`;
        const res = await axios.get(path, {
            params: {
                state: status ? "on" : "off"
            }
        });

        console.log(res);
    } catch (err) {
        console.error(err);
    }

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
            }
        }
    });

    return {
        serenBoxId: updatedSerenBox.id,
        slotA: updatedSerenBox.slotA.is_active,
        slotB: updatedSerenBox.slotB.is_active
    };
};

export const finishSerenBoxSession = async (sessionId: string) => {
    const finishedSession = await prisma.serenBoxSession.update({
        where: {
            id: sessionId
        },
        data: {
            is_running: false,
            end_time: new Date()
        }
    });

    return finishedSession;
};
