"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const ANIMALS = {
    cat: '🐱', dog: '🐶', fox: '🦊', rabbit: '🐰', dragon: '🐲'
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const userData = await this.client.DB.getUser(M.sender.jid);
            const pet = userData.pet;
            if (!pet?.active)
                return void M.reply(`🐾 You don't have a pet!\n` +
                    `Use \`${prefix}adopt <name> <type>\` to get one.`);
            const hoursSinceFed = (Date.now() - pet.lastFed) / 3600000;
            if (hoursSinceFed < 1)
                return void M.reply(`🍖 *${pet.name}* is not hungry yet!\n\n` +
                    `⏳ Can feed again in *${Math.ceil(60 - hoursSinceFed * 60)} min*`);
            const currentHunger = Math.max(0, pet.hunger - Math.floor(hoursSinceFed * 5));
            const newHunger = Math.min(100, currentHunger + 30);
            const gainedExp = Math.floor(Math.random() * 10) + 5;
            const newExp = (pet.exp || 0) + gainedExp;
            const newLevel = Math.floor(newExp / 100) + 1;
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, {
                $set: {
                    'pet.hunger': newHunger,
                    'pet.lastFed': Date.now(),
                    'pet.exp': newExp,
                    'pet.level': newLevel
                }
            });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            const emoji = ANIMALS[pet.animal] || '🐾';
            const leveled = newLevel > pet.level;
            return void M.reply(`🍖 *FED ${pet.name.toUpperCase()}!* ${emoji}\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `😋 *${pet.name}* munched happily!\n\n` +
                `❤️ *Hunger:* ${currentHunger}% → ${newHunger}% ✅\n` +
                `✨ *+${gainedExp} EXP gained!*\n` +
                (leveled ? `🎉 *${pet.name} leveled up to Level ${newLevel}!* 🎊\n\n` : `\n`) +
                `⏰ _Next feeding available in 1 hour_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('feed', {
        description: 'Feed your virtual pet 🍖',
        aliases: ['feedpet'],
        usage: 'feed',
        cooldown: 3600,
        exp: 5,
        category: 'fun'
    })
], default_1);
exports.default = default_1;
