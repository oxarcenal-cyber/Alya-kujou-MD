"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvacord_1 = require("canvacord");
const lib_1 = require("../../lib");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 1)
                users.push(M.sender.jid);
            const user = users[0];
            const username = user === M.sender.jid ? M.sender.username : (this.client.contact.getContact(user)?.username ?? user.split('@')[0]);
            let pfpUrl;
            try {
                pfpUrl = await this.client.profilePictureUrl(user, 'image');
            }
            catch {
                pfpUrl = undefined;
            }
            const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
            const { experience, level, tag } = await this.client.DB.getUser(user);
            const { requiredXpToLevelUp, rank } = (0, lib_1.getStats)(level);
            const card = await new canvacord_1.Rank()
                .setAvatar(pfp)
                .setLevel(level, 'LEVEL', true)
                .setCurrentXP(experience)
                .setRequiredXP(requiredXpToLevelUp)
                .setProgressBar(this.client.utils.generateRandomHex())
                .setDiscriminator(tag, this.client.utils.generateRandomHex())
                .setUsername(username, this.client.utils.generateRandomHex())
                .setBackground('COLOR', this.client.utils.generateRandomHex())
                .setRank(1, '', false)
                .renderEmojis(true)
                .build({ fontX: 'arial', fontY: 'arial' });
            return void (await M.reply(card, 'image', undefined, undefined, `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n  🌸✿ᰰ  *${username}#${tag}*  ✿ᰰ🌸\n      𐚁 🏮 𝑹𝒂𝒏𝒌 𝑪𝒂𝒓𝒅 𐚁\n\n  ‧₊˚ 🥇 𝑹𝒂𝒏𝒌   ·❀·  ${rank}\n  ‧₊˚ 🍀 𝑳𝒗𝒍    ·❀·  ${level}\n  ‧₊˚ 🌟 𝑬𝑿𝑷   ·❀·  ${experience} / ${requiredXpToLevelUp}\n\n    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n  🍃 ⁺. Keep chatting to level up! .⁺ 🍃\n\n  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('rank', {
        description: "Displays user's rank",
        category: 'general',
        exp: 20,
        cooldown: 10,
        aliases: ['card'],
        usage: 'rank [tag/quote user]'
    })
], default_1);
exports.default = default_1;
