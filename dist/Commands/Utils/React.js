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
        this.execute = async ({ react, reply, quoted, emojis, message }) => {
            if (!emojis.length)
                return void reply('Provide an emoji to react');
            const key = quoted ? quoted.key : message.key ?? undefined;
            return void (await react(emojis[0], key));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('react', {
        category: 'utils',
        description: 'Reacts a message with the given emoji',
        usage: 'react [emoji] || react [emoji] [quote a message]',
        cooldown: 5,
        exp: 10
    })
], default_1);
exports.default = default_1;
