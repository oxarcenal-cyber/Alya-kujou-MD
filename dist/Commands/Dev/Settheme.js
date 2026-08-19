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
const VALID_PERSONAS = ['rias', 'alya', 'akino', 'hinata', 'zerotwo', 'miku'];
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const choice = context.trim().toLowerCase().split(' ')[0];
            if (!choice)
                return void M.reply((0, lib_1.t)('settheme_current', lang, {
                    theme: (0, lib_1.getPersonaName)(this.client.config.persona),
                    prefix: this.client.config.prefix
                }));
            if (!VALID_PERSONAS.includes(choice))
                return void M.reply((0, lib_1.t)('settheme_invalid', lang, { prefix: this.client.config.prefix }));
            const persona = choice;
            if (this.client.config.persona === persona)
                return void M.reply((0, lib_1.t)('settheme_already', lang, { theme: (0, lib_1.getPersonaName)(persona) }));
            this.client.config.persona = persona;
            this.client.config.name = (0, lib_1.getPersonaName)(persona);
            return void M.reply((0, lib_1.t)('settheme_switched', lang, { theme: (0, lib_1.getPersonaName)(persona) }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('settheme', {
        description: 'Bot ki poori personality/theme switch karo — Rias, Alya, Akino, Hinata, Zero Two ya Miku',
        aliases: ['persona', 'theme'],
        usage: 'settheme <rias|alya|akino|hinata|zerotwo|miku>',
        cooldown: 5,
        exp: 5,
        category: 'dev'
    })
], command);
exports.default = command;
