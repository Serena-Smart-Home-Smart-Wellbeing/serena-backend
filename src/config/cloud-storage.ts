import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export const serenaAppStorage = storage.bucket('serena-app-storage');
