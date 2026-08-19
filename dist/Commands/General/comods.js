"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async ({ reply }) => {
            const groups = await this.client.DB.group.find({});
            const users = await this.client.DB.user.find({});
            const pad = (s) => (s < 10 ? '0' : '') + s;
            const formatTime = (seconds) => {
                const hours = Math.floor(seconds / (60 * 60));
                const minutes = Math.floor((seconds % (60 * 60)) / 60);
                const secs = Math.floor(seconds % 60);
                return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
            };
            const uptime = formatTime(process.uptime());
            return void (await reply(`*━━━❰ CO-MODS ❱━━━*\n\n👑 *MANAGED BY* = RedzeoX\n\n🔗 *GITHUB* = github.com/REDZEOX\n\n*━━━━━━━━━━━━━━━━━━━━━━*`));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('co-mods', {
        description: "Displays the bot's info",
        usage: 'cmods',
        category: 'general',
        exp: 10
    })
], command);
exports.default = command;
