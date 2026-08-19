"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardAuctions = exports.cardSales = exports.TIER_NAME = exports.TIER_EMOJI = exports.TIER_PRICES = exports.ALL_CARDS = void 0;
exports.getCardPrice = getCardPrice;
exports.findCard = findCard;
exports.parseCard = parseCard;
exports.formatCard = formatCard;
exports.getRandomCard = getRandomCard;
exports.isGif = isGif;
exports.normalizeTier = normalizeTier;
exports.fetchSpawnCard = fetchSpawnCard;
const path_1 = require("path");
// ─── S-tier cards only (local) — used by CardInfo + CardSpawn S/Event ─────────
exports.ALL_CARDS = require((0, path_1.join)(process.cwd(), 'src/Helpers/s_cards.json'));
exports.TIER_PRICES = {
    '1': [2000, 4000],
    '2': [4000, 5000],
    '3': [4000, 5000],
    '4': [8000, 10000],
    '5': [25000, 40000],
    '6': [70000, 90000],
    'S': [100000, 500000]
};
exports.TIER_EMOJI = {
    '1': '⚪',
    '2': '💧',
    '3': '🌿',
    '4': '⚡',
    '5': '🔥',
    '6': '🌊',
    'S': '👑'
};
exports.TIER_NAME = {
    '1': 'Common',
    '2': 'Uncommon',
    '3': 'Rare',
    '4': 'Epic',
    '5': 'Legendary',
    '6': 'Ultra Rare ✨',
    'S': 'GOD TIER 💎'
};
function getCardPrice(tier) {
    const range = exports.TIER_PRICES[tier] ?? [1000, 3000];
    return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}
function findCard(title, tier) {
    return exports.ALL_CARDS.find(c => c.title === title && c.tier === tier);
}
function parseCard(cardStr) {
    const lastDash = cardStr.lastIndexOf('-');
    return {
        title: cardStr.substring(0, lastDash),
        tier: cardStr.substring(lastDash + 1)
    };
}
function formatCard(title, tier) {
    return `${title}-${tier}`;
}
// S-tier only random pick — for CardSpawn dev command
function getRandomCard() {
    return exports.ALL_CARDS[Math.floor(Math.random() * exports.ALL_CARDS.length)];
}
function isGif(url) {
    return url.toLowerCase().endsWith('.gif');
}
const CARD_API_URL = 'https://shoob-cards-api.onrender.com/api/cards?mode=spawn&key=Hellraizen';
/**
 * Maps API numeric tier → bot's string tier key.
 * shoob.gg uses 1–6 + 'S'. API returns number or string.
 */
function normalizeTier(raw) {
    const s = String(raw);
    if (['1', '2', '3', '4', '5', '6', 'S'].includes(s))
        return s;
    return '1'; // fallback
}
/**
 * Fetch one random card from the Shoob.gg API.
 * Returns null on failure so callers can fall back to local.
 */
async function fetchSpawnCard() {
    try {
        const res = await fetch(CARD_API_URL, { signal: AbortSignal.timeout(8000) });
        if (!res.ok)
            return null;
        const json = await res.json();
        if (!json.status || !json.result)
            return null;
        const r = json.result;
        const tier = normalizeTier(r.tier);
        const price = (typeof r.price === 'number' && r.price > 0)
            ? r.price
            : getCardPrice(tier);
        return {
            title: r.title,
            url: r.imageUrl,
            tier,
            series: r.series ?? '',
            price
        };
    }
    catch {
        return null;
    }
}
exports.cardSales = new Map();
exports.cardAuctions = new Map();
