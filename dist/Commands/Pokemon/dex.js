"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PixelDexGen_1 = require("../../lib/PixelDexGen");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const query = (context ?? '').trim().toLowerCase();
            // ── DETAIL mode ─────────────────────────────────────────────────────────
            if (query) {
                const { party, pc } = await this.client.DB.getUser(M.sender.jid);
                const allOwned = [...party, ...pc];
                await M.reply(`🔍 *Scanning Pokédex for* _${query}_...`);
                const raw = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`);
                if (!raw?.name) {
                    return void await this.client.sendMessage(M.from, {
                        text: `❌ *"${query}"* not found! Make sure the name is spelled correctly.`,
                        footer: '🎮 Pokémon Hub',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                    }, { quoted: M.message });
                }
                const speciesRes = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon-species/${raw.id}`).catch(() => null);
                const description = speciesRes?.flavor_text_entries
                    ?.find(e => e.language.name === 'en')
                    ?.flavor_text
                    ?.replace(/\f|\n/g, ' ')
                    ?.slice(0, 180) ?? '';
                const ownedEntry = allOwned.find(p => p.name.toLowerCase() === raw.name.toLowerCase());
                const getStat = (name) => raw.stats.find(s => s.stat.name === name)?.base_stat ?? 0;
                const buffer = await (0, PixelDexGen_1.buildDexDetailCard)({
                    id: raw.id,
                    name: raw.name,
                    level: ownedEntry?.level,
                    rarity: ownedEntry?.rarity,
                    types: raw.types.map(t => t.type.name),
                    height: raw.height,
                    weight: raw.weight,
                    stats: {
                        hp: getStat('hp'),
                        attack: getStat('attack'),
                        defense: getStat('defense'),
                        spAtk: getStat('special-attack'),
                        spDef: getStat('special-defense'),
                        speed: getStat('speed'),
                    },
                    description,
                    isOwned: !!ownedEntry,
                });
                const typeEmoji = {
                    fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', psychic: '🔮',
                    fighting: '🥊', poison: '☠️', ground: '🌍', rock: '🪨', ice: '❄️',
                    bug: '🐛', ghost: '👻', dragon: '🐉', dark: '🌑', steel: '⚙️',
                    fairy: '✨', flying: '🌪️', normal: '⭐'
                };
                const types = raw.types.map(t => `${typeEmoji[t.type.name] ?? '❓'} ${this.client.utils.capitalize(t.type.name)}`).join('  ');
                const owned = ownedEntry ? `\n✅ *Owned!* Lv.${ownedEntry.level} · ${ownedEntry.rarity}` : `\n🔒 Not caught yet`;
                const caption = `🎮 *POKÉDEX — ${this.client.utils.capitalize(raw.name).toUpperCase()}*\n\n` +
                    `📛 *#${String(raw.id).padStart(3, '0')}*  ·  ${types}\n` +
                    `📏 *Height:* ${(raw.height / 10).toFixed(1)}m  ·  *Weight:* ${(raw.weight / 10).toFixed(1)}kg` +
                    owned;
                await M.reply(buffer, 'image', false, 'image/jpeg', caption);
                return void await this.client.sendMessage(M.from, {
                    text: `_Generate a TCG card: \`${p}pokecard ${query}\`_`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'More for this Pokémon',
                                    rows: [
                                        { title: '🃏 TCG Card', description: `Generate ${this.client.utils.capitalize(raw.name)} card`, id: `${p}pokecard ${query}` },
                                        { title: '🎒 My Party', description: 'View your Pokémon team', id: `${p}party` },
                                        { title: '📦 My PC Box', description: 'View stored Pokémon', id: `${p}pc` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                });
            }
            // ── OVERVIEW mode ────────────────────────────────────────────────────────
            const { party, pc, tag, username } = await this.client.DB.getUser(M.sender.jid);
            const allPokes = [...party, ...pc];
            if (allPokes.length < 1) {
                return void await this.client.sendMessage(M.from, {
                    text: `📱 *Pokédex is empty!*\n\n` +
                        `You haven't caught any Pokémon yet.\n` +
                        `Enable *${p}wild on* and use *${p}catch <name>* to start! 🎣`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            await M.reply(`📱 *Pokédex loading...* ${allPokes.length} Pokémon`);
            const partyDex = party.map(p => ({ name: p.name, id: p.id, level: p.level, rarity: p.rarity }));
            const pcDex = pc.map(p => ({ name: p.name, id: p.id, level: p.level, rarity: p.rarity }));
            const displayName = username?.name ?? M.sender.username ?? 'Trainer';
            const buffer = await (0, PixelDexGen_1.buildDexOverviewCard)({
                username: displayName,
                tag: tag ?? '????',
                party: partyDex,
                pc: pcDex,
            });
            const partyNames = party.map(p => `*${this.client.utils.capitalize(p.name)}* Lv.${p.level}`).join('  ·  ');
            const caption = `📱 *CELESTIC POKÉDEX*\n\n` +
                `👤 *${displayName}*  #${tag}\n` +
                `🎯 *Party (${party.length}/6):* ${partyNames || 'Empty'}\n` +
                `💾 *PC Box:* ${pc.length} Pokémon\n` +
                `📊 *Total:* ${allPokes.length} Pokémon\n\n` +
                `_Detail: \`${p}pokedex <name>\`_`;
            await M.reply(buffer, 'image', false, 'image/jpeg', caption);
            return void await this.client.sendMessage(M.from, {
                text: `Tap a Pokémon name for full stats! 👇`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Manage Your Pokémon',
                                rows: [
                                    { title: '🎒 My Party', description: 'View active party', id: `${p}party` },
                                    { title: '📦 My PC Box', description: 'View stored Pokémon', id: `${p}pc` },
                                    { title: '✨ Evolve', description: 'Evolve a Pokémon', id: `${p}evolve` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('pokedex', {
        description: 'View your Pokédex in retro pixel art style',
        aliases: ['dex'],
        exp: 20,
        cooldown: 15,
        usage: 'pokedex [pokemon_name|id]',
        category: 'pokemon'
    })
], command);
exports.default = command;
