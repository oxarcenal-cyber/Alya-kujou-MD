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
        this.execute = async ({ quoted, reply }, { context }) => {
            if (!quoted && !context)
                return void reply('🟥 *Provide the invite link next to the command or by quoting the message which has the invite link*');
            let body;
            if (!context)
                body = quoted?.content;
            else
                body = context.trim();
            const URLS = this.client.utils.extractUrls(body);
            const urls = URLS.filter((url) => url.includes('chat.whatsapp.com'));
            if (!urls.length || urls.length <= 0)
                return void reply("I don't see any invite links");
            const splittedUrl = urls[0].split('/');
            const code = splittedUrl[splittedUrl.length - 1];
            await this.client
                .groupAcceptInvite(code)
                .then(async () => await reply(`Joined!`))
                .catch((err) => {
                console.log(err);
                return void reply("🟨 *Can't join the group, check if the invite link is valid (if it's valid then maybe i was removed)");
            });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('join', {
        description: 'Make the bot join a group via invite link',
        category: 'dev',
        dm: true,
        usage: 'join <invite_link>'
    })
], command);
exports.default = command;
