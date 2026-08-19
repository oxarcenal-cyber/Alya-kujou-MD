"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const SLOTS = [
    { label: 'JACKPOT!', emoji: '🎰', multiplier: 10, weight: 1 },
    { label: '5x Win', emoji: '💎', multiplier: 5, weight: 3 },
    { label: '3x Win', emoji: '🥇', multiplier: 3, weight: 6 },
    { label: '2x Win', emoji: '⭐', multiplier: 2, weight: 10 },
    { label: '1.5x Win', emoji: '🎁', multiplier: 1.5, weight: 14 },
    { label: 'Win Back', emoji: '🔄', multiplier: 1, weight: 16 },
    { label: 'Lose Half', emoji: '😬', multiplier: 0.5, weight: 20 },
    { label: 'LOSE', emoji: '💀', multiplier: 0, weight: 30 },
];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function pickSlot() {
    const total = SLOTS.reduce((s, sl) => s + sl.weight, 0);
    let r = Math.random() * total;
    for (const sl of SLOTS) {
        r -= sl.weight;
        if (r <= 0)
            return sl;
    }
    return SLOTS[SLOTS.length - 1];
}
function buildWheelFrame(spinning, highlight, amount, phase) {
    const display = spinning.map((sl, i) => i === highlight ? `❱${sl.emoji} ${sl.label}❰` : `  ${sl.emoji} ${sl.label}  `);
    return (`🎡 ═══ *SPIN WHEEL* ═══ 🎡\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        display.join('\n') +
        `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 Bet: *${amount.toLocaleString()} gold*\n` +
        `${phase}`);
}
// ─── Command ─────────────────────────────────────────────────────────────────
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const prefix = this.client.config.prefix;
            if (!args[0])
                return void M.reply(`🎡 *SPIN WHEEL*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}spinwheel <amount>\` → Wheel spin karo!\n\n` +
                    `🎰 *Prize Table:*\n` +
                    SLOTS.map(sl => `  ${sl.emoji} *${sl.label}* — ${sl.multiplier}x`).join('\n') +
                    `\n\n📢 *Example:* \`${prefix}sw 1000\``);
            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount < 100)
                return void M.reply(`❌ Min bet *100 gold*!\n📢 Example: \`${prefix}sw 1000\``);
            if (amount > 50000)
                return void M.reply(`❌ Max bet *50,000 gold*`);
            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            if (wallet < amount)
                return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`);
            // Pick result first
            const result = pickSlot();
            const resultIdx = SLOTS.indexOf(result);
            // Make a 5-slot window array starting from random position
            const visibleCount = 5;
            const startIdx = Math.floor(Math.random() * SLOTS.length);
            const sent = await this.client.sendMessage(M.from, { text: buildWheelFrame(Array.from({ length: visibleCount }, (_, i) => SLOTS[(startIdx + i) % SLOTS.length]), 2, amount, `🌀 *Spinning...*`) }, { quoted: M.message });
            if (!sent?.key)
                return;
            const edit = (text) => this.client.sendMessage(M.from, { text, edit: sent.key });
            // Fast spin
            let curPos = startIdx;
            for (let i = 0; i < 12; i++) {
                await sleep(120 + i * 18);
                curPos = (curPos + 1) % SLOTS.length;
                const visible = Array.from({ length: visibleCount }, (_, j) => SLOTS[(curPos + j) % SLOTS.length]);
                await edit(buildWheelFrame(visible, 2, amount, `🌀 *Spinning fast...*`));
            }
            // Slow spin - land on result
            const slowDelays = [200, 320, 450, 600, 780, 950, 1100];
            for (let i = 0; i < slowDelays.length; i++) {
                await sleep(slowDelays[i]);
                curPos = (curPos + 1) % SLOTS.length;
                const visible = Array.from({ length: visibleCount }, (_, j) => SLOTS[(curPos + j) % SLOTS.length]);
                const phase = i < slowDelays.length - 1 ? `🐌 *Slowing down...*` : ``;
                await edit(buildWheelFrame(visible, 2, amount, phase));
            }
            // Final frame — force result in center
            const centeredSlots = [
                SLOTS[(resultIdx - 2 + SLOTS.length) % SLOTS.length],
                SLOTS[(resultIdx - 1 + SLOTS.length) % SLOTS.length],
                result,
                SLOTS[(resultIdx + 1) % SLOTS.length],
                SLOTS[(resultIdx + 2) % SLOTS.length],
            ];
            const payout = Math.floor(amount * result.multiplier);
            const delta = payout - amount;
            const isWin = delta > 0;
            const isTie = delta === 0;
            const resultLine = result.multiplier === 0
                ? `💔 *LOSE! -${amount.toLocaleString()} gold*`
                : isTie
                    ? `🔄 *Break Even! Bet wapas!*`
                    : isWin
                        ? `🏆 *${result.label}! +${delta.toLocaleString()} gold!* 🎉`
                        : `😬 *-${Math.abs(delta).toLocaleString()} gold!*`;
            await sleep(600);
            await edit(buildWheelFrame(centeredSlots, 2, amount, `\n🎯 *RESULT: ${result.emoji} ${result.label}*\n\n${resultLine}`));
            await this.client.DB.setCrystal(M.sender.jid, delta);
            // ── Send loss GIF if player lost ──────────────────────────────────
            if (result.multiplier === 0) {
                const LOSE_KEYS = ['lose-1', 'lose-2', 'lose-3', 'lose-4', 'lose-5', 'lose-6', 'lose-7', 'lose-8', 'lose-9', 'lose-10', 'lose-11', 'lose-12'];
                const loseKey = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)];
                const gifBuf = this.client.assets.get(loseKey);
                if (gifBuf)
                    this.client.utils.gifToMp4(gifBuf).then(mp4 => this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💔 *LOSE! -${amount.toLocaleString()} gold!*` })).catch(() => { });
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('spinwheel', {
        description: 'Wheel spin karo aur gold prize jeeto! 🎡',
        category: 'economy',
        usage: 'spinwheel <amount>',
        aliases: ['sw', 'wheel'],
        cooldown: 5,
        casino: true,
        exp: 15
    })
], default_1);
exports.default = default_1;
