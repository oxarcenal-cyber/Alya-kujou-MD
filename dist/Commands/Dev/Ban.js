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
        this.execute = async (M, { flags }) => {
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (users.length < 1)
                return void M.reply('Tag or quote a user to use this command');
            flags = flags.filter((flag) => flag.startsWith('--action='));
            if (flags.length < 1)
                return void M.reply(`Provide the action of the ban. Example: *${this.client.config.prefix}ban --action=ban*`);
            const actions = ['ban', 'unban'];
            const action = flags[0].split('=')[1];
            if (action === '')
                return void M.reply(`Provide the action of the ban. Example: *${this.client.config.prefix}ban --action=ban*`);
            if (!actions.includes(action.toLowerCase()))
                return void M.reply('Invalid action');
            let text = `🚦 *State: ${action.toLowerCase() === 'ban' ? 'BANNED' : 'UNBANNED'}*\n⚗ *Users:*\n`;
            let Text = '🚦 *State: SKIPPED*\n⚗ *Users:*\n\n';
            let resultText = '';
            let skippedFlag = false;
            for (const user of users) {
                const info = await this.client.DB.getUser(user);
                if (((this.client.config.mods.includes(user) || info.banned) && action.toLowerCase() === 'ban') ||
                    (!info.banned && action.toLowerCase() === 'unban')) {
                    skippedFlag = true;
                    Text += `*@${user.split('@')[0]}* (Skipped as this user is ${this.client.config.mods.includes(user)
                        ? 'a moderator'
                        : action.toLowerCase() === 'ban'
                            ? 'already banned'
                            : 'already unbanned'})\n`;
                    continue;
                }
                text += `\n*@${user.split('@')[0]}*`;
                await this.client.DB.updateBanStatus(user, action.toLowerCase());
            }
            if (skippedFlag)
                resultText += `${Text}\n`;
            resultText += text;
            return void (await M.reply(resultText, 'text', undefined, undefined, undefined, users));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('ban', {
        description: 'Bans/unban users',
        category: 'dev',
        cooldown: 5,
        usage: 'ban --action=[ban/unban] [tag/quote users]',
        exp: 15
    })
], default_1);
exports.default = default_1;
