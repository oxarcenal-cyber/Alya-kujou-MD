"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PvpBattleState_1 = require("../../lib/PvpBattleState");
const PVP_TIMEOUT_MS = 90 * 1000; // 90s to accept challenge
// ── Resolve @lid JID to real phone @s.whatsapp.net JID ────────────────────────
function resolveMentionJid(rawJid, M, correctJid) {
    if (!rawJid)
        return '';
    if (!rawJid.endsWith('@lid'))
        return correctJid(rawJid);
    const participants = M.groupMetadata?.participants || [];
    const match = participants.find((p) => p.id === rawJid || (p.lid && p.lid === rawJid));
    if (match?.phoneNumber)
        return match.phoneNumber;
    return correctJid(rawJid);
}
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const arg = context?.trim().toLowerCase() ?? '';
            // ── ACCEPT ────────────────────────────────────────────────────────────────
            if (arg === 'accept') {
                // Lookup challenge — try direct JID then fallback phone-number scan
                let challengeKey;
                let challenge = this.handler.pvpChallenges.get(M.sender.jid);
                if (challenge) {
                    challengeKey = M.sender.jid;
                }
                else {
                    const senderNum = M.sender.jid.split('@')[0].split(':')[0];
                    for (const [key, val] of this.handler.pvpChallenges) {
                        if (key.split('@')[0].split(':')[0] === senderNum) {
                            challenge = val;
                            challengeKey = key;
                            break;
                        }
                    }
                }
                if (!challenge || !challengeKey || challenge.expiresAt < Date.now()) {
                    if (challengeKey)
                        this.handler.pvpChallenges.delete(challengeKey);
                    return void M.reply(`❌ No pending PVP challenge found, or it has expired. (90s window)`);
                }
                const challengerJid = challenge.from;
                this.handler.pvpChallenges.delete(challengeKey);
                // Fetch both trainers
                const [challenger, defender] = await Promise.all([
                    this.client.DB.getUser(challengerJid),
                    this.client.DB.getUser(M.sender.jid)
                ]);
                if (!challenger.party.length || !defender.party.length)
                    return void M.reply(`❌ Both trainers need at least 1 Pokémon in their party!`);
                const chalPoke = [...challenger.party].sort((a, b) => b.level - a.level)[0];
                const defPoke = [...defender.party].sort((a, b) => b.level - a.level)[0];
                // Notify battle is preparing
                await this.client.sendMessage(M.from, {
                    text: `⚔️ *Battle preparing...*\nFetching moves for *${this.client.utils.capitalize(chalPoke.name)}* & *${this.client.utils.capitalize(defPoke.name)}*...`,
                    footer: '⚔️ PvP Battle'
                });
                // Fetch real PokéAPI moves for both Pokémon in parallel
                const [chalMoves, defMoves] = await Promise.all([
                    (0, PvpBattleState_1.fetchMovesForPokemon)(chalPoke.name),
                    (0, PvpBattleState_1.fetchMovesForPokemon)(defPoke.name)
                ]);
                // Build battle ID and HP values
                const battleId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
                const chalHp = (0, PvpBattleState_1.getBattleHp)(chalPoke.level);
                const defHp = (0, PvpBattleState_1.getBattleHp)(defPoke.level);
                const chalPlayer = {
                    jid: challengerJid,
                    username: challenge.username,
                    pokemonName: chalPoke.name,
                    pokemonLevel: chalPoke.level,
                    hp: chalHp,
                    maxHp: chalHp,
                    moves: chalMoves,
                    isDefending: false
                };
                const defPlayer = {
                    jid: M.sender.jid,
                    username: M.sender.username,
                    pokemonName: defPoke.name,
                    pokemonLevel: defPoke.level,
                    hp: defHp,
                    maxHp: defHp,
                    moves: defMoves,
                    isDefending: false
                };
                const playersMap = new Map();
                playersMap.set(challengerJid, chalPlayer);
                playersMap.set(M.sender.jid, defPlayer);
                const battle = {
                    battleId,
                    groupJid: M.from,
                    p1Jid: challengerJid,
                    p2Jid: M.sender.jid,
                    players: playersMap,
                    currentTurn: challengerJid, // challenger goes first
                    turnTimer: null
                };
                // Auto-cancel if first move isn't made within 90s
                battle.turnTimer = setTimeout(() => {
                    if (this.handler.pvpBattles.has(battleId)) {
                        this.handler.pvpBattles.delete(battleId);
                        this.client.sendMessage(M.from, {
                            text: `⏰ *Battle timed out!*\n\n` +
                                `*${chalPlayer.username}* didn't make their first move in time.\n` +
                                `The battle has been cancelled. ❌`
                        }).catch(() => { });
                    }
                }, PVP_TIMEOUT_MS);
                this.handler.pvpBattles.set(battleId, battle);
                const startText = `⚔️ *TRAINER BATTLE BEGINS!* ⚔️\n\n` +
                    `🟢 *${chalPlayer.username}* — ${this.client.utils.capitalize(chalPlayer.pokemonName)} (Lv.${chalPlayer.pokemonLevel})\n` +
                    `   ${(0, PvpBattleState_1.hpBar)(chalPlayer.hp, chalPlayer.maxHp)}\n\n` +
                    `🔴 *${defPlayer.username}* — ${this.client.utils.capitalize(defPlayer.pokemonName)} (Lv.${defPlayer.pokemonLevel})\n` +
                    `   ${(0, PvpBattleState_1.hpBar)(defPlayer.hp, defPlayer.maxHp)}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `⏰ Each turn: *90 seconds*\n` +
                    `🎮 @${challengerJid.split('@')[0]}'s turn!\n` +
                    `Choose your move 👇`;
                return void await this.client.sendMessage(M.from, {
                    text: startText,
                    footer: '⚔️ PvP Battle',
                    mentions: [challengerJid],
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: `${chalMoves[0].emoji} ${chalMoves[0].name} (${chalMoves[0].power} PWR)`, id: `pvpbattle:attack:${battleId}:0` },
                        { text: `${chalMoves[1].emoji} ${chalMoves[1].name} (${chalMoves[1].power} PWR)`, id: `pvpbattle:attack:${battleId}:1` },
                        { text: `🛡️ Defend`, id: `pvpbattle:defend:${battleId}` }
                    ]
                });
            }
            // ── DECLINE ───────────────────────────────────────────────────────────────
            if (arg === 'decline' || arg === 'reject') {
                let challengeKey;
                let challenge = this.handler.pvpChallenges.get(M.sender.jid);
                if (challenge) {
                    challengeKey = M.sender.jid;
                }
                else {
                    const senderNum = M.sender.jid.split('@')[0].split(':')[0];
                    for (const [key, val] of this.handler.pvpChallenges) {
                        if (key.split('@')[0].split(':')[0] === senderNum) {
                            challenge = val;
                            challengeKey = key;
                            break;
                        }
                    }
                }
                if (!challenge || !challengeKey)
                    return void M.reply(`❌ You have no pending PVP challenge to decline.`);
                this.handler.pvpChallenges.delete(challengeKey);
                return void await this.client.sendMessage(M.from, {
                    text: `🚫 *${M.sender.username}* declined the challenge from *${challenge.username}*.\n\nBetter luck next time! 😅`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            // ── CHALLENGE ─────────────────────────────────────────────────────────────
            if (M.chat !== 'group')
                return void M.reply(`⚔️ PVP battles can only be started in groups!`);
            if (!M.mentioned.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Tag a trainer to challenge!*\n\n` +
                        `📢 *How to use:*\n` +
                        `• *${p}pvp @user* — Challenge someone\n` +
                        `• *${p}pvp accept* — Accept a challenge\n` +
                        `• *${p}pvp decline* — Decline a challenge`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            // Resolve @lid → real phone JID
            const rawMentioned = M.mentioned[0];
            const mentioned = resolveMentionJid(rawMentioned, M, this.client.correctJid.bind(this.client));
            if (!mentioned)
                return void M.reply(`❌ Could not resolve the tagged user. Please try again.`);
            if (mentioned === M.sender.jid)
                return void M.reply(`😅 You can't battle yourself!`);
            const user = await this.client.DB.getUser(M.sender.jid);
            if (!user.party.length)
                return void M.reply(`❌ You need at least 1 Pokémon in your party! Use *${p}catch* first.`);
            const myPoke = [...user.party].sort((a, b) => b.level - a.level)[0];
            // Store challenge — keyed on defender's resolved phone JID
            this.handler.pvpChallenges.set(mentioned, {
                from: M.sender.jid,
                username: M.sender.username,
                pokemon: myPoke.name,
                expiresAt: Date.now() + PVP_TIMEOUT_MS
            });
            setTimeout(() => {
                const pending = this.handler.pvpChallenges.get(mentioned);
                if (pending?.from === M.sender.jid)
                    this.handler.pvpChallenges.delete(mentioned);
            }, PVP_TIMEOUT_MS);
            const targetTag = mentioned.split('@')[0];
            return void await this.client.sendMessage(M.from, {
                text: `⚔️ *PVP CHALLENGE!*\n\n` +
                    `*${M.sender.username}* challenges @${targetTag} to a Pokémon battle!\n\n` +
                    `🥊 Lead Pokémon: *${this.client.utils.capitalize(myPoke.name)}* (Lv.${myPoke.level})\n\n` +
                    `@${targetTag}, you have *90 seconds* to respond!`,
                footer: '🎮 Pokémon Hub',
                mentions: [rawMentioned],
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '✅ Accept Challenge', id: `${p}pvp accept` },
                    { text: '❌ Decline', id: `${p}pvp decline` }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('pvp', {
        description: '⚔️ Challenge another trainer to a Pokémon battle!',
        usage: 'pvp @user | pvp accept | pvp decline',
        category: 'pokemon',
        cooldown: 10,
        exp: 20,
        aliases: ['battle', 'pokebattle']
    })
], default_1);
exports.default = default_1;
