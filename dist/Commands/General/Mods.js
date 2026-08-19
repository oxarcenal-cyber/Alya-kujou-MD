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
        this.execute = async ({ reply }) => {
            if (!this.client.config.mods.length)
                return void reply('*[UNMODERATED]*');
            let text = `🔖 *${this.client.config.name} Moderators* \n`;
            for (let i = 0; i < this.client.config.mods.length; i++)
                text += `\n*#${i + 1}*\n🥷🏻 *Username:* ${this.client.contact.getContact(this.client.config.mods[i]).username}\n🎐 *Contact: https://wa.me/+${this.client.config.mods[i].split('@')[0]}*`;
            return void (await reply(text));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('mods', {
        description: "Displays the bot's moderators",
        exp: 20,
        cooldown: 5,
        dm: true,
        category: 'general',
        usage: 'mods',
        aliases: ['mod', 'moderators']
    })
], default_1);
exports.default = default_1;
