import { parseToken } from "@/middlewares/auth";
import {
    handleAddSerenBox,
    handleGetSerenBox,
    handleGetSerenBoxes
} from "@/middlewares/serenbox";
import express from "express";

const serenBoxRouter = express.Router({ mergeParams: true });

serenBoxRouter
    .route("/")
    .post(parseToken, handleAddSerenBox)
    .get(parseToken, handleGetSerenBoxes);

serenBoxRouter.route("/:serenboxId").get(parseToken, handleGetSerenBox);

export default serenBoxRouter;
