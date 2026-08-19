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
            if (!M.groupMetadata)
                return void M.reply('*Try Again!*');
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length || users.length < 1)
                return void M.reply('');
            const mentioned = users;
            let text = '';
            for (const user of users) {
                const i = users.indexOf(user);
                if (i === 0)
                    text += '\n';
                if (M.groupMetadata.admins?.includes(user)) {
                    text += `@${user.split('@')[0]} My Master you are already admin chill😍 .`;
                    continue;
                }
                await this.client.groupParticipantsUpdate(M.from, [user], 'promote');
                text += `*🏮 Status:*\n\n i promoted you my master *@${user.split('@')[0]}* `;
            }
            return void M.reply(text, 'text', undefined, undefined, undefined, mentioned);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('pm', {
        description: 'Promote yourself to admin in a group (dev only)',
        category: 'dev',
        usage: 'pm',
        aliases: ['pm'],
        exp: 10,
        cooldown: 10,
    })
], command);
exports.default = command;
