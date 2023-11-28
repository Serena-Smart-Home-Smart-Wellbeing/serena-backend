import { parseToken } from "@/middlewares/auth";
import { handleAddSerenBox } from "@/middlewares/serenbox";
import express from "express";

const serenBoxRouter = express.Router({ mergeParams: true });

serenBoxRouter.route("/").post(parseToken, handleAddSerenBox);

export default serenBoxRouter;
