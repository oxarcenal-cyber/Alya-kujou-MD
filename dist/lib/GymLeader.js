"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickGymLeader = exports.GYM_LEADER_TYPES = void 0;
exports.GYM_LEADER_TYPES = [
    { type: 'Fire', emoji: '🔥', badge: 'Fire Badge', pokemonIds: [146, 244, 250, 485, 637] },
    { type: 'Water', emoji: '💧', badge: 'Water Badge', pokemonIds: [245, 382, 490, 645] },
    { type: 'Electric', emoji: '⚡', badge: 'Electric Badge', pokemonIds: [145, 405, 466, 642] },
    { type: 'Grass', emoji: '🌿', badge: 'Grass Badge', pokemonIds: [251, 492, 649] },
    { type: 'Psychic', emoji: '🔮', badge: 'Psychic Badge', pokemonIds: [150, 151, 386, 649] },
    { type: 'Dragon', emoji: '🐉', badge: 'Dragon Badge', pokemonIds: [384, 483, 484, 643, 644] },
    { type: 'Ice', emoji: '❄️', badge: 'Ice Badge', pokemonIds: [144, 380, 646] },
    { type: 'Rock', emoji: '🪨', badge: 'Rock Badge', pokemonIds: [377, 486, 797] }
];
const pickGymLeader = () => {
    const type = exports.GYM_LEADER_TYPES[Math.floor(Math.random() * exports.GYM_LEADER_TYPES.length)];
    const pokemonId = type.pokemonIds[Math.floor(Math.random() * type.pokemonIds.length)];
    const level = Math.floor(Math.random() * (65 - 45 + 1)) + 45;
    return { type, pokemonId, level };
};
exports.pickGymLeader = pickGymLeader;
