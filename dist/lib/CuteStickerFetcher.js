"use strict";
/**
 * 🐾 CuteStickerFetcher
 * Fetches cute anime-style images (neko / kitsune) from nekos.best
 * and converts them into WhatsApp stickers using wa-sticker-formatter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCuteSticker = void 0;
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const CUTE_ENDPOINTS = ['neko', 'kitsune'];
const pickEndpoint = () => CUTE_ENDPOINTS[Math.floor(Math.random() * CUTE_ENDPOINTS.length)];
const fetchBuffer = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok)
        throw new Error(`HTTP ${res.status} from ${url}`);
    return Buffer.from(await res.arrayBuffer());
};
const getCuteSticker = async () => {
    const endpoint = pickEndpoint();
    const apiUrl = `https://nekos.best/api/v2/${endpoint}`;
    const apiRes = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!apiRes.ok)
        throw new Error(`nekos.best API error: ${apiRes.status}`);
    const json = (await apiRes.json());
    const imageUrl = json.results?.[0]?.url;
    if (!imageUrl)
        throw new Error('nekos.best: no image URL in response');
    const imageBuffer = await fetchBuffer(imageUrl);
    const sticker = new wa_sticker_formatter_1.Sticker(imageBuffer, {
        pack: '🐾 Mochi Cats',
        author: '✨ RedzeoX',
        type: 'full',
        quality: 70,
        categories: ['💗', '😺'],
    });
    return await sticker.build();
};
exports.getCuteSticker = getCuteSticker;
