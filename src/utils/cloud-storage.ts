import { Bucket } from "@google-cloud/storage";

export const deleteStorageFolder = async (bucket: Bucket, folderName: string) => {
    const [files] = await bucket.getFiles({ prefix: folderName });

    await Promise.all(files.map(file => file.delete()));
};
