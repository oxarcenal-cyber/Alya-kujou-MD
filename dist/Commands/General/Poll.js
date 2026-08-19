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
            const lang = await this.getLang(M);
            if (!context) {
                return void M.reply((0, lib_1.t)('poll_help', lang, { prefix }));
            }
            const quoteMatch = context.match(/^[""](.+?)[""](.*)$/);
            let question;
            let optionsPart;
            if (quoteMatch) {
                question = quoteMatch[1].trim();
                optionsPart = quoteMatch[2].trim();
            }
            else {
                const parts = context.trim().split(/\s+/);
                question = parts[0];
                optionsPart = parts.slice(1).join(' ');
            }
            if (!question) {
                return void M.reply((0, lib_1.t)('poll_no_question', lang, { prefix }));
            }
            const options = optionsPart
                .split(/\s+/)
                .map((o) => o.trim())
                .filter((o) => o.length > 0);
            if (options.length < 2) {
                return void M.reply((0, lib_1.t)('poll_min_options', lang, { prefix }));
            }
            if (options.length > 12) {
                return void M.reply((0, lib_1.t)('poll_max_options', lang, { count: String(options.length) }));
            }
            try {
                await this.client.sendMessage(M.from, {
                    poll: {
                        name: question,
                        values: options,
                        selectableCount: 1
                    }
                });
            }
            catch (err) {
                return void M.reply((0, lib_1.t)('poll_error', lang));
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('poll', {
        description: 'Create a native WhatsApp poll in the group',
        usage: 'poll "Question?" Option1 Option2 Option3 ...',
        cooldown: 10,
        exp: 10,
        category: 'general',
        aliases: ['vote']
    })
], default_1);
exports.default = default_1;
