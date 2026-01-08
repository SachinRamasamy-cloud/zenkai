import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';
const RATE_LIMIT_DELAY = 350;

let requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
    if (isProcessing || requestQueue.length === 0) return;

    isProcessing = true;
    const { resolve, reject, config } = requestQueue.shift();

    try {
        const response = await axios(config);
        resolve(response.data);
    } catch (error) {
        console.error("API Error:", error?.response?.status, error.message);
        reject(error);
    } finally {
        setTimeout(() => {
            isProcessing = false;
            processQueue();
        }, RATE_LIMIT_DELAY);
    }
};

export const apiClient = {
    get: (url, params = {}) => {
        return new Promise((resolve, reject) => {
            requestQueue.push({
                resolve,
                reject,
                config: { method: 'GET', url: `${BASE_URL}${url}`, params },
            });
            processQueue();
        });
    },
};

export const animeApi = {
    getTopAnime: (filter = 'airing') => apiClient.get('/top/anime', { filter, limit: 10 }),
    searchAnime: (query) => apiClient.get('/anime', { q: query, limit: 12 }),
    getAnimeDetails: (id) => apiClient.get(`/anime/${id}`),
    getAnimeCharacters: (id) => apiClient.get(`/anime/${id}/characters`),
    getAnimeRecommendations: (id) => apiClient.get(`/anime/${id}/recommendations`),
    getMovies: (page = 1) => apiClient.get('/top/anime', { type: 'movie', page: page, limit: 24 }),
    getGenres: () => apiClient.get('/genres/anime'),

    getAnimeByGenre: (genreId, page = 1) => apiClient.get('/anime', {
        genres: genreId,
        page: page,
        limit: 24,
        order_by: 'score', // Sort by score so we see good anime first
        sort: 'desc'
    }),
    searchAnime: (query, page = 1) => apiClient.get('/anime', { 
    q: query, 
    page: page, 
    limit: 24,
    sfw: true 
  }),
    getSeries: (page = 1) => apiClient.get('/top/anime', { type: 'tv', page: page, limit: 24 }),

};