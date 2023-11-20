import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const client = new SecretManagerServiceClient();

export const getJwtAccessSecret = async () => {
    const [accessResponse] = await client.accessSecretVersion({
        name: "projects/738222459045/secrets/jwt-access-secret/versions/1"
    });

    const responsePayload = accessResponse.payload?.data?.toString();
    return responsePayload;
};
