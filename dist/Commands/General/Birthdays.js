"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (M.chat !== 'group')
                return void M.reply(`🎂 This command only works in groups!`);
            const meta = M.groupMetadata;
            if (!meta)
                return void M.reply(`❌ Could not fetch group info.`);
            const memberJids = meta.participants.map(p => p.id);
            const users = await this.client.DB.user.find({
                jid: { $in: memberJids },
                birthday: { $gt: 0 }
            }).lean();
            if (users.length === 0)
                return void M.reply(`🎂 *GROUP BIRTHDAYS*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `😔 No birthdays set in this group yet!\n\n` +
                    `_Ask members to set theirs:_\n` +
                    `\`${prefix}setbirthday DD/MM\``);
            const today = new Date();
            const todayDDMM = today.getDate() * 100 + (today.getMonth() + 1);
            // Sort by upcoming: wrap around year
            const sorted = users.sort((a, b) => {
                const aBd = a.birthday;
                const bBd = b.birthday;
                const aDiff = aBd >= todayDDMM ? aBd - todayDDMM : aBd + 1231 - todayDDMM;
                const bDiff = bBd >= todayDDMM ? bBd - todayDDMM : bBd + 1231 - todayDDMM;
                return aDiff - bDiff;
            });
            let text = `🎂 *GROUP BIRTHDAYS*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;
            for (const user of sorted) {
                const bd = user.birthday;
                const day = Math.floor(bd / 100);
                const month = bd % 100;
                const isToday = bd === todayDDMM;
                const phone = user.jid.split('@')[0];
                text += `${isToday ? '🎉' : '📅'} *@${phone}* — ${day} ${MONTHS[month - 1]}${isToday ? ' ← *TODAY!* 🎂' : ''}\n`;
            }
            text += `\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `_Set yours: \`${prefix}setbirthday DD/MM\`_`;
            return void M.reply(text, 'text', undefined, undefined, undefined, sorted.map(u => u.jid));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('birthdays', {
        description: 'See upcoming birthdays in this group 🎂',
        aliases: ['bdays', 'upcomingbirthdays'],
        usage: 'birthdays',
        cooldown: 10,
        exp: 3,
        category: 'general',
        dm: false
    })
], default_1);
exports.default = default_1;
