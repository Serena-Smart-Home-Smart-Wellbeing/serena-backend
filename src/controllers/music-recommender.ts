import axios from "axios";

export const getRecommendations = async (
    spotifyToken: string,
    mood: number,
    seed_genres = "k-pop",
    limit = 10
) => {
    const { data } = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: {
            Authorization: `Bearer ${spotifyToken}`
        },
        params: {
            limit,
            seed_genres,
            // target_valence: mood,
            min_valence: mood - Math.random() * 0.5,
            max_valence: mood + Math.random() * 0.5,
            energy: mood
        }
    });

    // @ts-expect-error - not worth to make schema
    return data.tracks.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        release_year: +track.album.release_date.split("-")[0],
        cover_image: track.album.images[1].url,
        preview_link: track.preview_url || track.external_urls.spotify
    }));
};
