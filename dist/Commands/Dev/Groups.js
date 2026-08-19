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
            const parts = context?.trim().toLowerCase().split(/\s+/);
            const feature = parts?.[0];
            const action = parts?.[1];
            const jid = parts?.[2];
            if (feature && action && jid) {
                const validFeatures = ['wild', 'chara'];
                const validActions = ['on', 'off'];
                if (!validFeatures.includes(feature) || !validActions.includes(action))
                    return void M.reply(`❌ Usage: *${this.client.config.prefix}groups wild off <jid>*`);
                const enable = action === 'on';
                await this.client.DB.group.updateOne({ jid }, { $set: { [feature]: enable } });
                if (feature === 'wild') {
                    if (enable && !this.handler.wild.includes(jid))
                        this.handler.wild.push(jid);
                    else if (!enable)
                        this.handler.wild = this.handler.wild.filter((g) => g !== jid);
                }
                if (feature === 'chara') {
                    if (enable && !this.handler.chara.includes(jid))
                        this.handler.chara.push(jid);
                    else if (!enable)
                        this.handler.chara = this.handler.chara.filter((g) => g !== jid);
                }
                return void M.reply(`✅ *${feature === 'wild' ? 'Pokémon' : 'Character'} spawning* turned *${action.toUpperCase()}* for:\n\`${jid}\``);
            }
            const allGroupMeta = await this.client.groupFetchAllParticipating().catch(() => ({}));
            const dbGroups = await this.client.DB.group.find({ $or: [{ wild: true }, { chara: true }] });
            if (dbGroups.length < 1)
                return void M.reply(`📭 No groups have wild or chara spawning enabled.`);
            const lines = dbGroups.map((g, i) => {
                const meta = allGroupMeta[g.jid];
                const name = meta?.subject ? `*${meta.subject}*` : `Group ${i + 1}`;
                const wildStatus = g.wild ? '🐾 Wild ON' : '🐾 Wild OFF';
                const charaStatus = g.chara ? '🎴 Chara ON' : '🎴 Chara OFF';
                return `${i + 1}. ${name}\n   ${wildStatus} · ${charaStatus}\n   \`${g.jid}\``;
            });
            return void M.reply(`📋 *Active Groups*\n\n${lines.join('\n\n')}\n\n` +
                `💡 *To disable:*\n` +
                `*${this.client.config.prefix}groups wild off <jid>*\n` +
                `*${this.client.config.prefix}groups chara off <jid>*\n` +
                `*${this.client.config.prefix}spawnctl all off* ← pauses ALL instantly`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('groups', {
        description: 'List all groups and their wild/chara status — toggle from here',
        usage: 'groups [wild/chara off <jid>]',
        category: 'dev',
        cooldown: 10,
        exp: 0,
        aliases: ['grouplist']
    })
], default_1);
exports.default = default_1;
