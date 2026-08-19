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
const reactions = Object.keys(lib_1.Reactions);
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const command = M.content.split(' ')[0].toLowerCase().slice(this.client.config.prefix.length).trim();
            let flag = true;
            if (command === 'r' || command === 'reaction')
                flag = false;
            if (!flag && !context)
                return void M.reply(`💫 *Available Reactions:*\n\n- ${reactions
                    .sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))
                    .map((reaction) => this.client.utils.capitalize(reaction))
                    .join('\n- ')}\n\n🔗 *Usage:* ${this.client.config.prefix}reaction (reaction) [tag/quote user] | ${this.client.config.prefix}(reaction) [tag/quote user]\nExample: ${this.client.config.prefix}pat`);
            const reaction = (flag ? command : context.split(' ')[0].trim().toLowerCase());
            if (!flag && !reactions.includes(reaction))
                return void M.reply(`Invalid reaction. Use *${this.client.config.prefix}react* to see all of the available reactions`);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 1)
                users.push(M.sender.jid);
            const reactant = users[0];
            const single = reactant === M.sender.jid;
            const { url, words } = await new lib_1.Reaction().getReaction(reaction, single);
            const caption = `*@${M.sender.jid.split('@')[0]} ${words} ${single ? 'Themselves' : `@${reactant.split('@')[0]}`}*`;
            const mentions = [M.sender.jid, reactant];
            // Reaction media providers can return a temporary 403. Keep the
            // command useful by falling back to a text reaction instead of
            // failing the whole command.
            const gifBuffer = await this.client.utils.getBufferCapped(url, 8 * 1024 * 1024);
            if (gifBuffer) {
                try {
                    const video = await this.client.utils.gifToMp4(gifBuffer);
                    return void (await M.reply(video, 'video', true, 'video/mp4', caption, mentions));
                }
                catch {
                    // Use the text fallback below when conversion fails.
                }
            }
            return void (await M.reply(caption, 'text', undefined, undefined, undefined, mentions));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('reaction', {
        description: 'React via anime gifs with the tagged or quoted user',
        category: 'fun',
        cooldown: 10,
        exp: 20,
        usage: 'reaction (reaction) [tag/quote user] || (reaction) [tag/quote user]',
        aliases: ['r', ...reactions]
    })
], default_1);
exports.default = default_1;
