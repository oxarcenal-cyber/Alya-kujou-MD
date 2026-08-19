"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lyrics = void 0;
const axios_1 = __importDefault(require("axios"));
class Lyrics {
    constructor() {
        /**
         * Search for a song using lrclib.net (no auth required, returns lyrics directly).
         * Falls back to iTunes Search API for album art since lrclib doesn't provide images.
         */
        this.search = async (query) => {
            try {
                const res = await axios_1.default.get(`https://lrclib.net/api/search`, {
                    params: { q: query },
                    timeout: 10000
                });
                const hits = res.data;
                if (!hits || !hits.length)
                    return [];
                const data = [];
                for (const hit of hits.slice(0, 5)) {
                    if (hit.instrumental || !hit.plainLyrics)
                        continue;
                    // fetch album art from iTunes
                    const image = await this._getAlbumArt(`${hit.trackName} ${hit.artistName}`);
                    data.push({
                        title: hit.trackName,
                        fullTitle: `${hit.trackName} — ${hit.artistName}`,
                        artist: hit.artistName,
                        image,
                        lyrics: hit.plainLyrics,
                        url: `https://lrclib.net/api/get/${hit.id}`
                    });
                }
                return data;
            }
            catch (err) {
                console.error(`[Lyrics.search] Failed to search for "${query}":`, err.message);
                return [];
            }
        };
        /** No-op kept for compatibility — lyrics already included in search result */
        this.parseLyrics = async (_url) => '';
        this._getAlbumArt = async (query) => {
            try {
                const res = await axios_1.default.get(`https://itunes.apple.com/search`, {
                    params: { term: query, media: 'music', limit: 1 },
                    timeout: 8000
                });
                const results = res.data?.results;
                if (results?.length) {
                    // upgrade to 500x500 art
                    return results[0].artworkUrl100.replace('100x100bb', '500x500bb');
                }
            }
            catch {
                // ignore — will use fallback image below
            }
            return 'https://i.imgur.com/vKBBXvQ.png'; // generic music note placeholder
        };
    }
}
exports.Lyrics = Lyrics;
