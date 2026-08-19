"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const { bot } = await this.client.DB.getGroup(M.from);
            const options = ['all', 'everyone', 'bots'];
            let Bot;
            if (!context || options.includes(context.trim().toLowerCase().split(' ')[0].trim()))
                Bot = 'all';
            else
                Bot = context.trim().split(' ')[0].trim();
            const name = this.client.config.name.split(' ')[0];
            if (Bot === bot)
                return void M.reply(`🟨 ${Bot === 'all' ? '*Everyone* is' : Bot === name ? 'I am' : `*${Bot}* is`} already active`);
            await this.client.DB.updateGroup(M.from, 'bot', Bot);
            return void M.reply(`🟩 ${Bot === name ? 'I am' : Bot === 'all' ? '*Everyone* is' : `*${Bot}* is`} now active`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('switch', {
        description: 'Switch who the bot responds to in a group (all/bots/specific user)',
        usage: 'switch <all | bots | username>',
        cooldown: 10,
        exp: 10,
        category: 'dev'
    })
], command);
exports.default = command;
