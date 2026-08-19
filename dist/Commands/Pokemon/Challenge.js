"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PokemonImages_1 = require("../../lib/PokemonImages");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            if (context?.trim().toLowerCase() === 'info' || context?.trim().toLowerCase() === 'help') {
                return void await this.client.sendMessage(M.from, {
                    text: `📖 *How the Gym Trainer Challenge works*\n\n` +
                        `⚙️ Runs automatically in any group where *${p}wild on* is enabled.\n\n` +
                        `🏟️ Every ~2-3 hours, a Gym Leader appears in the group.\n\n` +
                        `⚔️ *${p}challenge* — Fight it with your strongest party Pokémon.\n` +
                        `Win chance depends on your Pokémon's level vs the Gym Leader's.\n\n` +
                        `🏆 First to win picks ONE reward within 5 minutes:\n` +
                        `　💰 *${p}claim currency*\n` +
                        `　🐾 *${p}claim pokemon*\n` +
                        `　🎖️ *${p}claim badge*\n\n` +
                        `⏳ If nobody wins in 20 minutes, the Gym Leader leaves.`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Get Ready',
                                    rows: [
                                        { title: '🏟️ Gym Status', description: 'See if a Gym Leader is active', id: `${p}gymstatus` },
                                        { title: '🎒 My Party', description: 'Check your Pokémon team', id: `${p}party` },
                                        { title: '🎖️ My Badges', description: 'View earned badges', id: `${p}badges` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            if (M.chat !== 'group')
                return void M.reply('Gym challenges only happen in groups!');
            const gym = this.handler.gymChallenge.get(M.from);
            if (!gym || gym.expiresAt < Date.now()) {
                return void await this.client.sendMessage(M.from, {
                    text: `🌫️ *No Gym Leader here right now.*\n\n` +
                        `Enable *${p}wild on* and wait — a Gym Leader appears roughly every 2-3 hours!\n\n` +
                        `Type *${p}challenge info* for full rules.`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'While Waiting',
                                    rows: [
                                        { title: '🏟️ Gym Status', description: 'Check for active Gym Leader', id: `${p}gymstatus` },
                                        { title: '✨ Evolve Pokémon', description: 'Power up your team', id: `${p}evolve` },
                                        { title: '⚔️ PVP Battle', description: 'Challenge another trainer', id: `${p}pvp` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const { party } = await this.client.DB.getUser(M.sender.jid);
            if (party.length < 1) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *You need at least one Pokémon in your party to battle!*\n\n` +
                        `Catch one first with *${p}catch* when a wild Pokémon appears.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const strongest = [...party].sort((a, b) => b.level - a.level)[0];
            const winChance = Math.min(0.9, Math.max(0.1, strongest.level / (strongest.level + gym.level)));
            const won = Math.random() < winChance;
            if (!won) {
                await (0, PokemonImages_1.replyWithPokemonImage)(M, 'lose', `${gym.type.emoji} Your *${this.client.utils.capitalize(strongest.name)}* (Lv. ${strongest.level}) lost to *${this.client.utils.capitalize(gym.name)}* (Lv. ${gym.level})! 💥\n\nTrain harder and try again!`);
                const LOSE_KEYS = ['lose-1', 'lose-2', 'lose-3', 'lose-4', 'lose-5', 'lose-6', 'lose-7', 'lose-8', 'lose-9', 'lose-10', 'lose-11', 'lose-12'];
                const loseGifBuf = this.client.assets.get(LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]);
                if (loseGifBuf)
                    this.client.utils.gifToMp4(loseGifBuf).then(mp4 => this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4' })).catch(() => { });
                return void await this.client.sendMessage(M.from, {
                    text: `💪 Train your Pokémon and try again!`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Train Harder',
                                    rows: [
                                        { title: '🍬 Rare Candy', description: 'Level up (500 coins)', id: `${p}rarecandy` },
                                        { title: '✨ Evolve', description: 'Evolve a Pokémon', id: `${p}evolve` },
                                        { title: '⚔️ Challenge Again', description: 'Try the Gym Leader again', id: `${p}challenge` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                });
            }
            // ── WIN ───────────────────────────────────────────────────────────────────
            this.handler.gymChallenge.delete(M.from);
            const currency = Math.floor(Math.random() * (2000 - 800 + 1)) + 800;
            const rewardExpiresAt = Date.now() + 5 * 60 * 1000;
            this.handler.gymReward.set(M.sender.jid, {
                groupJid: M.from,
                type: gym.type,
                pokemon: { name: gym.name, id: gym.id, level: gym.level, image: gym.image },
                currency,
                expiresAt: rewardExpiresAt
            });
            await (0, PokemonImages_1.replyWithPokemonImage)(M, 'win', `🎉 *VICTORY!* 🎉\n\n` +
                `Your *${this.client.utils.capitalize(strongest.name)}* (Lv. ${strongest.level}) defeated *${this.client.utils.capitalize(gym.name)}* (Lv. ${gym.level})! ${gym.type.emoji}\n\n` +
                `🏆 *Choose ONE reward — you have 5 minutes!*`);
            const winImg = this.client.assets.get(Math.random() < 0.5 ? 'winner-1' : 'winner-2');
            if (winImg)
                this.client.sendMessage(M.from, { image: winImg, caption: `🏆 *${M.sender.username}* defeated the Gym Leader! 🏆` }).catch(() => { });
            // Claim options as Open Menu button
            return void await this.client.sendMessage(M.from, {
                text: `💰 *${p}claim currency* — ${currency} coins\n` +
                    `🐾 *${p}claim pokemon* — ${this.client.utils.capitalize(gym.name)}\n` +
                    `🎖️ *${p}claim badge* — ${gym.type.badge}`,
                footer: '🎮 Pokémon Hub — 5 min to claim!',
                buttons: [{
                        text: '🏆 Claim Reward',
                        sections: [{
                                title: 'Pick ONE Reward',
                                rows: [
                                    { title: `💰 Claim Currency`, description: `${currency} coins added to wallet`, id: `${p}claim currency` },
                                    { title: `🐾 Claim Pokémon`, description: `Get ${this.client.utils.capitalize(gym.name)}`, id: `${p}claim pokemon` },
                                    { title: `🎖️ Claim Badge`, description: `Earn the ${gym.type.badge}`, id: `${p}claim badge` }
                                ]
                            }]
                    }]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('challenge', {
        description: 'Battle the Gym Leader that appeared in this group',
        usage: 'challenge [info]',
        category: 'pokemon',
        cooldown: 20,
        exp: 15,
        aliases: ['gymchallenge']
    })
], default_1);
exports.default = default_1;
