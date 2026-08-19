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
        this.execute = async (M, { flags }) => {
            let users = await this.client.DB.user.find({});
            if (flags.includes('--group')) {
                if (!M.groupMetadata)
                    return void setTimeout(async () => await this.execute(M, { flags, context: '', args: [] }), 3000);
                users = [];
                const { participants } = M.groupMetadata;
                for (const participant of participants)
                    users.push(await this.client.DB.getUser(participant.id));
                flags.splice(flags.indexOf('--group'), 1);
            }
            let text = `♕︎ *LEADERBOARD* ♕︎`;
            const n = users.length < 10 ? users.length : 10;
            for (let i = 0; i < n; i++) {
                let { username } = this.client.contact.getContact(users[i].jid);
                text += `\n🀄 *#${i + 1}*\n🌀 *Username:* ${username}#${users[i].tag}\n🎉 *Experience:* ${users[i].experience}\n🏮 *Rank:* ${(0, lib_1.getStats)(users[i].level).rank}\n🪙 *Money:* ${users[i].wallet + users[i].bank}\n💮 *Pokemon:* ${users[i].party.length + users[i].pc.length}\n`;
            }
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('lb', {
        description: 'Shows all users leaderboard',
        category: 'general',
        usage: 'leaderboard',
        exp: 10,
        cooldown: 25,
        aliases: ['lb']
    })
], default_1);
exports.default = default_1;
