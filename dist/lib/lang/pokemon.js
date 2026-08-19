"use strict";
/**
 * LANG — Pokemon category (catching, spawn toggles)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemon = void 0;
exports.pokemon = {
    en: {
        pokemon_caught: '🎉 You caught *{name}*!',
        pokemon_miss: '😢 Too slow! *{name}* escaped.',
        pokemon_owned: '⚠️ Someone already caught *{name}*!',
        spawn_group_only: '👥 This command only works in groups.',
        spawn_admin_only: '⚔️ Only group admins or mods can use this command.',
        spawn_usage: '🎮 *Spawn Control*\n\n' +
            '`{p}spawn cards on/off` — Card spawning\n' +
            '`{p}spawn wild on/off` — Pokémon spawning\n' +
            '`{p}spawn all on/off` — Both at once\n' +
            '`{p}spawn status` — Current status',
        spawn_status: '🎮 *Spawn Status*\n\n' +
            '🃏 Cards: {chara}\n' +
            '🐾 Pokémon: {wild}',
        spawn_chara_on: '🟢 *Card spawning ON!* 🃏\nCards will now spawn in this group.',
        spawn_chara_off: '🔴 *Card spawning OFF!* 🃏\nCards will no longer spawn.',
        spawn_wild_on: '🟢 *Pokémon spawning ON!* 🐾\nPokémon will now spawn in this group.',
        spawn_wild_off: '🔴 *Pokémon spawning OFF!* 🐾\nPokémon will no longer spawn.',
        spawn_all_on: '🟢 *Both spawning ON!*\n🃏 Cards + 🐾 Pokémon enabled.',
        spawn_all_off: '🔴 *Both spawning OFF!*\n🃏 Cards + 🐾 Pokémon disabled.',
        spawn_already: '🟨 *{feature} spawning is already {state}* in this group!',
    },
    hi: {
        pokemon_caught: '🎉 Tumne *{name}* pakad liya!',
        pokemon_miss: '😢 Bahut dheere! *{name}* bhaag gaya.',
        pokemon_owned: '⚠️ Kisi aur ne already *{name}* pakad liya!',
        spawn_group_only: '👥 Ye command sirf groups mein kaam karti hai.',
        spawn_admin_only: '⚔️ Sirf group admins ya mods ye command use kar sakte hain.',
        spawn_usage: '🎮 *Spawn Control*\n\n' +
            '`{p}spawn cards on/off` — Card spawning\n' +
            '`{p}spawn wild on/off` — Pokémon spawning\n' +
            '`{p}spawn all on/off` — Dono ek saath\n' +
            '`{p}spawn status` — Current status dekho',
        spawn_status: '🎮 *Spawn Status*\n\n' +
            '🃏 Cards: {chara}\n' +
            '🐾 Pokémon: {wild}',
        spawn_chara_on: '🟢 *Card spawning ON!* 🃏\nAb is group mein cards spawn honge.',
        spawn_chara_off: '🔴 *Card spawning OFF!* 🃏\nCards ab spawn nahi honge.',
        spawn_wild_on: '🟢 *Pokémon spawning ON!* 🐾\nAb is group mein Pokémon spawn honge.',
        spawn_wild_off: '🔴 *Pokémon spawning OFF!* 🐾\nPokémon ab spawn nahi honge.',
        spawn_all_on: '🟢 *Dono spawning ON!*\n🃏 Cards + 🐾 Pokémon enable ho gaye.',
        spawn_all_off: '🔴 *Dono spawning OFF!*\n🃏 Cards + 🐾 Pokémon disable ho gaye.',
        spawn_already: '🟨 *{feature} spawning already {state} hai* is group mein!',
    }
};
