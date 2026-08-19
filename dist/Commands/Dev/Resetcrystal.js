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
        this.execute = async (M) => {
            const users = M.mentioned;
            if (M?.sender?.isMod) {
                if (M.quoted && !users.includes(M.quoted.sender.jid))
                    users.push(M.quoted.sender.jid);
                if (!users.length || users.length < 0)
                    return void M.reply('Tag or quote a user to give');
                // if (users[0] === M.sender.jid) return void M.reply('tag someone')
                if (M.numbers.length < 1)
                    return void M.reply(`amount?`);
                const user = users[0];
                const { wallet } = await this.client.DB.getUser(M.sender.jid);
                const amount = M.numbers[0];
                // if ((wallet - amount) < 0) return void M.reply(`Check ur wallet`)
                // await this.client.DB.setCrystal(M.sender.jid, -amount)
                await this.client.DB.setCrystal(user, amount);
                return void M.reply(`gold has been set to *💎${amount}*  of @${user.split('@')[0]}`, 'text', undefined, undefined, undefined, [
                    M.sender.jid,
                    user
                ]);
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('rc', {
        category: 'dev',
        description: 'reset the gold of the @tagged user',
        usage: 'resetcystal',
        exp: 25,
        cooldown: 0
    })
], command);
exports.default = command;
