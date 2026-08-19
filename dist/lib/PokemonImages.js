"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POKEMON_IMAGES = void 0;
exports.getRandomPokemonImage = getRandomPokemonImage;
exports.replyWithPokemonImage = replyWithPokemonImage;
const path_1 = require("path");
const fs_1 = require("fs");
const ROOT = (0, path_1.join)(__dirname, '..', '..');
const POKEMON_IMG_DIR = (0, path_1.join)(ROOT, 'assets', 'images', 'pokemon');
const img = (name) => (0, path_1.join)(POKEMON_IMG_DIR, name);
// ── Image Pools by Category ───────────────────────────────────────────────────
// Used ONLY in Pokemon commands (startjourney, choosestarter, challenge, catch, etc.)
exports.POKEMON_IMAGES = {
    /** Pokemon adventure / world / travel scenes */
    pokemon: [
        img('mystery-dungeon.jpg'),
        img('new-bark-town.jpg'),
        img('fire-starters.jpg'),
        img('lillie.jpg'),
        img('nessa.jpg'),
        img('pocket-monsters.jpg'),
        img('ash-campfire.jpg'),
        img('ash-gengar-campfire.jpg'),
        img('ash-friends-tree.jpg'),
        img('legends-arceus.jpg'),
        img('i-choose-you.jpg'),
        img('lumiose-city.jpg'),
        img('may-ash-drew.jpg'),
        img('misty-gyarados.jpg'),
        img('pixel-trainer-arcade.jpg'),
        img('beach-picnic.jpg'),
        img('championship.jpg'),
        img('starter-pokeballs.jpg'),
    ],
    /** Battle / VS / Fight screens */
    battle: [
        img('fight-menu.jpg'),
        img('battle-3ds.jpg'),
        img('pixel-rpg-battle.jpg'),
        img('trainer-vs.jpg'),
        img('red-vs-blue.jpg'),
        img('charizard-vs-blastoise.jpg'),
        img('pokeball-spin.gif'),
    ],
    /** Welcome / Journey start / Press Start */
    welcome: [
        img('press-start.jpg'),
        img('start-game.jpg'),
        img('welcome-neon.jpg'),
        img('loading-start.jpg'),
        img('red-pokedex.jpg'),
    ],
    /** Win / Victory / Level Up */
    win: [
        img('you-win.jpg'),
        img('level-up.jpg'),
        img('championship.jpg'),
    ],
    /** Lose / Game Over */
    lose: [
        img('game-over.jpg'),
        img('delete-memories.jpg'),
    ],
    /** Pokedex / Info / scan */
    pokedex: [
        img('red-pokedex.jpg'),
        img('dialogue-what.jpg'),
        img('gameboy-continue.jpg'),
    ],
};
/**
 * Returns a random image Buffer from the given category.
 * Returns null silently if the file is missing — commands fall back to text-only.
 */
function getRandomPokemonImage(category) {
    const pool = exports.POKEMON_IMAGES[category];
    if (!pool.length)
        return null;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    try {
        return (0, fs_1.readFileSync)(chosen);
    }
    catch {
        return null;
    }
}
/**
 * Helper — send an image reply with a caption, or fall back to text-only.
 * For use ONLY in Pokemon commands.
 */
async function replyWithPokemonImage(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
M, category, caption) {
    const buf = getRandomPokemonImage(category);
    if (buf) {
        await M.reply(buf, 'image', undefined, undefined, caption);
    }
    else {
        await M.reply(caption);
    }
}
