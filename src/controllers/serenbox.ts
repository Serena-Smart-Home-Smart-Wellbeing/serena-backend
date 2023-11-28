import prisma from "@/utils/prisma";
import { SerenBox, SerenBoxLabels, SerenBoxSlots } from "@prisma/client";

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
