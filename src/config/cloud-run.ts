import { ServicesClient } from '@google-cloud/run';

// Instantiates a client
const runClient = new ServicesClient();

export const getSerenaEmotionDetectorUri = async () => {
    const serenaEmotionDetectorName = runClient.servicePath(
        'serena-777',
        'asia-southeast2',
        'serena-emotion-detector'
    );

    const [{ uri }] = await runClient.getService({
        name: serenaEmotionDetectorName,
    });

    return uri;
};
