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
            const target = parts?.[0];
            const action = parts?.[1];
            const targets = ['pokemon', 'cards', 'all'];
            const actions = ['on', 'off'];
            if (!target || !targets.includes(target) || !action || !actions.includes(action))
                return void M.reply(`📖 *Spawn Control*\n\n` +
                    `*${this.client.config.prefix}spawnctl pokemon off* — Stop Pokémon spawning in all groups\n` +
                    `*${this.client.config.prefix}spawnctl cards off* — Stop Card spawning in all groups\n` +
                    `*${this.client.config.prefix}spawnctl all off* — Stop both\n\n` +
                    `*${this.client.config.prefix}spawnctl pokemon on* — Resume Pokémon spawning\n` +
                    `*${this.client.config.prefix}spawnctl cards on* — Resume Card spawning\n` +
                    `*${this.client.config.prefix}spawnctl all on* — Resume both\n\n` +
                    `⚠️ This is temporary — restarting the bot resets everything to ON.`);
            const pause = action === 'off';
            if (target === 'pokemon' || target === 'all')
                this.handler.wildPaused = pause;
            if (target === 'cards' || target === 'all')
                this.handler.cardsPaused = pause;
            const status = pause ? '🔴 *PAUSED*' : '🟢 *RESUMED*';
            const lines = [];
            if (target === 'pokemon' || target === 'all')
                lines.push(`🐾 Pokémon spawning → ${status}`);
            if (target === 'cards' || target === 'all')
                lines.push(`🃏 Card spawning → ${status}`);
            return void M.reply(`⚙️ *Spawn Control Updated*\n\n${lines.join('\n')}`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('spawnctl', {
        description: 'Pause or resume Pokemon and Card spawning globally',
        usage: 'spawnctl <pokemon/cards/all> <on/off>',
        category: 'dev',
        cooldown: 5,
        exp: 0,
        aliases: ['spawncontrol']
    })
], default_1);
exports.default = default_1;
