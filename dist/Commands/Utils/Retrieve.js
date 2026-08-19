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
        this.execute = async (M) => {
            if (!M.quoted || M.quoted.type !== 'viewOnceMessageV2')
                return void M.reply('Quote a view once message to retrieve, Baka!');
            const buffer = await M.downloadMediaMessage(M.quoted.message);
            const type = Object.keys(M.quoted.message.viewOnceMessageV2?.message || {})[0].replace('Message', '');
            return void (await M.reply(buffer, type));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('retrieve', {
        description: 'Retrieves view once message',
        category: 'utils',
        usage: 'retrieve [quote view once message]',
        cooldown: 10,
        exp: 40
    })
], default_1);
exports.default = default_1;
