import { parseToken } from "@/middlewares/auth";
import {
    handleAddSerenBox,
    handleChangeSerenBoxSlotStatus,
    handleCreateSerenBoxSession,
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

export interface SerenBoxRouterParams {
    serenboxId: string;
}

serenBoxRouter
    .route("/:serenboxId")
    .get(parseToken, handleGetSerenBox)
    .delete(parseToken, handleDeleteSerenBox);

export interface SerenBoxSlotRouterParams extends SerenBoxRouterParams {
    slotOption: string;
}

serenBoxRouter
    .route("/:serenboxId/slots/:slotOption")
    .patch(parseToken, handleChangeSerenBoxSlotStatus);

export interface SerenBoxSessionRouterParams extends SerenBoxSlotRouterParams {
    sessionId: string;
}

serenBoxRouter
    .route("/:serenboxId/sessions")
    .post(parseToken, handleCreateSerenBoxSession);

export default serenBoxRouter;
