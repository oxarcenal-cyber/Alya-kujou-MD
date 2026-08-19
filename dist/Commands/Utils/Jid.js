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
        this.execute = async (M) => {
            const lines = [];
            if (M.chat === 'group') {
                const meta = M.groupMetadata;
                lines.push(`🏠 *Group:* ${meta?.subject ?? 'Unknown'}`);
                lines.push(`📋 *Group JID:*\n\`${M.from}\``);
                lines.push(``);
            }
            lines.push(`👤 *Your JID:*\n\`${M.sender.jid}\``);
            lines.push(``);
            lines.push(`💡 Use group JID with:\n*${this.client.config.prefix}groups wild off <jid>*\n*${this.client.config.prefix}groups chara off <jid>*`);
            return void M.reply(lines.join('\n'));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('jid', {
        description: 'Shows the JID (ID) of the current group and your own JID',
        usage: 'jid',
        category: 'utils',
        cooldown: 5,
        exp: 0,
        aliases: ['getjid', 'id']
    })
], default_1);
exports.default = default_1;
