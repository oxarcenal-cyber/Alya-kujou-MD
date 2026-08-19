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
            const action = context?.trim().toLowerCase();
            await M.reply('⏳ Fetching group data...');
            // Groups bot is currently a member of (live from WA)
            const activeGroupMeta = await this.client.groupFetchAllParticipating().catch(() => ({}));
            const activeJids = new Set(Object.keys(activeGroupMeta));
            // All groups stored in DB
            const dbGroups = await this.client.DB.group.find({});
            const stale = dbGroups.filter((g) => !activeJids.has(g.jid));
            const active = dbGroups.filter((g) => activeJids.has(g.jid));
            if (action === 'purge') {
                if (stale.length === 0)
                    return void M.reply(`✅ *No stale groups found!* DB is already clean.\n\n📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}*`);
                const staleJids = stale.map((g) => g.jid);
                await this.client.DB.group.deleteMany({ jid: { $in: staleJids } });
                // Clear cache for deleted groups
                for (const jid of staleJids) {
                    this.client.DB.cacheInvalidate(`group:${jid}`);
                }
                return void M.reply(`🗑️ *Purge complete!*\n\n` +
                    `❌ Deleted: *${stale.length}* stale group(s)\n` +
                    `✅ Remaining: *${active.length}* active group(s)\n\n` +
                    `${stale.map((g, i) => `${i + 1}. \`${g.jid}\``).join('\n')}`);
            }
            // Default: just show status
            if (stale.length === 0) {
                return void M.reply(`✅ *DB is clean!* All stored groups are active.\n\n` +
                    `📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}*`);
            }
            const staleLines = stale.map((g, i) => {
                const flags = [];
                if (g.wild)
                    flags.push('🐾Wild');
                if (g.chara)
                    flags.push('🎴Chara');
                if (g.newsEnabled)
                    flags.push('📰News');
                if (g.welcome)
                    flags.push('👋Welcome');
                const flagStr = flags.length ? ` [${flags.join(' ')}]` : '';
                return `${i + 1}. \`${g.jid}\`${flagStr}`;
            });
            const activeLines = active.map((g, i) => {
                const meta = activeGroupMeta[g.jid];
                return `${i + 1}. *${meta?.subject ?? 'Unknown'}*\n   \`${g.jid}\``;
            });
            return void M.reply(`📋 *Group DB Report*\n\n` +
                `📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}* · Stale: *${stale.length}*\n\n` +
                `✅ *Active Groups (bot is member):*\n${activeLines.join('\n')}\n\n` +
                `🗑️ *Stale Groups (bot not a member):*\n${staleLines.join('\n')}\n\n` +
                `💡 To delete stale groups:\n*${this.client.config.prefix}groupclean purge*`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('groupclean', {
        description: 'Show stale groups in DB (bot not a member) and purge them',
        usage: 'groupclean [purge]',
        category: 'dev',
        cooldown: 10,
        exp: 0,
        aliases: ['gcclean', 'cleangroups']
    })
], default_1);
exports.default = default_1;
