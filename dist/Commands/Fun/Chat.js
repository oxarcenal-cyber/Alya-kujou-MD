"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const config_1 = __importDefault(require("../../config"));
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const text = context.trim();
            const lang = await this.getLang(M);
            if (!(config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY))
                return void M.reply((0, lib_1.t)('fun_chat_not_configured', lang));
            // Group mein chatbot enabled hai ya nahi check karo
            if (M.chat === 'group') {
                const data = await this.client.DB.getGroup(M.from);
                const enabled = data.groupChatbot;
                if (!enabled)
                    return void M.reply((0, lib_1.t)('fun_chat_disabled_group', lang, { prefix }));
            }
            if (!text)
                return void M.reply((0, lib_1.t)('fun_chat_prompt', lang, { prefix }));
            try {
                const reply = await (0, lib_1.askRias)(text, M.sender.jid);
                return void M.reply(reply ? lib_1.Rias.chatReply(reply) : lib_1.Rias.chatFallback());
            }
            catch {
                return void M.reply(lib_1.Rias.chatFallback());
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('chat', {
        description: 'Chat with Rias 🤖',
        category: 'fun',
        usage: 'chat <message>',
        aliases: ['bot'],
        exp: 15,
        cooldown: 3,
        dm: true
    })
], default_1);
exports.default = default_1;
