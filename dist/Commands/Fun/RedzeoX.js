"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            try {
                const data = await this.client.utils.fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
                if (!data?.text)
                    return void M.reply('❌ Fact nahi mila. Try again!');
                const buffer = await (0, lib_1.buildFactCard)(data.text, this.client.config.persona);
                return void (await M.reply(buffer, 'image'));
            }
            catch (e) {
                this.client.log(`[Fact] Error: ${e.message}`, true);
                return void M.reply('❌ Fact fetch nahi hua. Try again later!');
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('fact', {
        description: 'Sends a random fact as a beautiful image card 💡',
        category: 'fun',
        usage: 'fact',
        aliases: ['randomfact', 'rf'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
