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
        this.execute = async (M, {}) => {
            const start = Date.now();
            const sent = await M.reply('🏓 *Pinging...*');
            const latency = Date.now() - start;
            const bars = this.getLatencyBars(latency);
            const status = latency < 500 ? '🟢 Excellent' : latency < 900 ? '🟡 Good' : '🔴 High';
            return void M.reply(`🏓 *Pong!*\n\n⏱ *Network Latency:* ${latency}ms\n📶 *Status:* ${status}\n${bars}\n\n_Note: This measures WhatsApp delivery time, not bot processing speed._`);
        };
        this.getLatencyBars = (ms) => {
            if (ms < 300)
                return '▰▰▰▰▰ Fast';
            if (ms < 500)
                return '▰▰▰▰▱ Good';
            if (ms < 700)
                return '▰▰▰▱▱ Average';
            if (ms < 1000)
                return '▰▰▱▱▱ Slow';
            return '▰▱▱▱▱ Very Slow';
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('ping', {
        description: 'Check the bot response latency',
        usage: 'ping',
        category: 'moderation',
        exp: 5,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
