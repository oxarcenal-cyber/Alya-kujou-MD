"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const GroqFun_1 = require("../../lib/GroqFun");
const pending = new Map();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
// ─── Fallback Roast Lines (agar Groq unavailable ho) ─────────────────────────
const ROASTS_A = [
    'Tera existence ek error message hai jo koi fix nahi karna chahta.',
    'Tu itna boring hai ki ghadi bhi tujhe dekh ke so jaati hai.',
    'Teri personality copy-paste hai aur source bhi gaya.',
    'Tu wo WiFi hai jis se koi connect nahi karna chahta.',
    'Tera future itna dark hai sunglasses ki zaroorat nahi.',
    'Tu GPS se bhi zyada lost rehta hai life mein.',
    'Teri advice lena aur random button dabaana ek hi baat hai.',
    'Tu itna slow hai ki evolution ne bhi tera case close kar diya.',
    'Tujhe duniya ne ignore karna seekha teri presence se.',
    'Tera attitude gaya guzra hai, aur battery bhi low hai.',
];
const ROASTS_B = [
    'Tera dimag itna chhota hai ki molecules ko jagah nahi milti.',
    'Tu wo notification hai jo sab log dismiss kar dete hain.',
    'Teri soch itni purani hai ki Wikipedia bhi outdated maanta hai.',
    'Tere jokes itne flat hain ki zameen bhi sharminda ho jaaye.',
    'Tu wo chapter hai jo sab skip kar dete hain.',
    'Teri presence aur absence mein fark dhundna mushkil hai.',
    'Tu itna forgettable hai ki mirror bhi teri photo nahi rakhta.',
    'Teri life story seedha bin se waste paper basket mein jaayegi.',
    'Tujhe serious lena aur shoebox mein sona ek jaisa hai.',
    'Tu wo question hai jiska answer koi nahi deta.',
];
const CROWD_REACTIONS = [
    ['😐', '😮', '💀', '🔥', '👏'],
    ['👀', '😂', '😱', '💀', '🔥'],
    ['🤭', '😯', '🔥', '👑', '💀'],
];
function getFallbackRoast(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function crowd() {
    const r = CROWD_REACTIONS[Math.floor(Math.random() * CROWD_REACTIONS.length)];
    return r.join(' ');
}
/** AI se ek fresh roast line lo, fail hone par fallback use karo */
async function getAiRoast(attackerName, defenderName, fallbackArr) {
    const ai = await (0, GroqFun_1.askGroq)(`Generate ONE savage, witty, single-line roast in Hinglish (Hindi+English mix). ` +
        `"${attackerName}" is roasting "${defenderName}" in a roast battle. ` +
        `Keep it under 18 words. Sirf roast line do — koi quotes, prefix ya explanation mat lagao.`);
    return ai ?? getFallbackRoast(fallbackArr);
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
                return void M.reply('❌ Roast Battle sirf group mein hoti hai!');
            // ── Help ──────────────────────────────────────────────────────────
            if (!input && M.mentioned.length === 0)
                return void M.reply(`🎭 *ROAST BATTLE*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}rb @user\` → Kisi ko challenge karo\n` +
                    `  \`${prefix}rb accept\` → Challenge accept karo\n` +
                    `  \`${prefix}rb cancel\` → Challenge cancel karo\n\n` +
                    `⚡ *Rules:*\n` +
                    `  🎭 3 rounds ki roast battle\n` +
                    `  🤖 AI har round mein fresh roast lines generate karta hai\n` +
                    `  🏆 Crowd decide karta hai winner!\n\n` +
                    `📢 *Example:* \`${prefix}rb @someone\``);
            // ── Accept ────────────────────────────────────────────────────────
            if (input === 'accept') {
                const session = pending.get(group);
                if (!session)
                    return void M.reply(`❌ Koi pending roast battle nahi!\n📢 Challenge: \`${prefix}rb @user\``);
                if (this.client.correctJid(fromJid) !== session.challengedJid)
                    return void M.reply(`❌ Ye battle tumhare liye nahi!\n⚔️ *${session.challengerName}* ne kisi aur ko challenge kiya.`);
                if (Date.now() > session.expiresAt) {
                    pending.delete(group);
                    return void M.reply('⏰ Battle challenge expire ho gaya!');
                }
                pending.delete(group);
                const sent = await this.client.sendMessage(M.from, {
                    text: `🎭 ═══ *ROAST BATTLE* ═══ 🎭\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `⚔️ *${session.challengerName}* vs *${session.challengedName}*\n\n` +
                        `_🤖 AI roast lines generate kar raha hai... 3 rounds!_`
                }, { quoted: M.message });
                if (!sent?.key)
                    return;
                const edit = (text) => this.client.sendMessage(M.from, { text, edit: sent.key });
                const scores = { a: 0, b: 0 };
                for (let round = 1; round <= 3; round++) {
                    await sleep(1500);
                    // Dono roasts parallel mein fetch karo (faster)
                    const [roastA, roastB] = await Promise.all([
                        getAiRoast(session.challengerName, session.challengedName, ROASTS_A),
                        getAiRoast(session.challengedName, session.challengerName, ROASTS_B)
                    ]);
                    const crowdA = crowd();
                    const crowdB = crowd();
                    const scoreA = Math.floor(Math.random() * 4) + 6; // 6–9
                    const scoreB = Math.floor(Math.random() * 4) + 6;
                    scores.a += scoreA;
                    scores.b += scoreB;
                    await edit(`🎭 ═══ *ROAST BATTLE — Round ${round}/3* ═══ 🎭\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `😈 *${session.challengerName}:*\n` +
                        `_"${roastA}"_\n` +
                        `Crowd: ${crowdA} *(${scoreA}/10)*\n\n` +
                        `🔥 *${session.challengedName}:*\n` +
                        `_"${roastB}"_\n` +
                        `Crowd: ${crowdB} *(${scoreB}/10)*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `📊 Score: *${session.challengerName}* ${scores.a} — ${scores.b} *${session.challengedName}*`);
                    if (round < 3)
                        await sleep(2000);
                }
                await sleep(1800);
                const winner = scores.a >= scores.b ? session.challengerName : session.challengedName;
                const loser = scores.a >= scores.b ? session.challengedName : session.challengerName;
                await edit(`🎭 ═══ *ROAST BATTLE OVER!* ═══ 🎭\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `📊 *Final Score:*\n` +
                    `  😈 *${session.challengerName}:* ${scores.a} pts\n` +
                    `  🔥 *${session.challengedName}:* ${scores.b} pts\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `🏆 *${winner} WINS the Roast Battle!* 🏆\n` +
                    `💀 *${loser}* got demolished!\n\n` +
                    `👏 👏 👏`);
                return;
            }
            // ── Cancel ────────────────────────────────────────────────────────
            if (input === 'cancel') {
                const session = pending.get(group);
                if (!session)
                    return void M.reply('❌ Koi pending battle nahi!');
                if (session.challengerJid !== fromJid && !M.sender.isAdmin)
                    return void M.reply('❌ Sirf challenger cancel kar sakta hai!');
                pending.delete(group);
                return void M.reply('🛑 Roast Battle cancel!');
            }
            // ── New Challenge ─────────────────────────────────────────────────
            if (M.mentioned.length < 1)
                return void M.reply(`❌ Kisi ko tag karo!\n📢 Example: \`${prefix}rb @user\``);
            if (pending.has(group))
                return void M.reply(`❌ Pehle se ek battle pending hai!\n📢 Cancel: \`${prefix}rb cancel\``);
            const targetJid = this.client.correctJid(M.mentioned[0]);
            const selfJid = this.client.correctJid(fromJid);
            if (targetJid === selfJid)
                return void M.reply('❌ Khud se roast battle? Waise bhi tujhe dono sides ka roast milega 😂');
            const botJid = this.client.correctJid(this.client.user?.id || '');
            if (targetJid === botJid)
                return void M.reply('❌ Bot se roast battle nahi hoti! 🤖');
            const targetName = this.client.contact.getContact(targetJid).username || 'Fighter';
            pending.set(group, {
                challengerJid: selfJid,
                challengerName: M.sender.username || 'Challenger',
                challengedJid: targetJid,
                challengedName: targetName,
                expiresAt: Date.now() + 60000
            });
            setTimeout(() => {
                const s = pending.get(group);
                if (s && s.challengerJid === selfJid)
                    pending.delete(group);
            }, 60000);
            await this.client.sendMessage(M.from, {
                text: `🎭 *ROAST BATTLE CHALLENGE!* 🎭\n\n` +
                    `😈 *${M.sender.username || 'Challenger'}* vs 🔥 *${targetName}*\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `@${targetJid.split('@')[0]} kya tum accept karte ho? 🎭\n\n` +
                    `✅ Accept: \`${prefix}rb accept\`\n` +
                    `❌ Ignore → 60s baad expire`,
                mentions: [targetJid]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('roastbattle', {
        description: 'Dusre player ko AI roast battle pe challenge karo! 🎭',
        category: 'fun',
        usage: 'roastbattle @user | roastbattle accept | roastbattle cancel',
        aliases: ['rb'],
        cooldown: 0,
        exp: 15
    })
], default_1);
exports.default = default_1;
