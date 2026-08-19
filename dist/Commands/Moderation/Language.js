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
            const currentLang = await this.getLang(M);
            if (M.chat !== 'group' || !M.groupMetadata)
                return void M.reply((0, lib_1.t)('lang_group_only', currentLang, { p: prefix }));
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!M.sender.isAdmin && !isMod)
                return void M.reply((0, lib_1.t)('lang_no_perm', currentLang, { p: prefix }));
            const input = context.trim().toLowerCase();
            // No input → current status + usage
            if (!input) {
                return void M.reply((0, lib_1.t)('lang_status', currentLang, {
                    p: prefix,
                    line: '─'.repeat(28),
                    current: (0, lib_1.langName)(currentLang)
                }));
            }
            if (input !== 'en' && input !== 'hi')
                return void M.reply((0, lib_1.t)('lang_invalid', currentLang, { p: prefix }));
            const newLang = input;
            if (newLang === currentLang)
                return void M.reply((0, lib_1.t)('lang_already', newLang, { lang: (0, lib_1.langName)(newLang) }));
            await this.client.DB.updateGroup(M.from, 'language', newLang);
            return void M.reply((0, lib_1.t)(newLang === 'hi' ? 'lang_changed_hi' : 'lang_changed_en', newLang, { p: prefix }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('lang', {
        description: 'Change the bot language for this group 🌐 (English / Hindi)',
        category: 'moderation',
        usage: 'lang en | lang hi | lang',
        aliases: ['language', 'bhasha'],
        exp: 10,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
