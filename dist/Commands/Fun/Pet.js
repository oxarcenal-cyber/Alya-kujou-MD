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
const bar = (val) => {
    const filled = Math.round(val / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${val}%`;
};
const getMood = (hunger, happiness) => {
    const avg = (hunger + happiness) / 2;
    if (avg >= 80)
        return '😊 Happy!';
    if (avg >= 50)
        return '😐 Okay~';
    if (avg >= 30)
        return '😔 Sad...';
    return '😢 Suffering!';
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const userData = await this.client.DB.getUser(M.sender.jid);
            const pet = userData.pet;
            if (!pet?.active)
                return void M.reply(`🐾 You don't have a pet yet!\n\n` +
                    `📖 *How to adopt:*\n` +
                    `\`${prefix}adopt <name> <cat|dog|fox|rabbit|dragon>\`\n\n` +
                    `_Example: ${prefix}adopt Luna cat_`);
            // Decay hunger/happiness over time (5 points per hour)
            const hoursSinceFed = (Date.now() - pet.lastFed) / 3600000;
            const hoursSincePlayed = (Date.now() - pet.lastPlayed) / 3600000;
            const hunger = Math.max(0, pet.hunger - Math.floor(hoursSinceFed * 5));
            const happiness = Math.max(0, pet.happiness - Math.floor(hoursSincePlayed * 4));
            const emoji = ANIMALS[pet.animal] || '🐾';
            const mood = getMood(hunger, happiness);
            return void M.reply(`${emoji} *${pet.name.toUpperCase()}*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `🐾 *Type:* ${pet.animal} ${emoji}\n` +
                `⭐ *Level:* ${pet.level} (${pet.exp} XP)\n` +
                `💭 *Mood:* ${mood}\n\n` +
                `🍖 *Hunger:*     ${bar(hunger)}\n` +
                `😊 *Happiness:* ${bar(happiness)}\n\n` +
                `⏰ *Last fed:* ${hoursSinceFed < 1 ? 'Just now' : `${Math.floor(hoursSinceFed)}h ago`}\n` +
                `🎮 *Last played:* ${hoursSincePlayed < 1 ? 'Just now' : `${Math.floor(hoursSincePlayed)}h ago`}\n\n` +
                `📖 *Commands:*\n` +
                `\`${prefix}feed\` · \`${prefix}petplay\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('pet', {
        description: 'Check your virtual pet status 🐾',
        aliases: ['mypet', 'petstat', 'petstatus'],
        usage: 'pet',
        cooldown: 5,
        exp: 3,
        category: 'fun'
    })
], default_1);
exports.default = default_1;
