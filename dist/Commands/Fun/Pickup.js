"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const pickupLines = [
    'Are you a magician? Because whenever I look at you, everyone else disappears.',
    "Do you have a map? I keep getting lost in your eyes.",
    "Are you a parking ticket? Because you've got 'fine' written all over you.",
    'Is your name Google? Because you have everything I have been searching for.',
    'Are you a bank loan? Because you have my interest.',
    'Do you believe in love at first sight, or should I walk by again?',
    'Are you made of copper and tellurium? Because you are CuTe.',
    'Are you a time traveler? Because I see you in my future.',
    'I must be a snowflake, because I have fallen for you.',
    'Are you a star? Because your beauty lights up the universe.',
    'If you were a vegetable, you would be a cute-cumber.',
    'Are you Australian? Because you meet all of my koala-fications.',
    'Do you have a Band-Aid? Because I just scraped my knee falling for you.',
    'I was wondering if you had an extra heart… because mine was just stolen.',
    'My doctor told me I am lacking Vitamin U.',
    'Are you a keyboard? Because you are just my type.',
    'Are you a camera? Because every time I look at you, I smile.',
    'If beauty were time, you would be an eternity.',
    'Are you a library? Because I am checking you out.',
    'Do you have a pencil? Because I want to erase your past and write our future.'
];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const line = pickupLines[Math.floor(Math.random() * pickupLines.length)];
            return void M.reply(`😏 *PICKUP LINE* 😏\n` +
                `${'─'.repeat(25)}\n\n` +
                `💘 ${line}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}pickup\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('pickup', {
        description: 'Get a random pickup line 😏',
        category: 'fun',
        usage: 'pickup',
        aliases: ['pickupline', 'flirt'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
