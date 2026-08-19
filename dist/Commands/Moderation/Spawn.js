"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let SpawnCommand = class SpawnCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            // Group only
            if (M.chat !== 'group')
                return void M.reply((0, lib_1.t)('spawn_group_only', lang));
            // Admin / mod only
            const isMod = this.client.config.mods.some(m => this.client.correctJid(m) === this.client.correctJid(M.sender.jid));
            if (!M.sender.isAdmin && !isMod)
                return void M.reply((0, lib_1.t)('spawn_admin_only', lang));
            const parts = context.trim().toLowerCase().split(/\s+/);
            const feature = parts[0]; // cards | wild | all | status
            const action = parts[1]; // on | off
            // ── Status ──────────────────────────────────────────────────────────
            if (!feature || feature === 'status') {
                const data = await this.client.DB.getGroup(M.from);
                const cardsOn = data.chara;
                const wildOn = data.wild;
                return void M.reply((0, lib_1.t)('spawn_status', lang, {
                    chara: cardsOn ? '🟢 ON' : '🔴 OFF',
                    wild: wildOn ? '🟢 ON' : '🔴 OFF'
                }));
            }
            const validFeatures = ['cards', 'wild', 'all'];
            const validActions = ['on', 'off'];
            if (!validFeatures.includes(feature) || !validActions.includes(action))
                return void M.reply((0, lib_1.t)('spawn_usage', lang, { p: prefix }));
            const enable = action === 'on';
            const data = await this.client.DB.getGroup(M.from);
            // ── Cards ────────────────────────────────────────────────────────────
            if (feature === 'cards' || feature === 'all') {
                if (feature === 'cards' && data.chara === enable) {
                    return void M.reply((0, lib_1.t)('spawn_already', lang, {
                        feature: 'Card',
                        state: enable ? 'ON' : 'OFF'
                    }));
                }
                await this.client.DB.updateGroup(M.from, 'chara', enable);
                if (enable && !this.handler.chara.includes(M.from))
                    this.handler.chara.push(M.from);
                else if (!enable)
                    this.handler.chara = this.handler.chara.filter(g => g !== M.from);
            }
            // ── Wild ─────────────────────────────────────────────────────────────
            if (feature === 'wild' || feature === 'all') {
                if (feature === 'wild' && data.wild === enable) {
                    return void M.reply((0, lib_1.t)('spawn_already', lang, {
                        feature: 'Pokémon',
                        state: enable ? 'ON' : 'OFF'
                    }));
                }
                await this.client.DB.updateGroup(M.from, 'wild', enable);
                if (enable && !this.handler.wild.includes(M.from))
                    this.handler.wild.push(M.from);
                else if (!enable)
                    this.handler.wild = this.handler.wild.filter(g => g !== M.from);
            }
            // ── Reply ────────────────────────────────────────────────────────────
            let key = '';
            if (feature === 'cards')
                key = enable ? 'spawn_chara_on' : 'spawn_chara_off';
            else if (feature === 'wild')
                key = enable ? 'spawn_wild_on' : 'spawn_wild_off';
            else
                key = enable ? 'spawn_all_on' : 'spawn_all_off';
            return void M.reply((0, lib_1.t)(key, lang));
        };
    }
};
SpawnCommand = __decorate([
    (0, Structures_1.Command)('spawn', {
        description: 'Enable or disable Card / Pokémon spawning for this group',
        usage: 'spawn cards on/off | spawn wild on/off | spawn all on/off | spawn status',
        category: 'moderation',
        aliases: ['spawnset', 'spawntoggle'],
        cooldown: 5,
        exp: 0
    })
], SpawnCommand);
exports.default = SpawnCommand;
