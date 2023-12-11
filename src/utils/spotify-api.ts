import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials');
}

const spotify = SpotifyApi.withClientCredentials(clientId, clientSecret);

export default spotify;
