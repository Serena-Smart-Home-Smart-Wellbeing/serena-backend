import { serenaAppStorage } from '@/config/cloud-storage';
import {
    getSerenPlaceProducts,
    getSerenPlaceProduct,
} from '@/controllers/serenplace';
import { HttpError } from '@/utils/errors';
import { RequestHandler } from 'express';

export const handleGetSerenPlaceProducts: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const products = await getSerenPlaceProducts();
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

export const handleGetSerenPlaceProduct: RequestHandler<{
    productId: string;
}> = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await getSerenPlaceProduct(productId);

        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        product.image_name = serenaAppStorage
            .file(product.image_name)
            .publicUrl();

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};
