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
const PLAY_ACTIONS = [
    'chased their tail around 🌀',
    'did a little dance 💃',
    'jumped through a hoop 🪅',
    'played fetch 🎾',
    'had a little nap together 😴',
    'showed off a new trick 🎪',
    'cuddled up close ❤️',
    'zoomed around the room 💨',
];
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
            const secondsSincePlayed = (Date.now() - pet.lastPlayed) / 1000;
            if (pet.lastPlayed && secondsSincePlayed < 30)
                return void M.reply(`😅 *${pet.name}* is tired from last playtime!\n\n` +
                    `⏳ Can play again in *${Math.ceil(30 - secondsSincePlayed)} sec*`);
            const hoursSincePlayed = secondsSincePlayed / 3600;
            const currentHappiness = Math.max(0, (pet.happiness || 0) - Math.floor(hoursSincePlayed * 4));
            const newHappiness = Math.min(100, currentHappiness + 25);
            const gainedExp = Math.floor(Math.random() * 8) + 3;
            const newExp = (pet.exp || 0) + gainedExp;
            const newLevel = Math.floor(newExp / 100) + 1;
            const action = PLAY_ACTIONS[Math.floor(Math.random() * PLAY_ACTIONS.length)];
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, {
                $set: {
                    'pet.happiness': newHappiness,
                    'pet.lastPlayed': Date.now(),
                    'pet.exp': newExp,
                    'pet.level': newLevel
                }
            });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            const emoji = ANIMALS[pet.animal] || '🐾';
            const leveled = newLevel > (pet.level || 1);
            return void M.reply(`🎮 *PLAYTIME WITH ${pet.name.toUpperCase()}!* ${emoji}\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `${emoji} *${pet.name}* ${action}\n\n` +
                `😊 *Happiness:* ${currentHappiness}% → ${newHappiness}% ✅\n` +
                `✨ *+${gainedExp} EXP gained!*\n` +
                (leveled ? `🎉 *${pet.name} leveled up to Level ${newLevel}!* 🎊\n\n` : `\n`) +
                `⏰ _Next playtime available in 30 sec_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('petplay', {
        description: 'Play with your virtual pet 🎮',
        aliases: ['playpet'],
        usage: 'petplay',
        cooldown: 30,
        exp: 5,
        category: 'fun'
    })
], default_1);
exports.default = default_1;
