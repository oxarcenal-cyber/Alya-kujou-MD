"use strict";
/**
 * Shared in-memory state for the Card Battle system.
 * CardBattle.ts and shortcut-command files all import from here so they
 * share the exact same Map/Set instances (Node module-cache guarantees this).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.modeLabel = exports.getStats = exports.defaultStats = exports.normalize = exports.modeFrom = exports.MODES = exports.rewardKey = exports.rewards = exports.activeUsers = exports.sessions = exports.pending = void 0;
// ─── Shared state maps ─────────────────────────────────────────────────────────
exports.pending = new Map();
exports.sessions = new Map();
exports.activeUsers = new Set();
exports.rewards = new Map();
// ─── Shared helpers ────────────────────────────────────────────────────────────
const rewardKey = (group, jid) => `${group}:${jid}`;
exports.rewardKey = rewardKey;
exports.MODES = {
    friendly: 'Friendly — no stakes',
    gold: 'Gold — winner takes the agreed gold',
    card: 'Card — winner chooses one unprotected card',
    ranked: 'Ranked — rating changes, no card loss'
};
const modeFrom = (value) => ['friendly', 'gold', 'card', 'ranked'].includes(value)
    ? value
    : null;
exports.modeFrom = modeFrom;
const normalize = (jid) => `${jid.split('@')[0].split(':')[0]}@s.whatsapp.net`;
exports.normalize = normalize;
const defaultStats = () => ({
    wins: 0, losses: 0, rating: 1000, streak: 0,
    cardsWon: 0, cardsLost: 0, protectedCards: [], history: []
});
exports.defaultStats = defaultStats;
const getStats = (user) => {
    const raw = user.cardBattle ?? {};
    return {
        ...(0, exports.defaultStats)(),
        ...raw,
        protectedCards: Array.isArray(raw.protectedCards) ? raw.protectedCards : [],
        history: Array.isArray(raw.history) ? raw.history : []
    };
};
exports.getStats = getStats;
const modeLabel = (mode) => exports.MODES[mode].split(' — ')[0];
exports.modeLabel = modeLabel;
