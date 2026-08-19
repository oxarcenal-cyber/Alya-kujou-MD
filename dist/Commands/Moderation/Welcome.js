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
            const prefix = this.client.config.prefix;
            const data = await this.client.DB.getGroup(M.from);
            const current = data.welcome;
            if (!context) {
                const status = current ? '🟢 *ON*' : '🔴 *OFF*';
                return void M.reply(`┌───□ *WELCOME FEATURE* □\n` +
                    `├◇ 📌 *Status:* ${status}\n` +
                    `├◇ 👥 *Group:* ${M.from}\n` +
                    `└${'─'.repeat(18)}□\n\n` +
                    `💡 *Usage:*\n` +
                    `  \`${prefix}welcome on\` → Enable\n` +
                    `  \`${prefix}welcome off\` → Disable\n\n` +
                    `📝 _Jab koi join ya leave karega toh bot message bhejega_`);
            }
            const input = context.trim().toLowerCase();
            if (input !== 'on' && input !== 'off') {
                return void M.reply(`❌ Invalid option!\n\n` +
                    `Use:\n` +
                    `  \`${prefix}welcome on\` → Enable\n` +
                    `  \`${prefix}welcome off\` → Disable`);
            }
            const newValue = input === 'on';
            if (newValue === current) {
                return void M.reply(`🟨 Welcome feature is already *${input.toUpperCase()}* in this group!`);
            }
            await this.client.DB.updateGroup(M.from, 'welcome', newValue);
            return void M.reply(newValue
                ? `🟢 *Welcome feature ON!*\n\n` +
                    `Ab jab koi group join karega → Welcome message aayega 🎉\n` +
                    `Jab koi leave karega → Farewell message aayega 👋\n\n` +
                    `_Disable karne ke liye:_ \`${prefix}welcome off\``
                : `🔴 *Welcome feature OFF!*\n\n` +
                    `Ab join/leave par koi message nahi aayega.\n\n` +
                    `_Enable karne ke liye:_ \`${prefix}welcome on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('welcome', {
        description: 'Enable or disable welcome/farewell messages for this group',
        usage: 'welcome on || welcome off || welcome',
        cooldown: 5,
        category: 'moderation',
        exp: 20,
        aliases: ['wlcm']
    })
], default_1);
exports.default = default_1;
