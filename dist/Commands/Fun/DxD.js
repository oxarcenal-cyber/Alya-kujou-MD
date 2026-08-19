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
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const query = context.trim();
            if (query.toLowerCase() === 'list')
                return void M.reply(`🐉 *HIGH SCHOOL DxD — CHARACTERS*\n${'─'.repeat(25)}\n\n` +
                    lib_1.DXD_CHARACTERS.map((c) => `• ${c.name}`).join('\n') +
                    `\n\n📢 *How to use:* \`${prefix}dxd Rias\` ya \`${prefix}dxd\` (random)`);
            const result = (0, lib_1.getDxDLine)(query);
            if (!result)
                return void M.reply(`❌ *Ye character nahi mila!*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}dxd\` → random character\n` +
                    `  \`${prefix}dxd Rias\` → specific character\n` +
                    `  \`${prefix}dxd list\` → sabhi characters dekho`);
            return void M.reply(`🐉 *${result.character}:*\n"${result.line}"`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('dxd', {
        description: 'High School DxD character se ek dialogue lo 🐉',
        category: 'fun',
        usage: 'dxd [character name]',
        aliases: ['dxdquote'],
        exp: 10,
        cooldown: 3,
        dm: true
    })
], default_1);
exports.default = default_1;
