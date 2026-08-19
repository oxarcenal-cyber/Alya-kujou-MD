"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const TeamRocket_1 = require("../../lib/TeamRocket");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, {}) => {
            const p = this.client.config.prefix;
            if (M.chat !== 'group')
                return void M.reply(`⚔️ *Team Rocket raids only happen in groups!*`);
            const raid = this.handler.rocketRaids.get(M.from);
            if (!raid) {
                return void await this.client.sendMessage(M.from, {
                    text: `😌 *No active Team Rocket raid here!*\n\n` +
                        `Team Rocket appears randomly in groups that have Pokémon spawning enabled.\n` +
                        `Stay alert — they strike when you least expect it! 🚀`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            if (raid.fighters.has(M.sender.jid))
                return void await this.client.sendMessage(M.from, {
                    text: `⚔️ *You already fought in this raid!*\n\n` +
                        `🙌 Wait for others to join!\n` +
                        `💥 Current damage: *${raid.totalDamage}/${raid.requiredDamage}*`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            // Damage based on strongest Pokémon level × random multiplier
            const user = await this.client.DB.getUser(M.sender.jid);
            const allPokemon = [...user.party, ...user.pc];
            const maxLevel = allPokemon.length > 0
                ? Math.max(...allPokemon.map((p) => p.level || 10))
                : 10;
            const damage = Math.floor(maxLevel * (Math.random() * 1.5 + 0.8));
            raid.fighters.set(M.sender.jid, damage);
            raid.totalDamage += damage;
            const remaining = Math.max(0, raid.requiredDamage - raid.totalDamage);
            const progress = (0, TeamRocket_1.getRaidProgressBar)(raid.totalDamage, raid.requiredDamage);
            // ── VICTORY ───────────────────────────────────────────────────────────────
            if (raid.totalDamage >= raid.requiredDamage) {
                if (raid.timer)
                    clearTimeout(raid.timer);
                this.handler.rocketRaids.delete(M.from);
                // Return Pokémon to victim
                try {
                    const victim = await this.client.DB.getUser(raid.victimJid);
                    victim.party.length < 6 ? victim.party.push(raid.stolenPokemon) : victim.pc.push(raid.stolenPokemon);
                    await this.client.DB.user.updateOne({ jid: raid.victimJid }, { $set: { party: victim.party, pc: victim.pc } });
                    this.client.DB.cacheInvalidate(`user:${raid.victimJid}`);
                }
                catch { }
                // Reward all fighters
                const fighterJids = [...raid.fighters.keys()];
                await Promise.allSettled(fighterJids.map((jid) => this.client.DB.setCrystal(jid, 50).catch(() => { })));
                // Edit original raid message
                if (raid.spawnMsgKey) {
                    this.client.sendMessage(M.from, {
                        text: `🚀 *TEAM ROCKET RETREATS!* 🚀\n\n` +
                            `${raid.rocketMember.emoji} *${raid.rocketMember.name}:* ${raid.rocketMember.retreat}\n\n` +
                            `✅ *${this.client.utils.capitalize(raid.stolenPokemon.name)}* has been rescued!\n` +
                            `🔴 *Status: Raid Defeated!*`,
                        edit: raid.spawnMsgKey,
                        mentions: [raid.victimJid]
                    }).catch(() => { });
                }
                const fighterLines = [...raid.fighters.entries()]
                    .map(([jid, dmg]) => `  • @${jid.split('@')[0]} — ⚔️ ${dmg} dmg`)
                    .join('\n');
                const victoryCaption = `🎊 *RAID VICTORY!* 🎊\n\n` +
                    `💥 The group defeated *${raid.rocketMember.name}*!\n` +
                    `🐾 *${this.client.utils.capitalize(raid.stolenPokemon.name)}* returned to @${raid.victimJid.split('@')[0]}!\n\n` +
                    `💎 Every fighter earned *+50 Crystals!*\n\n` +
                    `⚔️ *Battle Log (${raid.fighters.size} fighters):*\n` +
                    fighterLines;
                const rocketDefeatImg = this.client.assets.get('rocket-raid-defeat');
                rocketDefeatImg
                    ? await this.client.sendMessage(M.from, {
                        image: rocketDefeatImg,
                        caption: victoryCaption,
                        mentions: [raid.victimJid, ...fighterJids]
                    })
                    : await this.client.sendMessage(M.from, {
                        text: victoryCaption,
                        mentions: [raid.victimJid, ...fighterJids]
                    });
                return void await this.client.sendMessage(M.from, {
                    text: `Great teamwork, trainers! 💪`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'After the Raid',
                                    rows: [
                                        { title: '🎒 My Party', description: 'View your Pokémon team', id: `${p}party` },
                                        { title: '⚔️ PVP Battle', description: 'Challenge another trainer', id: `${p}pvp` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                });
            }
            // ── STILL ONGOING ─────────────────────────────────────────────────────────
            const timeLeft = Math.max(0, Math.round((raid.expiresAt - Date.now()) / 1000 / 60));
            return void this.client.sendMessage(M.from, {
                text: `⚔️ *@${M.sender.jid.split('@')[0]}* attacked and dealt *${damage} damage!*\n\n` +
                    `${progress}\n` +
                    `💥 *Damage:* ${raid.totalDamage}/${raid.requiredDamage}\n` +
                    `⚠️ *Need ${remaining} more damage!*\n` +
                    `⏳ *${timeLeft} min left*\n\n` +
                    `👊 Type *${p}fight* to join the battle!`,
                mentions: [M.sender.jid]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('fight', {
        description: 'Fight Team Rocket during an active raid to rescue the stolen Pokémon',
        usage: 'fight',
        category: 'pokemon',
        cooldown: 0,
        exp: 15,
        aliases: ['attack', 'f']
    })
], default_1);
exports.default = default_1;
