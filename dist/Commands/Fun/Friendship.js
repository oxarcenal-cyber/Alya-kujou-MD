"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_chan_1 = require("@shineiichijo/canvas-chan");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const friendshipArray = [];
            let users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 2)
                users.push(M.sender.jid);
            if (users.includes(M.sender.jid))
                users = users.reverse();
            for (const user of users) {
                const name = this.client.contact.getContact(user).username;
                let image;
                try {
                    image =
                        (await this.client.profilePictureUrl(user, 'image')) ||
                            'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
                }
                catch (error) {
                    image = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
                }
                friendshipArray.push({ name, image });
            }
            const percentage = Math.floor(Math.random() * 101);
            let text = '';
            if (percentage >= 0 && percentage < 10)
                text = 'Fake friends';
            else if (percentage >= 10 && percentage < 25)
                text = 'Awful';
            else if (percentage >= 25 && percentage < 40)
                text = 'Very Bad';
            else if (percentage >= 40 && percentage < 50)
                text = 'Average';
            else if (percentage >= 50 && percentage < 75)
                text = 'Nice';
            else if (percentage >= 75 && percentage < 90)
                text = 'Besties';
            else if (percentage >= 90)
                text = 'Soulmates';
            const image = new canvas_chan_1.Friendship(friendshipArray, percentage, text);
            let caption = `\t🍁 *Calculating...* 🍁 \n`;
            caption += `\t\t---------------------------------\n`;
            caption += `@${users[0].split('@')[0]}  &  @${users[1].split('@')[0]}\n`;
            caption += `\t\t---------------------------------\n`;
            caption += `\t\t\t\t\t${percentage < 40 ? '📉' : percentage < 75 ? '📈' : '💫'} *Percentage: ${percentage}%*\n`;
            caption += text;
            return void (await M.reply(await image.build(), 'image', undefined, undefined, caption, [users[0], users[1]]));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('friendship', {
        description: 'Calculates the level of a friendship',
        usage: 'friendship [tag/quote users]',
        cooldown: 10,
        exp: 50,
        category: 'fun'
    })
], default_1);
exports.default = default_1;
