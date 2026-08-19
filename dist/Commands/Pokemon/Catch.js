"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PokemonRarity_1 = require("../../lib/PokemonRarity");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!this.handler.pokemonResponse.has(M.from))
                return void M.reply(`There's no wild Pokémon here right now. Wait for one to appear, or ask an admin to turn spawning on with *${this.client.config.prefix}wild on*.`);
            const data = this.handler.pokemonResponse.get(M.from);
            if (!context)
                return void M.reply(`Provide the Pokémon's name to catch it. Example: *${this.client.config.prefix}catch ${data.name}*`);
            const pokemon = context.trim().toLowerCase().split(' ')[0].trim();
            if (pokemon !== data.name)
                return void M.reply(`❌ *"${this.client.utils.capitalize(pokemon)}"* is not the right name. Try again!`);
            const rarity = (data.rarity ?? 'common');
            const meta = PokemonRarity_1.RARITY_META[rarity];
            if (Math.random() > meta.catchChance)
                return void M.reply(`${meta.emoji} *${this.client.utils.capitalize(data.name)}* broke free and ran away! ${meta.label} Pokémon are tricky to catch — try again quick!`);
            this.handler.pokemonResponse.delete(M.from);
            let { party, pc } = await this.client.DB.getUser(M.sender.jid);
            const Text = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                `  🌸✿ᰰ  *${this.client.utils.capitalize(data.name)}*  ✿ᰰ🌸\n` +
                `      𐚁 ${meta.emoji} 𝑮𝒐𝒕𝒄𝒉𝒂! ✅ 𐚁\n\n` +
                `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${data.level}\n` +
                `  ‧₊˚ 🎒 𝑺𝒕𝒐𝒓𝒆𝒅  ·❀·  ${party.length >= 6 ? 'PC' : 'Party'}\n\n` +
                `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒂𝒖𝒈𝒉𝒕 𖥻ִֶָ`;
            party.length >= 6 ? pc.push(data) : party.push(data);
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party, pc } });
            // ── Edit the original spawn message immediately ─────────────────────
            const spawnInfo = this.handler.pokemonSpawnInfo.get(M.from);
            if (spawnInfo?.msgKey) {
                clearTimeout(spawnInfo.timer);
                this.handler.pokemonSpawnInfo.delete(M.from);
                const caughtCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                    `  🌸✿ᰰ  *${this.client.utils.capitalize(data.name)}*  ✿ᰰ🌸\n` +
                    `      𐚁 ✅ 𝑷𝒐𝒌é𝒎𝒐𝒏 𝑪𝒂𝒖𝒈𝒉𝒕! ✅ 𐚁\n\n` +
                    `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                    `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${data.level}\n` +
                    `  ‧₊˚ 👤 𝑩𝒚      ·❀·  @${M.sender.jid.split('@')[0]}\n\n` +
                    `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                    `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒂𝒖𝒈𝒉𝒕 𖥻ִֶָ`;
                this.client.sendMessage(M.from, {
                    text: caughtCaption,
                    mentions: [M.sender.jid],
                    edit: spawnInfo.msgKey
                }).catch(() => { });
            }
            const p = this.client.config.prefix;
            return void await this.client.sendMessage(M.from, {
                text: Text,
                footer: '⚡ RedzeoX',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party', id: `${p}party` },
                    { text: '📦 My PC', id: `${p}pc` }
                ]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('catch', {
        description: 'Catches the wild Pokémon that just appeared in this group',
        category: 'pokemon',
        usage: 'catch <pokemon_name>',
        cooldown: 25,
        exp: 25,
        aliases: ['c']
    })
], command);
exports.default = command;
