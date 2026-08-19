"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PokemonEvolution_1 = require("../../lib/PokemonEvolution");
const PokemonImages_1 = require("../../lib/PokemonImages");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const { party } = user;
            const p = this.client.config.prefix;
            if (party.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *No Pokémon in party!*\n\n` +
                        `Catch some wild Pokémon first with *${p}catch*\n` +
                        `when they appear in groups.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            // No arg → show party with evolution hint
            if (!context?.trim()) {
                let msg = `✨ *Evolve a Pokémon*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
                party.forEach((pk, i) => {
                    msg += `*${i + 1}.* ${this.client.utils.capitalize(pk.name)} — Lv. ${pk.level} ⭐ ${pk.rarity}\n`;
                });
                msg += `\n💡 Usage: *${p}evolve <slot>*\nExample: *${p}evolve 1*\n\n`;
                msg += `_Most Pokémon evolve between Lv. 16–36. Check with the command!_`;
                return void await this.client.sendMessage(M.from, {
                    text: msg,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Train & Evolve',
                                    rows: [
                                        { title: '🍬 Rare Candy', description: 'Level up a Pokémon (500 coins)', id: `${p}rarecandy` },
                                        { title: '🎒 My Party', description: 'View active party', id: `${p}party` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const slot = parseInt(context.trim());
            if (isNaN(slot) || slot < 1 || slot > party.length)
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Invalid slot!* Pick a number between *1* and *${party.length}*.\n\nUse *${p}evolve* to see your party.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✨ View Party', id: `${p}evolve` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            const pokemon = party[slot - 1];
            await M.reply(`🔍 Checking evolution for *${this.client.utils.capitalize(pokemon.name)}* (Lv. ${pokemon.level})...`);
            const result = await (0, PokemonEvolution_1.checkEvolution)(pokemon.name, pokemon.level);
            if (!result.canEvolve)
                return void await this.client.sendMessage(M.from, {
                    text: `⚠️ *${this.client.utils.capitalize(pokemon.name)}* cannot evolve right now.\n\n📋 *Reason:* ${result.reason}`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🍬 Rare Candy', id: `${p}rarecandy` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            // ── Evolve! ─────────────────────────────────────────────────────────────
            const evolvedName = result.evolvedName;
            const evolvedId = result.evolvedId;
            const evolvedImage = result.evolvedImage;
            const updatedParty = [...party];
            updatedParty[slot - 1] = {
                name: evolvedName,
                image: evolvedImage,
                id: evolvedId,
                level: pokemon.level,
                rarity: pokemon.rarity
            };
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party: updatedParty } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            const msg = `✨ *EVOLUTION!* ✨\n\n` +
                `*${this.client.utils.capitalize(pokemon.name)}* → *${this.client.utils.capitalize(evolvedName)}*! 🎉\n\n` +
                `📊 *Level:* ${pokemon.level}\n` +
                `⭐ *Rarity:* ${pokemon.rarity}\n\n` +
                `Your *${this.client.utils.capitalize(evolvedName)}* is ready for battle! 💪`;
            await (0, PokemonImages_1.replyWithPokemonImage)(M, 'win', msg);
            // Button after evolution success
            return void await this.client.sendMessage(M.from, {
                text: `🏟️ Try *${p}challenge* to test it against a Gym Leader!`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Next Steps',
                                rows: [
                                    { title: '🏟️ Challenge Gym', description: 'Battle the active Gym Leader', id: `${p}challenge` },
                                    { title: '⚔️ PVP Battle', description: 'Test it against a trainer', id: `${p}pvp` },
                                    { title: '🎒 My Party', description: 'View updated party', id: `${p}party` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('evolve', {
        description: '✨ Evolve a Pokémon in your party if it meets the level requirement',
        usage: 'evolve [slot 1-6]',
        category: 'pokemon',
        cooldown: 15,
        exp: 20,
        aliases: ['evo', 'evolution']
    })
], default_1);
exports.default = default_1;
