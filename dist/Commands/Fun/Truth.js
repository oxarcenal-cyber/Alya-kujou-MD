"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const truths = [
    'Sabse zyada kise pasand karte ho group mein? 👀',
    'Aaj tak ki sabse badi galti kya thi tumhari?',
    'Sabse bada jhooth kab bola tha?',
    'Crush ka naam batao 👀',
    'Life mein sabse zyada kiska support mila hai?',
    'Koi aisi baat jo bahut kam logo ko pata hai tumhare baare mein?',
    'Aaj tak ki sabse embarrassing moment kya thi?',
    'Kab last time roya/royi the?',
    'Sabse buri aadat kya hai tumhari?',
    'Kab last time kisi se bohat gussa hua/hui tha?',
    'Sabse zyada kiska WhatsApp status check karte ho?',
    'Aaj tak kisi ko block kiya hai? Kyu?',
    'Pehli baar pyaar mein pada/padi tha kab?',
    'Agar time machine milti toh kaunsa moment change karte?',
    'Sabse bura gift kya mila tha kabhi?',
    'Sabse bada fear kya hai tumhara?',
    'Kab last time koi rule toda?',
    'Zindagi mein sabse zyada kya regret hai?',
    'Agar ek din invisible ho sako toh kya karoge?',
    'Kabhi kisi ka secret bataya hai dusre ko?'
];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const question = truths[Math.floor(Math.random() * truths.length)];
            return void M.reply(`🫣 *TRUTH* 🫣\n` +
                `${'─'.repeat(25)}\n\n` +
                `❓ ${question}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}truth\` | \`${prefix}dare\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('truth', {
        description: 'Get a random truth question for Truth or Dare 🫣',
        category: 'fun',
        usage: 'truth',
        aliases: ['sach'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
