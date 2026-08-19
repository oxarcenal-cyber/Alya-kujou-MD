"use strict";
/**
 * PokemonRegions — Region data, starters, and trainer sprites for the Journey system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGIONS = exports.TRAINER_SPRITES = void 0;
exports.getTrainerSprite = getTrainerSprite;
exports.getRegion = getRegion;
// ── Trainer Sprites ─────────────────────────────────────────────────────────
exports.TRAINER_SPRITES = [
    { id: 1, name: 'Red', gender: '♂', game: 'Kanto', url: 'https://play.pokemonshowdown.com/sprites/trainers/red.png' },
    { id: 2, name: 'Leaf', gender: '♀', game: 'Kanto', url: 'https://play.pokemonshowdown.com/sprites/trainers/leaf.png' },
    { id: 3, name: 'Ethan', gender: '♂', game: 'Johto', url: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png' },
    { id: 4, name: 'Lyra', gender: '♀', game: 'Johto', url: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png' },
    { id: 5, name: 'Brendan', gender: '♂', game: 'Hoenn', url: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png' },
    { id: 6, name: 'May', gender: '♀', game: 'Hoenn', url: 'https://play.pokemonshowdown.com/sprites/trainers/may.png' },
    { id: 7, name: 'Lucas', gender: '♂', game: 'Sinnoh', url: 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png' },
    { id: 8, name: 'Dawn', gender: '♀', game: 'Sinnoh', url: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png' },
    { id: 9, name: 'Hilbert', gender: '♂', game: 'Unova', url: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png' },
    { id: 10, name: 'Hilda', gender: '♀', game: 'Unova', url: 'https://play.pokemonshowdown.com/sprites/trainers/hilda.png' },
    { id: 11, name: 'Calem', gender: '♂', game: 'Kalos', url: 'https://play.pokemonshowdown.com/sprites/trainers/calem.png' },
    { id: 12, name: 'Serena', gender: '♀', game: 'Kalos', url: 'https://play.pokemonshowdown.com/sprites/trainers/serena.png' },
];
function getTrainerSprite(id) {
    return exports.TRAINER_SPRITES.find(t => t.id === id) ?? exports.TRAINER_SPRITES[6]; // default Lucas
}
const path_1 = require("path");
const REGION_IMG = (name) => (0, path_1.join)(__dirname, '..', '..', 'assets', 'images', 'regions', `${name}.jpg`);
// ── Regions ─────────────────────────────────────────────────────────────────
exports.REGIONS = [
    {
        key: 'kanto', name: 'Kanto', emoji: '🗺️',
        desc: 'The original region — home of Pallet Town & the legendary Red.',
        badgeCount: 8,
        image: REGION_IMG('kanto'),
        starters: [
            { id: 1, name: 'Bulbasaur', type: 'Grass/Poison', emoji: '🌿' },
            { id: 4, name: 'Charmander', type: 'Fire', emoji: '🔥' },
            { id: 7, name: 'Squirtle', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'johto', name: 'Johto', emoji: '🏯',
        desc: 'Land of tradition & mystery — two regions, one adventure.',
        badgeCount: 8,
        image: REGION_IMG('johto'),
        starters: [
            { id: 152, name: 'Chikorita', type: 'Grass', emoji: '🌿' },
            { id: 155, name: 'Cyndaquil', type: 'Fire', emoji: '🔥' },
            { id: 158, name: 'Totodile', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'hoenn', name: 'Hoenn', emoji: '🌊',
        desc: 'A tropical archipelago shaped by land & sea Legendaries.',
        badgeCount: 8,
        image: REGION_IMG('hoenn'),
        starters: [
            { id: 252, name: 'Treecko', type: 'Grass', emoji: '🌿' },
            { id: 255, name: 'Torchic', type: 'Fire', emoji: '🔥' },
            { id: 258, name: 'Mudkip', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'sinnoh', name: 'Sinnoh', emoji: '🏔️',
        desc: 'A mountainous region steeped in myth about the creation of the universe.',
        badgeCount: 8,
        image: REGION_IMG('sinnoh'),
        starters: [
            { id: 387, name: 'Turtwig', type: 'Grass', emoji: '🌿' },
            { id: 390, name: 'Chimchar', type: 'Fire', emoji: '🔥' },
            { id: 393, name: 'Piplup', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'unova', name: 'Unova', emoji: '🏙️',
        desc: 'A modern, cosmopolitan region far from others — inspired by New York.',
        badgeCount: 8,
        image: REGION_IMG('unova'),
        starters: [
            { id: 495, name: 'Snivy', type: 'Grass', emoji: '🌿' },
            { id: 498, name: 'Tepig', type: 'Fire', emoji: '🔥' },
            { id: 501, name: 'Oshawott', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'kalos', name: 'Kalos', emoji: '🗼',
        desc: 'A beautiful, France-inspired region where Mega Evolution was discovered.',
        badgeCount: 8,
        image: REGION_IMG('kalos'),
        starters: [
            { id: 650, name: 'Chespin', type: 'Grass', emoji: '🌿' },
            { id: 653, name: 'Fennekin', type: 'Fire', emoji: '🔥' },
            { id: 656, name: 'Froakie', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'alola', name: 'Alola', emoji: '🌺',
        desc: 'A tropical island paradise with Island Trials instead of Gym Badges.',
        badgeCount: 4,
        image: REGION_IMG('alola'),
        starters: [
            { id: 722, name: 'Rowlet', type: 'Grass/Flying', emoji: '🌿' },
            { id: 725, name: 'Litten', type: 'Fire', emoji: '🔥' },
            { id: 728, name: 'Popplio', type: 'Water', emoji: '💧' },
        ]
    },
    {
        key: 'galar', name: 'Galar', emoji: '⚽',
        desc: 'A UK-inspired region where Pokémon battles are a national sport.',
        badgeCount: 8,
        image: REGION_IMG('galar'),
        starters: [
            { id: 810, name: 'Grookey', type: 'Grass', emoji: '🌿' },
            { id: 813, name: 'Scorbunny', type: 'Fire', emoji: '🔥' },
            { id: 816, name: 'Sobble', type: 'Water', emoji: '💧' },
        ]
    },
];
function getRegion(key) {
    return exports.REGIONS.find(r => r.key === key.toLowerCase());
}
