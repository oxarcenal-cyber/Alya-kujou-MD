"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.ranks = void 0;
exports.ranks = [
    '🌸 Citizen',
    '🔎 Cleric',
    '💰 Wizard',
    '♦️ Mage',
    '🎯 Noble',
    '🎯 Noble II',
    '✨ Elite',
    '✨ Elite II',
    '✨ Elite III',
    '🔶️ Ace',
    '🔶️ Ace II',
    '🔶️ Ace III',
    '🔶️ Ace IV',
    '☣ Knight',
    '☣ Knight II',
    '☣ Knight III',
    '☣ Knight IV',
    '☣ Knight V',
    '🌀 Hero',
    '🌀 Hero II',
    '🌀 Hero III',
    '🌀 Hero IV',
    '🌀 Hero V',
    '💎 Supreme',
    '💎 Supreme II',
    '💎 Supreme III',
    '💎 Supreme IV',
    '💎 Supreme V',
    '❄️ Mystic',
    '❄️ Mystic II',
    '❄️ Mystic III',
    '❄️ Mystic IV',
    '❄️ Mystic V',
    '🔆 Legendary',
    '🔆 Legendary II',
    '🔆 Legendary III',
    '🔆 Legendary IV',
    '🔆 Legendary V',
    '🛡 Guardian',
    '🛡 Guardian II',
    '🛡 Guardian III',
    '🛡 Guardian IV',
    '🛡 Guardian V',
    '♨ Valor'
];
const getStats = (level) => {
    let required = 100;
    for (let i = 1; i <= level; i++)
        required += 5 * (i * 50) + 100 * i * (i * (i + 1)) + 300;
    const rank = level > exports.ranks.length ? exports.ranks[exports.ranks.length - 1] : exports.ranks[level - 1];
    return {
        requiredXpToLevelUp: required,
        rank
    };
};
exports.getStats = getStats;
