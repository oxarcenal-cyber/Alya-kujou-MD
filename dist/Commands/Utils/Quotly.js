"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const axios_1 = __importDefault(require("axios"));
const canvas_1 = require("canvas");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context && (!M.quoted || M.quoted.content === ''))
                return void M.reply('Provide the text you want as a quote sticker!');
            const content = context ? context.trim() : M.quoted?.content;
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 1)
                users.push(M.sender.jid);
            const user = users[0];
            const username = user === M.sender.jid
                ? M.sender.username
                : this.client.contact.getContact(user).username;
            let pfpBuf = null;
            try {
                const pfpUrl = (await this.client.profilePictureUrl(user, 'image').catch(() => null)) ||
                    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
                const res = await axios_1.default.get(pfpUrl, { responseType: 'arraybuffer', timeout: 8000 });
                pfpBuf = Buffer.from(res.data);
            }
            catch {
                pfpBuf = null;
            }
            try {
                const buffer = await this.buildQuoteImage(username, content, pfpBuf);
                const sticker = new wa_sticker_formatter_1.Sticker(buffer, {
                    pack: 'Quote',
                    author: M.sender.username,
                    type: wa_sticker_formatter_1.StickerTypes.FULL,
                    categories: ['✨', '💗'],
                    quality: 90
                });
                return void (await M.reply(await sticker.build(), 'sticker'));
            }
            catch (err) {
                console.error('[Quotly] canvas error:', err.message);
                return void M.reply('Failed to generate quote sticker. Please try again.');
            }
        };
        this.buildQuoteImage = async (username, text, pfpBuf) => {
            const W = 512;
            const PADDING = 20;
            const AVATAR_SIZE = 52;
            const FONT_NAME = 18;
            const FONT_TEXT = 16;
            const LINE_HEIGHT = FONT_TEXT + 6;
            const MAX_TEXT_W = W - PADDING * 2 - AVATAR_SIZE - 16;
            // Pre-measure text to get canvas height
            const tmpCanvas = (0, canvas_1.createCanvas)(W, 10);
            const tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.font = `${FONT_TEXT}px sans-serif`;
            const lines = this.wrapText(tmpCtx, text, MAX_TEXT_W);
            const textBlockH = lines.length * LINE_HEIGHT;
            const H = Math.max(AVATAR_SIZE + PADDING * 2, PADDING * 2 + FONT_NAME + 8 + textBlockH + 10);
            const canvas = (0, canvas_1.createCanvas)(W, H);
            const ctx = canvas.getContext('2d');
            // Background
            ctx.fillStyle = '#1e1e2e';
            this.roundRect(ctx, 0, 0, W, H, 18);
            ctx.fill();
            // Left accent bar
            ctx.fillStyle = '#cba6f7';
            ctx.fillRect(PADDING, PADDING, 4, H - PADDING * 2);
            // Avatar circle
            const AX = PADDING + 4 + 12;
            const AY = PADDING + 4;
            ctx.save();
            ctx.beginPath();
            ctx.arc(AX + AVATAR_SIZE / 2, AY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
            ctx.clip();
            if (pfpBuf) {
                try {
                    const img = await (0, canvas_1.loadImage)(pfpBuf);
                    ctx.drawImage(img, AX, AY, AVATAR_SIZE, AVATAR_SIZE);
                }
                catch {
                    ctx.fillStyle = '#45475a';
                    ctx.fillRect(AX, AY, AVATAR_SIZE, AVATAR_SIZE);
                }
            }
            else {
                ctx.fillStyle = '#45475a';
                ctx.fillRect(AX, AY, AVATAR_SIZE, AVATAR_SIZE);
            }
            ctx.restore();
            // Username
            const TX = AX + AVATAR_SIZE + 12;
            const TY_NAME = PADDING + FONT_NAME;
            ctx.fillStyle = '#cba6f7';
            ctx.font = `bold ${FONT_NAME}px sans-serif`;
            ctx.fillText(username, TX, TY_NAME, W - TX - PADDING);
            // Message text
            ctx.fillStyle = '#cdd6f4';
            ctx.font = `${FONT_TEXT}px sans-serif`;
            let lineY = TY_NAME + 10;
            for (const line of lines) {
                ctx.fillText(line, TX, lineY);
                lineY += LINE_HEIGHT;
            }
            return canvas.toBuffer('image/png');
        };
        this.wrapText = (ctx, text, maxW) => {
            const lines = [];
            for (const paragraph of text.split('\n')) {
                const words = paragraph.split(' ');
                let current = '';
                for (const word of words) {
                    const test = current ? `${current} ${word}` : word;
                    if (ctx.measureText(test).width > maxW && current) {
                        lines.push(current);
                        current = word;
                    }
                    else {
                        current = test;
                    }
                }
                if (current)
                    lines.push(current);
            }
            return lines.slice(0, 18); // cap at 18 lines so sticker stays readable
        };
        this.roundRect = (ctx, x, y, w, h, r) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.arcTo(x + w, y, x + w, y + r, r);
            ctx.lineTo(x + w, y + h - r);
            ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
            ctx.lineTo(x + r, y + h);
            ctx.arcTo(x, y + h, x, y + h - r, r);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.closePath();
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('quotly', {
        description: 'Generates a Telegram-style quote sticker from any text',
        category: 'utils',
        usage: 'quotly [text] | quotly [quote a message]',
        aliases: ['q'],
        exp: 20,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
