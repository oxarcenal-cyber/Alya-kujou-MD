"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const reward = this.handler.gymReward.get(M.sender.jid);
            if (!reward || reward.expiresAt < Date.now()) {
                this.handler.gymReward.delete(M.sender.jid);
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *No pending reward to claim.*\n\n` +
                        `Win a gym challenge first with *${p}challenge*!`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Earn a Reward',
                                    rows: [
                                        { title: '🏟️ Gym Status', description: 'See if a Gym Leader is active', id: `${p}gymstatus` },
                                        { title: '⚔️ Challenge Gym', description: 'Battle the Gym Leader', id: `${p}challenge` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const option = context?.trim().toLowerCase().split(' ')[0];
            const valid = ['currency', 'pokemon', 'badge'];
            // ── No option: show claim menu ────────────────────────────────────────
            if (!option || !valid.includes(option)) {
                return void await this.client.sendMessage(M.from, {
                    text: `🏆 *Claim Your Gym Reward!*\n\n` +
                        `Choose ONE reward below:\n\n` +
                        `💰 *${p}claim currency* — ${reward.currency} coins\n` +
                        `🐾 *${p}claim pokemon* — ${this.client.utils.capitalize(reward.pokemon.name)}\n` +
                        `🎖️ *${p}claim badge* — ${reward.type.badge}`,
                    footer: '⏳ 5 minutes to claim!',
                    buttons: [{
                            text: '🏆 Claim Reward',
                            sections: [{
                                    title: 'Pick ONE Reward',
                                    rows: [
                                        { title: `💰 Claim Currency`, description: `${reward.currency} coins`, id: `${p}claim currency` },
                                        { title: `🐾 Claim Pokémon`, description: `Get ${this.client.utils.capitalize(reward.pokemon.name)}`, id: `${p}claim pokemon` },
                                        { title: `🎖️ Claim Badge`, description: `Earn the ${reward.type.badge}`, id: `${p}claim badge` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            this.handler.gymReward.delete(M.sender.jid);
            const logHistory = async (rewardLabel) => {
                const { gymHistory } = await this.client.DB.getGroup(reward.groupJid);
                const entry = {
                    winner: M.sender.username || M.sender.jid.split('@')[0],
                    pokemon: reward.pokemon.name,
                    type: reward.type.type,
                    reward: rewardLabel,
                    date: Date.now()
                };
                const updated = [entry, ...(gymHistory || [])].slice(0, 10);
                await this.client.DB.group.updateOne({ jid: reward.groupJid }, { $set: { gymHistory: updated } });
            };
            // ── Currency ──────────────────────────────────────────────────────────
            if (option === 'currency') {
                await this.client.DB.setCrystal(M.sender.jid, reward.currency);
                await logHistory(`${reward.currency} coins`);
                return void await this.client.sendMessage(M.from, {
                    text: `💰 *${reward.currency} coins* added to your wallet! Well earned, champ! 🏆`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            // ── Pokémon ───────────────────────────────────────────────────────────
            if (option === 'pokemon') {
                const { party, pc } = await this.client.DB.getUser(M.sender.jid);
                const pokemon = { name: reward.pokemon.name, image: reward.pokemon.image, id: reward.pokemon.id, level: reward.pokemon.level, rarity: 'legendary' };
                party.length >= 6 ? pc.push(pokemon) : party.push(pokemon);
                await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party, pc } });
                await logHistory(this.client.utils.capitalize(reward.pokemon.name));
                return void await this.client.sendMessage(M.from, {
                    text: `🐾 *${this.client.utils.capitalize(reward.pokemon.name)}* (Lv. ${reward.pokemon.level}) joins your team! ⭐ *Legendary*\n` +
                        `${party.length >= 6 ? '📦 Sent to PC — party was full.' : '🎒 Added to your party!'}`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            // ── Badge ─────────────────────────────────────────────────────────────
            const { badges } = await this.client.DB.getUser(M.sender.jid);
            if (!badges.includes(reward.type.badge)) {
                await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { badges: [...badges, reward.type.badge] } });
            }
            await logHistory(reward.type.badge);
            return void await this.client.sendMessage(M.from, {
                text: `🎖️ You earned the *${reward.type.badge}* ${reward.type.emoji}! Check your collection with *${p}badges*.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎖️ My Badges', id: `${p}badges` },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('claimreward', {
        description: 'Claim your Gym Challenge victory reward',
        usage: 'claimreward <currency/pokemon/badge>',
        category: 'pokemon',
        cooldown: 5,
        exp: 0,
        aliases: ['claim']
    })
], default_1);
exports.default = default_1;
