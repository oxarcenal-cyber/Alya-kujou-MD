"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PokemonCardGen_1 = require("../../lib/PokemonCardGen");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const parts = (context ?? '').trim().toLowerCase().split(/\s+/);
            const query = parts[0];
            const isEx = parts.includes('ex');
            if (!query) {
                return void await this.client.sendMessage(M.from, {
                    text: `🃏 *Pokemon Card Generator*\n\n` +
                        `Usage: *${p}pokecard <name or id> [ex]*\n\n` +
                        `Examples:\n` +
                        `▸ \`${p}pokecard pikachu\`\n` +
                        `▸ \`${p}pokecard charizard ex\`\n` +
                        `▸ \`${p}pokecard 25\`\n\n` +
                        `_Add \`ex\` at the end to generate an EX card with boosted HP!_`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            await M.reply(`✨ Generating your *${isEx ? 'EX ' : ''}Pokémon card*... Please wait!`);
            const raw = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`);
            if (!raw || !raw.name) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *"${query}"* not found!\n\n` +
                        `Make sure the Pokémon name is spelled correctly.\n` +
                        `Example: \`${p}pokecard mewtwo\``,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            const cardData = (0, PokemonCardGen_1.derivePokemonCardData)(raw, isEx);
            const buffer = await (0, PokemonCardGen_1.buildPokemonCard)(cardData);
            const typeEmoji = {
                fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', psychic: '🔮',
                fighting: '🥊', poison: '☠️', ground: '🌍', rock: '🪨', ice: '❄️',
                bug: '🐛', ghost: '👻', dragon: '🐉', dark: '🌑', steel: '⚙️',
                fairy: '✨', flying: '🌪️', normal: '⭐'
            };
            const typeIcon = typeEmoji[cardData.type] ?? '⭐';
            const caption = `${isEx ? '💎 *EX CARD* 💎' : '🃏 *Pokemon TCG Card*'}\n\n` +
                `🐾 *${cardData.displayName}${isEx ? ' ex' : ''}*\n` +
                `${typeIcon} *Type:* ${cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1)}\n` +
                `❤️ *HP:* ${cardData.hp}\n` +
                `⚔️ *${cardData.attack1.name}:* ${cardData.attack1.damage} dmg\n` +
                `📌 *#${String(cardData.pokedexNum).padStart(3, '0')} / 898*`;
            await M.reply(buffer, 'image', false, 'image/jpeg', caption);
            return void await this.client.sendMessage(M.from, {
                text: `_Add \`ex\` for an EX version: \`${p}pokecard ${query} ex\`_`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'More Actions',
                                rows: [
                                    { title: '🃏 Another Card', description: 'Generate another Pokémon card', id: `${p}pokecard` },
                                    { title: '📖 Pokédex', description: 'View Pokédex entry', id: `${p}pokedex ${query}` },
                                    { title: '🎒 My Party', description: 'View your Pokémon team', id: `${p}party` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('pokecard', {
        description: 'Generate a premium Pokemon TCG-style card for any Pokémon',
        usage: 'pokecard <name|id> [ex]',
        category: 'pokemon',
        cooldown: 20,
        exp: 15,
        aliases: ['pkcard', 'tcgcard', 'pcard']
    })
], default_1);
exports.default = default_1;
