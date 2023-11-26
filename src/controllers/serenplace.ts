import prisma from "@/utils/prisma";

export const getSerenPlaceProducts = async () => {
    const products = await prisma.serenPlaceProduct.findMany();

    return products;
};

export const getSerenPlaceProduct = async (id: string) => {
    const product = await prisma.serenPlaceProduct.findUnique({
        where: {
            id
        }
    });

    return product;
};
