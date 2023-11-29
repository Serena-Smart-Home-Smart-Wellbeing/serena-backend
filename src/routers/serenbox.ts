import { parseToken } from "@/middlewares/auth";
import {
    handleAddSerenBox,
    handleChangeSerenBoxSlotStatus,
    handleDeleteSerenBox,
    handleGetSerenBox,
    handleGetSerenBoxes,
    handlePatchSerenBoxIpAddress
} from "@/middlewares/serenbox";
import express from "express";

const serenBoxRouter = express.Router({ mergeParams: true });

serenBoxRouter
    .route("/")
    .post(parseToken, handleAddSerenBox)
    .get(parseToken, handleGetSerenBoxes)
    .patch(handlePatchSerenBoxIpAddress);

serenBoxRouter
    .route("/:serenboxId")
    .get(parseToken, handleGetSerenBox)
    .delete(parseToken, handleDeleteSerenBox);

serenBoxRouter
    .route("/:serenboxId/slots/:slotOption")
    .patch(parseToken, handleChangeSerenBoxSlotStatus);

export default serenBoxRouter;
