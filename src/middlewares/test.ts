import prisma from "@/utils/prisma";
import { RequestHandler } from "express";

export const destroyDatabase = async () => {
    if (process.env.NODE_ENV === "development") {
        const allProperties = Reflect.ownKeys(Object.getPrototypeOf(prisma));
        const modelNames = allProperties.filter(
            x =>
                x != "constructor" &&
                x != "on" &&
                x != "connect" &&
                x != "runDisconnect" &&
                x != "disconnect"
        );

        for (const modelName of modelNames) {
            // handle async stuff
            (prisma as any)[modelName].deleteMany();
        }
    }
};

export const teardownTest: RequestHandler = async (req, res, next) => {
    try {
        if (process.env.NODE_ENV === "development") {
            await destroyDatabase();
        }
        next();
    } catch (err) {
        next(err);
    }
};
