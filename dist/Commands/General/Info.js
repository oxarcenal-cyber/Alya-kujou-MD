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
            return void (await reply(`*━━━❰ CELESTIC ❱━━━*\n\n🔗 *Commands:* ${Array.from(this.handler.commands, ([command, data]) => ({
                command,
                data
            })).length}\n\n💰 *Groups:* ${groups.length}\n\n🎐 *Users:* ${users.length}\n\n🚦 *Uptime:* ${uptime.
                length}\n\n♨️ *sessions:* 26\n\n🟣 *mods:* 7\n\n💎 *disable comamnds:* 0\n\n🔢 *banned users:* 0\n\n🔑 *Co-mods:* 3\n\n📛 *version:* 9\n\nuse support commands to reach our groups`));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('info', {
        description: "Displays the bot's info",
        usage: 'info',
        category: 'general',
        exp: 10
    })
], command);
exports.default = command;
