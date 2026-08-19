"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const tournaments = new Map();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const T_EMOJIS = ['⚔️', '🔥', '💀', '👊', '🌪️', '💢', '🗡️', '🏹'];
const MAX_HP = 100;
// ─── Battle Engine ────────────────────────────────────────────────────────────
function calcDmg() {
    const miss = Math.random() < 0.08;
    if (miss)
        return { dmg: 0, miss: true, crit: false };
    const crit = Math.random() < 0.20;
    const base = Math.floor(Math.random() * 18) + 10;
    return { dmg: crit ? base * 2 : base, miss: false, crit };
}
const ATK = [
    'strikes fiercely', 'unleashes a combo', 'channels power',
    'dashes and slashes', 'lands a crushing blow', 'releases a shockwave'
];
async function sendFightGif(M, client, key, caption) {
    const buffer = client.assets.get(key);
    if (!buffer)
        return;
    await client.sendMessage(M.from, {
        video: buffer,
        caption,
        gifPlayback: true,
        mimetype: 'video/mp4'
    }, { quoted: M.message });
}
async function simulateMatch(M, client, p1, p2, matchNum, totalMatches) {
    // Reset HP
    p1.hp = MAX_HP;
    p2.hp = MAX_HP;
    // ~25% of matches are "legendary" — bigger hype intro gif
    const isLegendary = Math.random() < 0.25;
    await sendFightGif(M, client, isLegendary ? 'fight-legendary' : 'fight-normal', isLegendary
        ? `🔥⚡ *LEGENDARY CLASH!* ⚡🔥\n${p1.emoji} *${p1.name}* vs ${p2.emoji} *${p2.name}*`
        : `⚔️ *${p1.emoji} ${p1.name}* vs *${p2.emoji} ${p2.name}*`);
    await sleep(600);
    const log = [];
    let round = 1;
    const header = () => `⚔️ ═══ *TOURNAMENT* ═══ ⚔️\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 Match ${matchNum}/${totalMatches} — Round ${round}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${p1.emoji} *${p1.name}*\n${hpBar(p1.hp, MAX_HP)}\n\n` +
        `${p2.emoji} *${p2.name}*\n${hpBar(p2.hp, MAX_HP)}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        log.slice(-3).map(l => `  ${l}`).join('\n');
    const hpBar = (hp, max) => {
        const f = Math.max(0, Math.round((hp / max) * 10));
        const ic = hp > 60 ? '❤️' : hp > 30 ? '🧡' : hp > 0 ? '💔' : '💀';
        return `${ic} ${'█'.repeat(f)}${'░'.repeat(10 - f)}  ${Math.max(0, hp)} HP`;
    };
    const sent = await client.sendMessage(M.from, { text: header() }, { quoted: M.message });
    if (!sent?.key)
        return Math.random() > 0.5 ? p1 : p2;
    const edit = (t) => client.sendMessage(M.from, { text: t, edit: sent.key });
    while (p1.hp > 0 && p2.hp > 0) {
        const a1 = calcDmg();
        p2.hp = Math.max(0, p2.hp - a1.dmg);
        const atk1 = ATK[Math.floor(Math.random() * ATK.length)];
        log.push(a1.miss ? `🌀 *${p1.name}* missed!` :
            a1.crit ? `💥 *CRIT!* *${p1.name}* ${atk1}! ‑${a1.dmg}` :
                `🗡️ *${p1.name}* ${atk1}! ‑${a1.dmg}`);
        await sleep(900);
        await edit(header());
        if (p2.hp <= 0)
            break;
        const a2 = calcDmg();
        p1.hp = Math.max(0, p1.hp - a2.dmg);
        const atk2 = ATK[Math.floor(Math.random() * ATK.length)];
        log.push(a2.miss ? `🌀 *${p2.name}* missed!` :
            a2.crit ? `💥 *CRIT!* *${p2.name}* ${atk2}! ‑${a2.dmg}` :
                `🗡️ *${p2.name}* ${atk2}! ‑${a2.dmg}`);
        round++;
        await sleep(900);
        await edit(header());
    }
    const winner = p1.hp > 0 ? p1 : p2;
    const loser = p1.hp > 0 ? p2 : p1;
    winner.wins++;
    await sleep(600);
    await edit(`⚔️ ═══ *MATCH ${matchNum} OVER!* ═══ ⚔️\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🏆 *${winner.emoji} ${winner.name} WINS!*\n` +
        `💀 *${loser.emoji} ${loser.name}* eliminated\n\n` +
        `_Next match coming up..._`);
    // ── Send loss GIF for the eliminated player ───────────────────────
    const LOSE_KEYS = ['lose-1', 'lose-2', 'lose-3', 'lose-4', 'lose-5', 'lose-6', 'lose-7', 'lose-8', 'lose-9', 'lose-10', 'lose-11', 'lose-12'];
    const loseGifKey = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)];
    const loseGifBuf = client.assets.get(loseGifKey);
    if (loseGifBuf)
        client.utils.gifToMp4(loseGifBuf).then(mp4 => client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💀 *${loser.emoji} ${loser.name}* eliminated!` })).catch(() => { });
    return winner;
}
// ─── Command ─────────────────────────────────────────────────────────────────
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const input = context.trim().toLowerCase();
            const group = M.from;
            const fromJid = this.client.correctJid(M.sender.jid);
            if (M.chat !== 'group')
                return void M.reply('❌ Tournament sirf group mein hota hai!');
            // ── Help ──────────────────────────────────────────────────────────
            if (!input)
                return void M.reply(`🏆 *TOURNAMENT SYSTEM*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}tour create <amount>\` → Tournament banao\n` +
                    `  \`${prefix}tour join\` → Tournament mein join karo\n` +
                    `  \`${prefix}tour start\` → Tournament shuru karo\n` +
                    `  \`${prefix}tour cancel\` → Cancel karo\n\n` +
                    `⚡ *Rules:*\n` +
                    `  🥊 2–8 players join kar sakte hain\n` +
                    `  🏆 Bracket format — ek haara to OUT\n` +
                    `  💀 Har match animated hai (HP bars!)\n` +
                    `  💰 Winner gets SAB ka gold!\n\n` +
                    `📢 *Example:*\n` +
                    `  \`${prefix}tour create 1000\`\n` +
                    `  \`${prefix}tour join\`\n` +
                    `  \`${prefix}tour start\``);
            // ── Create ────────────────────────────────────────────────────────
            if (input.startsWith('create')) {
                if (tournaments.has(group))
                    return void M.reply(`❌ Pehle se tournament chal raha hai!\n📢 Join: \`${prefix}tour join\``);
                const parts = context.trim().split(/\s+/);
                const amount = parseInt(parts[1]);
                if (!amount || amount < 100)
                    return void M.reply(`❌ Bet amount batao! Min *100 gold*\n📢 Example: \`${prefix}tour create 1000\``);
                if (amount > 10000)
                    return void M.reply(`❌ Max bet *10,000 gold*`);
                const { wallet } = await this.client.DB.getUser(fromJid);
                if (wallet < amount)
                    return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`);
                const hostName = M.sender.username || 'Host';
                tournaments.set(group, {
                    hostJid: fromJid,
                    bet: amount,
                    players: [{
                            jid: fromJid, name: hostName,
                            hp: MAX_HP, maxHp: MAX_HP,
                            emoji: T_EMOJIS[0], wins: 0
                        }],
                    started: false,
                    expiresAt: Date.now() + 120000,
                    round: 1,
                    bracket: []
                });
                setTimeout(() => {
                    const t = tournaments.get(group);
                    if (t && !t.started)
                        tournaments.delete(group);
                }, 120000);
                await sendFightGif(M, this.client, 'fight-create', `🏆 *TOURNAMENT CREATED!*\n\n` +
                    `👑 Host: *${hostName}*\n` +
                    `💰 Bet: *${amount.toLocaleString()} gold* each\n\n` +
                    `📢 Join: \`${prefix}tour join\`\n` +
                    `📢 Start: \`${prefix}tour start\` (min 2 players)\n\n` +
                    `⏰ 2 min baad auto-cancel`);
                await this.client.sendMessage(M.from, {
                    text: `👥 Join karo ya start karo!`,
                    footer: '🏆 RedzeoX Tournament',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✅ Join Tournament', id: `${prefix}tour join` },
                        { text: '🏆 Start Tournament', id: `${prefix}tour start` }
                    ]
                }, { quoted: M.message });
                return;
            }
            // ── Join ──────────────────────────────────────────────────────────
            if (input === 'join') {
                const t = tournaments.get(group);
                if (!t)
                    return void M.reply(`❌ Koi tournament nahi!\n📢 Banao: \`${prefix}tour create <amount>\``);
                if (t.started)
                    return void M.reply('❌ Tournament already shuru ho gaya!');
                if (t.players.length >= 8)
                    return void M.reply('❌ Max 8 players!');
                if (t.players.find(p => p.jid === fromJid))
                    return void M.reply('❌ Tum pehle se joined ho!');
                const { wallet } = await this.client.DB.getUser(fromJid);
                if (wallet < t.bet)
                    return void M.reply(`❌ Tumhare paas *${t.bet.toLocaleString()} gold* nahi!`);
                const emoji = T_EMOJIS[t.players.length % T_EMOJIS.length];
                t.players.push({ jid: fromJid, name: M.sender.username || 'Fighter', hp: MAX_HP, maxHp: MAX_HP, emoji, wins: 0 });
                return void await this.client.sendMessage(M.from, {
                    text: `✅ *${M.sender.username || 'Fighter'}* joined! ${emoji}\n\n` +
                        `👥 Players (${t.players.length}/8):\n` +
                        t.players.map(p => `  ${p.emoji} ${p.name}`).join('\n') +
                        `\n\n💰 Prize Pool: *${(t.bet * t.players.length).toLocaleString()} gold*`,
                    footer: '🏆 RedzeoX Tournament',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🏆 Start Tournament', id: `${prefix}tour start` }]
                }, { quoted: M.message });
            }
            // ── Cancel ────────────────────────────────────────────────────────
            if (input === 'cancel') {
                const t = tournaments.get(group);
                if (!t)
                    return void M.reply('❌ Koi tournament nahi!');
                if (t.hostJid !== fromJid && !M.sender.isAdmin)
                    return void M.reply('❌ Sirf host ya admin cancel kar sakta hai!');
                tournaments.delete(group);
                return void M.reply('🛑 Tournament cancel!');
            }
            // ── Start ─────────────────────────────────────────────────────────
            if (input === 'start') {
                const t = tournaments.get(group);
                if (!t)
                    return void M.reply(`❌ Koi tournament nahi!\n📢 Banao: \`${prefix}tour create <amount>\``);
                if (t.started)
                    return void M.reply('❌ Already shuru ho gaya!');
                if (t.hostJid !== fromJid && !M.sender.isAdmin)
                    return void M.reply('❌ Sirf host ya admin start kar sakta hai!');
                if (t.players.length < 2)
                    return void M.reply(`❌ Min *2 players* chahiye!`);
                t.started = true;
                const prize = t.bet * t.players.length;
                // Deduct bets
                for (const p of t.players)
                    await this.client.DB.setCrystal(p.jid, -t.bet);
                // Shuffle
                for (let i = t.players.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [t.players[i], t.players[j]] = [t.players[j], t.players[i]];
                }
                await M.reply(`🏆 *TOURNAMENT BEGINS!* 🏆\n\n` +
                    `👥 *${t.players.length} fighters:*\n` +
                    t.players.map(p => `  ${p.emoji} *${p.name}*`).join('\n') +
                    `\n\n💰 *Total Prize: ${prize.toLocaleString()} gold*\n\n` +
                    `_Bracket matches shuru ho rahe hain..._`);
                await sleep(2000);
                // Run bracket rounds
                let remaining = [...t.players];
                let roundNum = 1;
                while (remaining.length > 1) {
                    await sleep(1000);
                    const matches = [];
                    const nextRound = [];
                    // Pair up players
                    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
                    for (let i = 0; i < shuffled.length - 1; i += 2) {
                        matches.push({ p1: shuffled[i], p2: shuffled[i + 1], done: false });
                    }
                    // Bye if odd number
                    if (shuffled.length % 2 !== 0) {
                        const byePlayer = shuffled[shuffled.length - 1];
                        nextRound.push(byePlayer);
                        await M.reply(`🎟️ *${byePlayer.name}* gets a BYE this round! (Odd player out)`);
                        await sleep(800);
                    }
                    await M.reply(`⚔️ *ROUND ${roundNum} — ${matches.length} MATCHES*\n\n` +
                        matches.map((m, i) => `  Match ${i + 1}: *${m.p1.name}* vs *${m.p2.name}*`).join('\n') +
                        `\n\n_Starting in 2 seconds..._`);
                    await sleep(2200);
                    for (let i = 0; i < matches.length; i++) {
                        const m = matches[i];
                        const w = await simulateMatch(M, this.client, m.p1, m.p2, i + 1, matches.length);
                        m.winner = w;
                        m.done = true;
                        nextRound.push(w);
                        if (i < matches.length - 1)
                            await sleep(1500);
                    }
                    remaining = nextRound;
                    roundNum++;
                    if (remaining.length > 1) {
                        await sleep(1000);
                        await M.reply(`📊 *Round ${roundNum - 1} Over!*\n\n` +
                            `🏆 *Advancing to next round:*\n` +
                            remaining.map(p => `  ${p.emoji} *${p.name}* (${p.wins}W)`).join('\n'));
                        await sleep(1500);
                    }
                }
                // Grand winner!
                const champion = remaining[0];
                await this.client.DB.setCrystal(champion.jid, prize);
                tournaments.delete(group);
                await sendFightGif(M, this.client, 'fight-winner', `👑🎉 *${champion.emoji} ${champion.name}* is the CHAMPION! 🎉👑`);
                await sleep(500);
                const champText = `🏆 ═══ *TOURNAMENT OVER!* ═══ 🏆\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `👑 *CHAMPION:*\n` +
                    `${champion.emoji} *${champion.name}*\n\n` +
                    `💰 *+${prize.toLocaleString()} gold* 🎉\n` +
                    `🥊 Matches won: ${champion.wins}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `🎊 *Congratulations ${champion.name}!*`;
                const winImg = this.client.assets.get(Math.random() < 0.5 ? 'winner-1' : 'winner-2');
                if (winImg) {
                    await this.client.sendMessage(M.from, { image: winImg, caption: champText });
                }
                else {
                    await M.reply(champText);
                }
                await this.client.sendMessage(M.from, {
                    text: `🏆 Naya tournament shuru karo!`,
                    footer: '🏆 RedzeoX Tournament',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🏆 New Tournament', id: `${prefix}tour create 1000` }]
                });
                return;
            }
            return void M.reply(`❓ Sahi command batao!\n📢 Help: \`${prefix}tour\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('tournament', {
        description: 'Gold bracket tournament — last one standing wins! 🏆',
        category: 'games',
        usage: 'tournament create <amount> | tournament join | tournament start | tournament cancel',
        aliases: ['tour', 'trn'],
        cooldown: 0,
        exp: 30
    })
], default_1);
exports.default = default_1;
