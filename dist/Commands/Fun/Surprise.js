"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const SmashBoomLines_1 = require("../../lib/SmashBoomLines");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const line = SmashBoomLines_1.SMASHBOOM_LINES[Math.floor(Math.random() * SmashBoomLines_1.SMASHBOOM_LINES.length)];
            const username = M.sender.jid.split('@')[0];
            return void await this.client.sendMessage(M.from, {
                text: `🫢 *Surprise, @${username}!*\n\n💌 ${line}`,
                mentions: [M.sender.jid]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('surprise', {
        description: 'Sends you a random surprise line! 🫢',
        category: 'fun',
        usage: 'surprise',
        aliases: ['sus'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
