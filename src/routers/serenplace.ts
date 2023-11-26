import {
    handleGetSerenPlaceProduct,
    handleGetSerenPlaceProducts
} from "@/middlewares/serenplace";
import express from "express";

const serenPlaceRouter = express.Router({ mergeParams: true });

serenPlaceRouter.get("/:productId", handleGetSerenPlaceProduct);
serenPlaceRouter.get("/", handleGetSerenPlaceProducts);

export default serenPlaceRouter;
