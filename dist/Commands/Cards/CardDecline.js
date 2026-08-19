"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let CardDeclineCommand = class CardDeclineCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            return void await this.client.sendMessage(M.from, {
                text: `❌ *Decline a Challenge?*\n\n` +
                    `Tap the button below — or type \`${prefix}cardbattle decline\``,
                footer: 'You must have a pending challenge to decline.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '❌ Decline Challenge', id: `${prefix}cardbattle decline` }
                ]
            }, { quoted: M.message });
        };
    }
};
CardDeclineCommand = __decorate([
    (0, Structures_1.Command)('carddecline', {
        description: 'Decline a pending card battle challenge',
        usage: 'carddecline',
        category: 'cards',
        aliases: ['cbdecline'],
        cooldown: 0, exp: 0, dm: false
    })
], CardDeclineCommand);
exports.default = CardDeclineCommand;
