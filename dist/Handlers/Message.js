"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const chalk_1 = __importDefault(require("chalk"));
const node_cron_1 = require("node-cron");
const lib_1 = require("../lib");
const PokemonRarity_1 = require("../lib/PokemonRarity");
const GymLeader_1 = require("../lib/GymLeader");
const CardData_1 = require("../lib/CardData");
const Give_1 = require("../Commands/Economy/Give");
const RoxyBrain_1 = require("../lib/RoxyBrain");
const SmashBoomLines_1 = require("../lib/SmashBoomLines");
const TeamRocket_1 = require("../lib/TeamRocket");
const PvpBattleState_1 = require("../lib/PvpBattleState");
class MessageHandler {
    constructor(client) {
        this.client = client;
        this.wild = [];
        this.chara = [];
        this.smashboom = [];
        this.wildPaused = false;
        this.cardsPaused = false;
        this.gymChallenge = new Map();
        this.gymReward = new Map();
        this.rocketRaids = new Map();
        // ─── Analytics batch buffer — flush to DB every 30s instead of per-message ──
        this._analyticsGroupTotal = new Map(); // groupJid → total msgs
        this._analyticsMemberCount = new Map(); // `groupJid|senderJid` → count
        this._flushAnalytics = async () => {
            if (this._analyticsGroupTotal.size === 0 && this._analyticsMemberCount.size === 0)
                return;
            const groupTotals = new Map(this._analyticsGroupTotal);
            const memberCounts = new Map(this._analyticsMemberCount);
            this._analyticsGroupTotal.clear();
            this._analyticsMemberCount.clear();
            // ── Group total increments — one bulkWrite instead of N updateOne calls ──
            const groupBulk = [];
            for (const [jid, count] of groupTotals) {
                groupBulk.push({
                    updateOne: {
                        filter: { jid },
                        update: { $inc: { totalMessages: count } }
                    }
                });
            }
            if (groupBulk.length > 0)
                this.client.DB.group.bulkWrite(groupBulk, { ordered: false }).catch(() => { });
            // ── Member msg counts — batch both the increment and push attempts ───────
            const memberBulkInc = [];
            const memberBulkPush = [];
            for (const [key, count] of memberCounts) {
                const [jid, senderJid] = key.split('|');
                memberBulkInc.push({
                    updateOne: {
                        filter: { jid, 'memberMsgCount.jid': senderJid },
                        update: { $inc: { 'memberMsgCount.$.count': count } }
                    }
                });
                memberBulkPush.push({ jid, senderJid, count });
            }
            if (memberBulkInc.length > 0) {
                const results = await this.client.DB.group
                    .bulkWrite(memberBulkInc, { ordered: false })
                    .catch(() => null);
                // For entries that matched nothing (new members) — push in one more bulkWrite
                if (results && results.modifiedCount < memberBulkPush.length) {
                    const pushBulk = memberBulkPush.map(({ jid, senderJid, count }) => ({
                        updateOne: {
                            filter: { jid, 'memberMsgCount.jid': { $ne: senderJid } },
                            update: { $push: { memberMsgCount: { jid: senderJid, count } } }
                        }
                    }));
                    this.client.DB.group.bulkWrite(pushBulk, { ordered: false }).catch(() => { });
                }
            }
        };
        this.startAnalyticsFlush = () => {
            setInterval(() => { this._flushAnalytics().catch(() => { }); }, 30000);
        };
        // ─── Prefix-only menu: same format as List.ts command (buttons with sections) ─
        this._buildPrefixMenuMsg = (nsfwEnabled = false) => {
            const categoryIcons = {
                general: '🌐',
                games: '🎮',
                economy: '💰',
                fun: '🎭',
                moderation: '🛡️',
                media: '🎵',
                utils: '🔧',
                weeb: '🌸',
                pokemon: '⚡',
                cards: '🃏',
                study: '📚',
                ...(nsfwEnabled ? { nsfw: '🔞' } : {})
            };
            const rows = Object.entries(categoryIcons).map(([cat, icon]) => ({
                title: `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                id: `menu:${cat}`,
                description: `Tap to view ${cat} commands`
            }));
            return {
                text: `✨ *Bot Commands Menu*\n━━━━━━━━━━━━━━━━━━━━━\nTap the button below to browse commands by category.\n\n💡 *${this.client.config.prefix}help <command>* for command details\n🔱 _Powered by RedzeoX_`,
                footer: '⚡ RedzeoX',
                title: '📚 Commands Menu',
                buttons: [
                    {
                        text: '📋 Open Menu',
                        sections: [{ title: '📂 Select a Category', rows }]
                    }
                ]
            };
        };
        // ─── WhatsApp List Menu Builder ──────────────────────────────────────────────
        this.buildMenuList = (nsfwEnabled = false) => {
            const categoryIcons = {
                general: '🌐',
                games: '🎮',
                economy: '💰',
                fun: '🎭',
                moderation: '🛡️',
                media: '🎵',
                utils: '🔧',
                weeb: '🌸',
                pokemon: '⚡',
                cards: '🃏',
                study: '📚',
                ...(nsfwEnabled ? { nsfw: '🔞' } : {})
            };
            const rows = Object.entries(categoryIcons).map(([cat, icon]) => ({
                title: `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                id: `menu:${cat}`,
                description: `Tap to view ${cat} commands`
            }));
            return {
                text: `✨ *Bot Commands Menu*\n_Select a category below to view its commands!_`,
                footer: '⚡ RedzeoX',
                buttons: [{ text: '📋 Open Menu', sections: [{ title: '📂 Select a Category', rows }] }]
            };
        };
        this.greetGroups = [];
        /** @deprecated — use prefetched groupData from handleMessage instead */
        this.getGroupLang = async (M) => {
            if (M.chat !== 'group')
                return 'en';
            try {
                const data = await this.client.DB.getGroup(M.from);
                return data.language || 'en';
            }
            catch {
                return 'en';
            }
        };
        this.spawnGymChallenge = () => {
            (0, node_cron_1.schedule)('0 */2 * * *', () => {
                if (this.wild.length < 1)
                    return void null;
                for (let i = 0; i < this.wild.length; i++) {
                    const jitter = Math.floor(Math.random() * 55 * 60 * 1000);
                    setTimeout(async () => {
                        const groupJid = this.wild[i];
                        const { wild, bot } = await this.client.DB.getGroup(groupJid);
                        if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0])
                            return void null;
                        if (!wild)
                            return void null;
                        if (this.gymChallenge.has(groupJid))
                            return void null;
                        const { type, pokemonId, level } = (0, GymLeader_1.pickGymLeader)();
                        const data = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                        if (!data)
                            return void null;
                        const image = data.sprites.other['official-artwork'].front_default;
                        const expiresAt = Date.now() + 20 * 60 * 1000;
                        this.gymChallenge.set(groupJid, { name: data.name, id: data.id, level, image, type, expiresAt });
                        const buffer = await this.client.utils.getBuffer(image);
                        await this.client.sendMessage(groupJid, {
                            image: buffer,
                            caption: `🏟️ *A GYM LEADER HAS APPEARED!* 🏟️\n\n` +
                                `${type.emoji} *Type:* ${type.type}\n` +
                                `🐉 *Pokémon:* ${this.client.utils.capitalize(data.name)}\n` +
                                `🀄 *Level:* ${level}\n\n` +
                                `⚔️ Anyone can battle! Type *${this.client.config.prefix}challenge* to take them on.\n` +
                                `⏳ This gym leader leaves in 20 minutes if undefeated.`
                        });
                    }, jitter);
                }
            });
        };
        this.spawnPokemon = async () => {
            (0, node_cron_1.schedule)('*/7 * * * *', async () => {
                if (this.wildPaused || this.wild.length < 1)
                    return void null;
                for (let i = 0; i < this.wild.length; i++) {
                    setTimeout(async () => {
                        try {
                            const { wild, bot } = await this.client.DB.getGroup(this.wild[i]);
                            if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0])
                                return void null;
                            if (!wild)
                                return void null;
                            const id = Math.floor(Math.random() * 898);
                            const data = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                            if (!data)
                                return void null;
                            const level = Math.floor(Math.random() * (30 - 15) + 15);
                            const image = data.sprites.other['official-artwork'].front_default;
                            const rarity = (0, PokemonRarity_1.getRarity)(data);
                            const meta = PokemonRarity_1.RARITY_META[rarity];
                            this.pokemonResponse.set(this.wild[i], {
                                name: data.name,
                                level,
                                image,
                                id,
                                rarity
                            });
                            const buffer = await this.client.utils.getBuffer(image);
                            const pokemonName = this.client.utils.capitalize(data.name);
                            const spawnCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                                `  🌸✿ᰰ  *${pokemonName}*  ✿ᰰ🌸\n` +
                                `      𐚁 🐾 𝑾𝒊𝒍𝒅 𝑷𝒐𝒌é𝒎𝒐𝒏 𝑨𝒑𝒑𝒆𝒂𝒓𝒆𝒅! 🐾 𐚁\n\n` +
                                `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                                `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${level}\n\n` +
                                `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                                `  𖤐 Type *${this.client.config.prefix}catch ${data.name}* to catch! 𖤐\n` +
                                `  🍃 ⁺. 5 mins left! .⁺ 🍃\n\n` +
                                `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`;
                            const sentPoke = await this.client.sendMessage(this.wild[i], {
                                image: buffer,
                                caption: spawnCaption,
                                buttonsFormat: 'buttons',
                                buttons: [
                                    { text: `⚡ Catch`, id: `${this.client.config.prefix}catch ${data.name}` },
                                    { text: `🎒 My Party`, id: `${this.client.config.prefix}party` }
                                ]
                            });
                            const pokeKey = sentPoke?.key ?? null;
                            // Auto-flee after 5 minutes
                            const pokeTimer = setTimeout(async () => {
                                this.pokemonResponse.delete(this.wild[i]);
                                this.pokemonSpawnInfo.delete(this.wild[i]);
                                if (pokeKey) {
                                    const fleeCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                                        `  🌸✿ᰰ  *${pokemonName}*  ✿ᰰ🌸\n` +
                                        `      𐚁 🐾 𝑾𝒊𝒍𝒅 𝑷𝒐𝒌é𝒎𝒐𝒏 𝑨𝒑𝒑𝒆𝒂𝒓𝒆𝒅! 🐾 𐚁\n\n` +
                                        `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                                        `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${level}\n\n` +
                                        `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                                        `  💨 ⁺. Time Out! Pokémon Fled! .⁺ 💨\n\n` +
                                        `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑭𝒍𝒆𝒅 𝑨𝒘𝒂𝒚 𖥻ִֶָ`;
                                    await this.client.sendMessage(this.wild[i], { text: fleeCaption, edit: pokeKey }).catch(() => { });
                                }
                            }, 5 * 60 * 1000);
                            this.pokemonSpawnInfo.set(this.wild[i], {
                                msgKey: pokeKey, name: data.name, level, rarity, timer: pokeTimer
                            });
                        }
                        catch (error) {
                            this.client.log(`[Wild spawn] skipped while WhatsApp is unavailable: ${error.message}`, true);
                            this.pokemonResponse.delete(this.wild[i]);
                            this.pokemonSpawnInfo.delete(this.wild[i]);
                        }
                    }, (i + 1) * 45 * 1000);
                }
            });
        };
        this.summonPokemon = async (jid, options) => {
            const i = typeof options.pokemon === 'string' ? options.pokemon.toLowerCase() : options.pokemon.toString();
            const level = options.level ? options.level : Math.floor(Math.random() * (30 - 15)) + 15;
            const data = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            if (!data?.name)
                return void (await this.client.sendMessage(jid, {
                    text: 'Invalid Pokemon name or ID'
                }));
            const image = data.sprites.other['official-artwork'].front_default;
            const rarity = (0, PokemonRarity_1.getRarity)(data);
            const meta = PokemonRarity_1.RARITY_META[rarity];
            this.pokemonResponse.set(jid, {
                name: data.name,
                level,
                image,
                id: data.id,
                rarity
            });
            const buffer = await this.client.utils.getBuffer(image);
            const pokemonName = this.client.utils.capitalize(data.name);
            const summonCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                `  🎴✿ᰰ  *${pokemonName}*  ✿ᰰ🎴\n` +
                `     𐚁 🐾 𝑾𝒊𝒍𝒅 𝑷𝒐𝒌é𝒎𝒐𝒏 🐾 𐚁\n\n` +
                `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${level}\n\n` +
                `    ─ ─ 🎴⋆͛⇢༊🎴 ─ ─\n\n` +
                `  𖤐 🎯 *${this.client.config.prefix}catch ${data.name}* 🎯 𖤐\n` +
                `  🐾 ⁺. 𝑩𝒆 𝒇𝒂𝒔𝒕 — 5 𝒎𝒊𝒏𝒔! .⁺ 🐾\n\n` +
                `  🟢 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`;
            const sentSummon = await this.client.sendMessage(jid, { image: buffer, caption: summonCaption });
            const summonKey = sentSummon?.key ?? null;
            const summonTimer = setTimeout(async () => {
                this.pokemonResponse.delete(jid);
                this.pokemonSpawnInfo.delete(jid);
                if (summonKey) {
                    const fleeCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                        `  🎴✿ᰰ  *${pokemonName}*  ✿ᰰ🎴\n` +
                        `     𐚁 🐾 𝑾𝒊𝒍𝒅 𝑷𝒐𝒌é𝒎𝒐𝒏 🐾 𐚁\n\n` +
                        `  ‧₊˚ ${meta.emoji} 𝑹𝒂𝒓𝒊𝒕𝒚  ·❀·  ${meta.label}\n` +
                        `  ‧₊˚ 🎯 𝑳𝒆𝒗𝒆𝒍   ·❀·  Lv. ${level}\n\n` +
                        `    ─ ─ 🎴⋆͛⇢༊🎴 ─ ─\n\n` +
                        `  💨 ⁺. 𝑻𝒊𝒎𝒆 𝑶𝒖𝒕! 𝑷𝒐𝒌é𝒎𝒐𝒏 𝑭𝒍𝒆𝒅! .⁺ 💨\n\n` +
                        `  🔴 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑭𝒍𝒆𝒅 𝑨𝒘𝒂𝒚 𖥻ִֶָ`;
                    await this.client.sendMessage(jid, { text: fleeCaption, edit: summonKey }).catch(() => { });
                }
            }, 5 * 60 * 1000);
            this.pokemonSpawnInfo.set(jid, { msgKey: summonKey, name: data.name, level, rarity, timer: summonTimer });
        };
        this.handleMessage = async (M) => {
            const { prefix } = this.client.config;
            const args = M.content.split(' ');
            const title = M.chat === 'group' ? M.groupMetadata?.subject || 'Group' : 'DM';
            const text = M.content;
            const persona = (0, lib_1.getPersona)(this.client.config.persona);
            // ── Prefetch group data ONCE (warm the cache; all later calls are free) ──
            const groupData = M.chat === 'group'
                ? await this.client.DB.getGroup(M.from).catch(() => null)
                : null;
            if (M.chat === 'dm' && !M.message.key?.fromMe) {
                // getFeature is now cached (2min TTL) — no MongoDB hit after first call
                this.client.DB.getFeature('chatbot').then((feature) => {
                    if (!feature.state || !text.trim())
                        return;
                    (0, lib_1.askRias)(text.trim(), M.sender.jid, this.client.config.persona)
                        .then((reply) => void M.reply(reply ? persona.chatReply(reply) : persona.chatFallback()))
                        .catch(() => M.reply(persona.chatFallback()));
                }).catch(() => { });
            }
            if (M.chat === 'group' && groupData && !M.message.key?.fromMe) {
                // ─── Auto React (uses prefetched groupData — zero extra DB call) ─────
                if (groupData.autoReact) {
                    const mode = groupData.autoReactMode || 'all';
                    M.react((0, lib_1.getRandomReactEmoji)(mode)).catch(() => { });
                }
                // ─── Auto Cute Stickers (~12% random chance per message) ──────────
                if (groupData.autoCute && Math.random() < 0.12) {
                    (0, lib_1.getCuteSticker)()
                        .then((buf) => M.reply(buf, 'sticker'))
                        .catch(() => { });
                }
                const botJid = this.client.correctJid(this.client.user?.id || '');
                const botNum = botJid.split('@')[0]; // LID vs @s.whatsapp.net mismatch handle
                const isTagged = M.mentioned.some((m) => {
                    const c = this.client.correctJid(m);
                    return c === botJid || c.split('@')[0] === botNum;
                }) ||
                    M.quoted?.key?.fromMe === true;
                let cleanText = text;
                for (const mentioned of M.mentioned)
                    cleanText = cleanText.replace(mentioned.split('@')[0], '').replace('@', '');
                cleanText = cleanText.trim();
                // ─── Bad Words Filter ────────────────────────────────────────────────
                if (groupData.badWords && groupData.badWordsList?.length) {
                    const msgLower = text.toLowerCase();
                    const badList = groupData.badWordsList || [];
                    const hasBad = badList.some(w => msgLower.includes(w.toLowerCase()));
                    if (hasBad && !M.sender.isAdmin) {
                        try {
                            await this.client.sendMessage(M.from, { delete: M.message.key });
                            await this.client.sendMessage(M.from, {
                                text: `⚠️ @${M.sender.jid.split('@')[0]} *Bad word detected!* Your message was removed.\n_Repeated violations may result in a warning._`,
                                mentions: [M.sender.jid]
                            });
                        }
                        catch { }
                        return;
                    }
                }
                // ─── Group Analytics — buffered, flushed every 30s (zero per-msg DB hit) ──
                this._analyticsGroupTotal.set(M.from, (this._analyticsGroupTotal.get(M.from) || 0) + 1);
                const memberKey = `${M.from}|${M.sender.jid}`;
                this._analyticsMemberCount.set(memberKey, (this._analyticsMemberCount.get(memberKey) || 0) + 1);
                // ─── Character Hello Trigger ────────────────────────────────────────────
                const _textLower = text.toLowerCase().trim();
                const _helloWords = ['hello', 'heyy', 'hey', 'helo', 'hii', 'hi', 'hlo', 'hy', 'hola', 'namaste'];
                const _characterMap = {
                    'rias': { persona: 'rias', name: 'Rias Gremory', greet: `Ara ara~ 😈 *Rias Gremory* yahaan hai!\nAaj main tumhari kya seva kar sakti hoon, @{{user}}?` },
                    'rias gremory': { persona: 'rias', name: 'Rias Gremory', greet: `Ara ara~ 😈 *Rias Gremory* yahaan hai!\nAaj main tumhari kya seva kar sakti hoon, @{{user}}?` },
                    'alya': { persona: 'alya', name: 'Alya Kujou', greet: `Privet! 🌸 *Alya Kujou* aa gayi!\n@{{user}}, bolo kya chahiye tumhe?` },
                    'alya kujou': { persona: 'alya', name: 'Alya Kujou', greet: `Privet! 🌸 *Alya Kujou* aa gayi!\n@{{user}}, bolo kya chahiye tumhe?` },
                    'akino': { persona: 'akino', name: 'Akino Himejima', greet: `Konnichiwa! ⚡ *Akino Himejima* ready hai!\n@{{user}}, kya help chahiye?` },
                    'akino himejima': { persona: 'akino', name: 'Akino Himejima', greet: `Konnichiwa! ⚡ *Akino Himejima* ready hai!\n@{{user}}, kya help chahiye?` },
                    'hinata': { persona: 'hinata', name: 'Hinata Hyuga', greet: `H-Hello! 💜 *Hinata* yahaan hai...\n@{{user}}, main tumhari help karungi!` },
                    'hinata hyuga': { persona: 'hinata', name: 'Hinata Hyuga', greet: `H-Hello! 💜 *Hinata* yahaan hai...\n@{{user}}, main tumhari help karungi!` },
                    'zero two': { persona: 'zerotwo', name: 'Zero Two', greet: `Hahaha! 🌹 *Zero Two* aa gayi, Darling!\n@{{user}}, bolo kya kaam hai?` },
                    'zerotwo': { persona: 'zerotwo', name: 'Zero Two', greet: `Hahaha! 🌹 *Zero Two* aa gayi, Darling!\n@{{user}}, bolo kya kaam hai?` },
                    '002': { persona: 'zerotwo', name: 'Zero Two', greet: `Hahaha! 🌹 *Zero Two* aa gayi, Darling!\n@{{user}}, bolo kya kaam hai?` },
                    'miku': { persona: 'miku', name: 'Hatsune Miku', greet: `Miku miku! 🎵 *Hatsune Miku* yahaan hai!\n@{{user}}, kaisi hoon main?` },
                    'hatsune miku': { persona: 'miku', name: 'Hatsune Miku', greet: `Miku miku! 🎵 *Hatsune Miku* yahaan hai!\n@{{user}}, kaisi hoon main?` },
                };
                const _assetMap = {
                    rias: { name: 'rias-help', type: 'image' },
                    alya: { name: 'alya-help', type: 'video', gif: true },
                    akino: { name: 'akino-help', type: 'image' },
                    hinata: { name: 'hinata-help', type: 'image' },
                    zerotwo: { name: 'zerotwo-help', type: 'image' },
                    miku: { name: 'miku-help', type: 'image' },
                };
                let _matchedChar = null;
                for (const hw of _helloWords) {
                    if (_textLower.startsWith(hw + ' ')) {
                        const rest = _textLower.slice(hw.length + 1).trim();
                        if (_characterMap[rest]) {
                            _matchedChar = _characterMap[rest];
                            break;
                        }
                    }
                }
                if (_matchedChar) {
                    const pa = _assetMap[_matchedChar.persona];
                    const asset = this.client.assets.get(pa.name);
                    const uname = M.sender.jid.split('@')[0];
                    const greetText = _matchedChar.greet.replace('{{user}}', uname);
                    if (asset) {
                        await this.client.sendMessage(M.from, {
                            [pa.type]: asset,
                            caption: greetText,
                            gifPlayback: pa.gif ?? false,
                            mentions: [M.sender.jid]
                        });
                    }
                    else {
                        await M.reply(greetText);
                    }
                    await this.client.sendMessage(M.from, this.buildMenuList(groupData?.nsfw ?? false));
                    return;
                }
                // ───────────────────────────────────────────────────────────────────────
                // ─── Beast Mode — fires on ALL non-command group messages ─────
                const beastOn = groupData.beastChat;
                if (beastOn && text.trim() && !text.trim().startsWith(prefix)) {
                    ;
                    (async () => {
                        try {
                            // ── Detect non-bot tagged members (target detection) ──────────
                            const nonBotMentions = M.mentioned.filter((m) => {
                                const num = m.split('@')[0].split(':')[0];
                                return num !== botNum;
                            });
                            let beastTarget;
                            if (nonBotMentions.length > 0) {
                                // Use raw JID exactly as WhatsApp sent it — this is what renders
                                // the proper @ContactName in chat (WhatsApp handles @lid → name itself)
                                beastTarget = { rawJid: nonBotMentions[0] };
                            }
                            await this.client.sendPresenceUpdate('composing', M.from);
                            // Tell AI a person is tagged but give NO name/number — AI prompt
                            // already says "NEVER say any phone number or numeric ID"
                            const aiTarget = beastTarget
                                ? { jid: beastTarget.rawJid, name: 'the tagged person' }
                                : undefined;
                            const reply = await (0, lib_1.getBeastReply)(M.sender.jid, text.trim(), aiTarget);
                            await (0, lib_1.beastDelay)();
                            await this.client.sendPresenceUpdate('paused', M.from);
                            if (reply) {
                                if (beastTarget) {
                                    // @{rawNum} in text → WhatsApp renders it as @ContactName
                                    // rawJid in mentions[] → tagged person gets notification
                                    const rawNum = beastTarget.rawJid.split('@')[0].split(':')[0];
                                    await this.client.sendMessage(M.from, {
                                        text: `@${rawNum} ${reply}`,
                                        mentions: [beastTarget.rawJid]
                                    });
                                }
                                else {
                                    await M.reply(reply);
                                }
                            }
                        }
                        catch (err) {
                            console.error('[BEAST] reply error:', err);
                        }
                    })();
                    return;
                }
                // ─── Study AI Mode (Roxy) — group-wide AI chat ───────────────────────
                const studyAiOn = groupData.studyAi || false;
                const studyAiMode = groupData.studyAiMode || 'all';
                const studyAiShouldReply = studyAiOn &&
                    cleanText &&
                    !text.trim().startsWith(prefix) &&
                    (studyAiMode === 'all' || (studyAiMode === 'mention' && isTagged));
                if (studyAiShouldReply) {
                    ;
                    (async () => {
                        try {
                            await this.client.sendPresenceUpdate('composing', M.from);
                            const answer = await (0, RoxyBrain_1.askRoxy)(M.sender.jid, cleanText);
                            await this.client.sendPresenceUpdate('paused', M.from);
                            if (answer)
                                await M.reply(answer);
                        }
                        catch (err) {
                            console.error('[StudyAI group]', err);
                        }
                    })();
                    return;
                }
                // ─── Group Chatbot (Rias AI) — only on @mention / reply-to-bot ──
                if (isTagged && !cleanText.startsWith(prefix)) {
                    const chatbotOn = groupData.groupChatbot;
                    if (chatbotOn && cleanText) {
                        (0, lib_1.askRias)(cleanText, M.sender.jid, this.client.config.persona)
                            .then((reply) => void M.reply(reply ? persona.chatReply(reply) : persona.chatFallback()))
                            .catch(() => M.reply(persona.chatFallback()));
                    }
                }
            }
            this.moderate(M, groupData).catch(() => { });
            // ─── Gender Button Handler ────────────────────────────────────────────────
            if (text === 'gender:male' || text === 'gender:female') {
                const gender = text === 'gender:male' ? 'male' : 'female';
                const emoji = gender === 'male' ? '👨' : '👩';
                const label = gender === 'male' ? 'Male' : 'Female';
                await this.client.DB.setGender(M.sender.jid, gender);
                return void await this.client.sendMessage(M.from, {
                    text: `🎉 *Welcome to ${this.client.config.name}!* ${emoji}\n\n` +
                        `📚 *Quick Start:*\n` +
                        `• \`${prefix}help\` — All commands\n` +
                        `• \`${prefix}profile\` — Your profile\n` +
                        `• \`${prefix}daily\` — Claim coins\n` +
                        `• \`${prefix}list\` — Browse categories\n\n` +
                        `💡 _Gender change: \`${prefix}gender\`_`,
                    footer: '⚡ RedzeoX',
                    buttons: [
                        { text: '📋 Open Menu', sections: [{ title: '📂 Select a Category', rows: Object.entries({
                                        general: '🌐', games: '🎮', economy: '💰', fun: '🎭',
                                        moderation: '🛡️', media: '🎵', utils: '🔧', weeb: '🌸', pokemon: '⚡', cards: '🃏', study: '📚',
                                        ...(groupData?.nsfw ? { nsfw: '🔞' } : {})
                                    }).map(([cat, icon]) => ({ title: `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`, id: `menu:${cat}`, description: `Tap to view ${cat} commands` })) }] }
                    ]
                });
            }
            // ─────────────────────────────────────────────────────────────────────────
            // ─── Study AI Mode Button Handler ────────────────────────────────────────
            if (text.startsWith('studyai:')) {
                if (M.chat !== 'group')
                    return;
                if (!M.sender.isAdmin && !M.sender.isMod)
                    return void M.reply(`❌ *Admin only!* Only admins can change Study AI mode.`);
                const mode = text.slice(8).toLowerCase().trim(); // 'all' | 'mention' | 'off'
                if (mode === 'off') {
                    await this.client.DB.updateGroup(M.from, 'studyAi', false);
                    return void await this.client.sendMessage(M.from, {
                        text: `🔴 *Study AI — Disabled!*\n\n` +
                            `Roxy will no longer respond to messages in this group.\n\n` +
                            `Re-enable anytime with \`${prefix}studyaimode\``,
                        footer: 'Study AI OFF',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '⚙️ Change Mode', id: `${prefix}studyaimode` }]
                    }, { quoted: M.message });
                }
                await this.client.DB.updateGroup(M.from, 'studyAi', true);
                await this.client.DB.updateGroup(M.from, 'studyAiMode', mode);
                const modeLabel = mode === 'mention' ? '📣 Mention Only' : '🟢 All Messages';
                return void await this.client.sendMessage(M.from, {
                    text: `✅ *Study AI — Enabled!* 🤖\n\n` +
                        `*Mode:* ${modeLabel}\n\n` +
                        `${mode === 'mention'
                            ? `📣 Roxy will reply when someone *@mentions the bot* in this group.`
                            : `🟢 Roxy will reply to *every message* sent in this group.`}\n\n` +
                        `Group members can now talk to Roxy without any prefix!\n` +
                        `_Example: just type "roxy photosynthesis kya hai?" freely_`,
                    footer: `Study AI ON — ${modeLabel}`,
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '⚙️ Change Mode', id: `${prefix}studyaimode` }]
                }, { quoted: M.message });
            }
            // ─────────────────────────────────────────────────────────────────────────
            // ─── Menu List Category Selection Handler ────────────────────────────────
            if (text.startsWith('menu:')) {
                const category = text.slice(5).toLowerCase().trim();
                // Block NSFW category if not enabled in this group
                if (category === 'nsfw') {
                    const nsfwAllowed = M.chat === 'group' ? (groupData?.nsfw ?? false) : false;
                    if (!nsfwAllowed)
                        return void M.reply(`🔞 *NSFW is disabled in this group.*\n\nAsk an admin to enable it first.`);
                }
                const categoryIcons = {
                    general: '🌐', games: '🎮', economy: '💰', fun: '🎭',
                    moderation: '🛡️', media: '🎵', utils: '🔧', weeb: '🌸',
                    pokemon: '⚡', cards: '🃏', study: '📚', nsfw: '🔞'
                };
                const icon = categoryIcons[category] ?? '📌';
                const cmdsInCat = Array.from(this.commands, ([, data]) => data)
                    .filter((cmd) => cmd.config.category === category);
                if (cmdsInCat.length > 0) {
                    let catText = `${icon} *${category.toUpperCase()} Commands*\n`;
                    catText += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
                    for (const cmd of cmdsInCat) {
                        catText += `├◇ \`${prefix}${cmd.name}\`\n`;
                    }
                    catText += `\n💡 *${prefix}help <command>* for details\n`;
                    catText += `🔱 _Powered by RedzeoX_`;
                    return void await M.reply(catText);
                }
                return;
            }
            // ─────────────────────────────────────────────────────────────────────────
            // ─── PvP Turn-Based Battle Handler ───────────────────────────────────────
            if (text.startsWith('pvpbattle:')) {
                const parts = text.split(':');
                const action = parts[1]; // 'attack' | 'defend'
                const battleId = parts[2];
                const moveIdx = parseInt(parts[3] ?? '0', 10);
                const battle = this.pvpBattles.get(battleId);
                if (!battle) {
                    return void await this.client.sendMessage(M.from, {
                        text: `⏰ This battle has already ended or expired.`
                    });
                }
                // Validate turn ownership
                const senderNum = M.sender.jid.split('@')[0].split(':')[0];
                const turnNum = battle.currentTurn.split('@')[0].split(':')[0];
                if (senderNum !== turnNum) {
                    return void await this.client.sendMessage(M.from, {
                        text: `⏳ It's not your turn yet! Wait for your opponent to move.`
                    });
                }
                // Clear turn timer
                if (battle.turnTimer) {
                    clearTimeout(battle.turnTimer);
                    battle.turnTimer = null;
                }
                const attackerJid = battle.currentTurn;
                const defenderJid = attackerJid === battle.p1Jid ? battle.p2Jid : battle.p1Jid;
                const attacker = battle.players.get(attackerJid);
                const defender = battle.players.get(defenderJid);
                let actionLine = '';
                if (action === 'defend') {
                    attacker.isDefending = true;
                    actionLine =
                        `🛡️ *${attacker.username}* used *Defend!*\n` +
                            `_Next incoming attack will deal 50% less damage._`;
                }
                else {
                    // attack
                    const move = attacker.moves[moveIdx] ?? attacker.moves[0];
                    const dmg = (0, PvpBattleState_1.calcDamage)(move, attacker.pokemonLevel, defender.isDefending);
                    const shieldNote = defender.isDefending ? ` *(Shield blocked half!)*` : ``;
                    defender.hp = Math.max(0, defender.hp - dmg);
                    attacker.isDefending = false;
                    defender.isDefending = false;
                    actionLine =
                        `${move.emoji} *${attacker.username}* used *${move.name}!*\n` +
                            `💥 ${this.client.utils.capitalize(defender.pokemonName)} took *-${dmg} damage*!${shieldNote}`;
                }
                // ── Check winner ──────────────────────────────────────────────────
                if (defender.hp <= 0) {
                    await this.persistBattleDamage(defenderJid, defender.pokemonName, defender.hp, defender.maxHp);
                    this.pvpBattles.delete(battleId);
                    const prizeCoins = Math.floor(Math.random() * 300) + 200;
                    await Promise.allSettled([
                        this.client.DB.setCrystal(attacker.jid, prizeCoins),
                        this.client.DB.setCrystal(defender.jid, -Math.min(100, prizeCoins / 2))
                    ]);
                    const resultText = `${actionLine}\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `🏆 *BATTLE OVER!* 🏆\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `🥇 *${attacker.username}* wins!\n` +
                        `   ${this.client.utils.capitalize(attacker.pokemonName)} defeated ${this.client.utils.capitalize(defender.pokemonName)}!\n\n` +
                        `💰 *+${prizeCoins} coins* awarded to ${attacker.username}\n` +
                        `📉 ${defender.username} lost some coins.\n\n` +
                        `💡 Use *${prefix}pvp @user* to challenge again!`;
                    return void await this.client.sendMessage(M.from, {
                        text: resultText,
                        footer: '⚔️ PvP Battle'
                    });
                }
                await this.persistBattleDamage(defenderJid, defender.pokemonName, defender.hp, defender.maxHp);
                // ── Switch turns ──────────────────────────────────────────────────
                battle.currentTurn = defenderJid;
                const p1 = battle.players.get(battle.p1Jid);
                const p2 = battle.players.get(battle.p2Jid);
                const next = battle.players.get(battle.currentTurn);
                const statusText = `${actionLine}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `⚔️ *BATTLE STATUS*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `🟢 *${p1.username}* — ${this.client.utils.capitalize(p1.pokemonName)} (Lv.${p1.pokemonLevel})\n` +
                    `   ${(0, PvpBattleState_1.hpBar)(p1.hp, p1.maxHp)}\n\n` +
                    `🔴 *${p2.username}* — ${this.client.utils.capitalize(p2.pokemonName)} (Lv.${p2.pokemonLevel})\n` +
                    `   ${(0, PvpBattleState_1.hpBar)(p2.hp, p2.maxHp)}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `🎮 @${battle.currentTurn.split('@')[0]}'s turn! *(90s)*\n` +
                    `Choose your move 👇`;
                await this.client.sendMessage(M.from, {
                    text: statusText,
                    footer: '⚔️ PvP Battle',
                    mentions: [battle.currentTurn],
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: `${next.moves[0].emoji} ${next.moves[0].name} (${next.moves[0].power} PWR)`, id: `pvpbattle:attack:${battleId}:0` },
                        { text: `${next.moves[1].emoji} ${next.moves[1].name} (${next.moves[1].power} PWR)`, id: `pvpbattle:attack:${battleId}:1` },
                        { text: `🛡️ Defend`, id: `pvpbattle:defend:${battleId}` }
                    ]
                });
                // Reset turn timer
                battle.turnTimer = setTimeout(() => {
                    if (this.pvpBattles.get(battleId)?.currentTurn === battle.currentTurn) {
                        this.pvpBattles.delete(battleId);
                        this.client.sendMessage(M.from, {
                            text: `⏰ *Battle timed out!*\n\n` +
                                `*${next.username}* took too long to respond.\n` +
                                `The battle has been cancelled. ❌`
                        }).catch(() => { });
                    }
                }, 90000);
                return;
            }
            // ─────────────────────────────────────────────────────────────────────────
            // ── Roxy awaiting-state intercept + prefix-free Roxy chat ────────────────
            if (!args[0] || !args[0].startsWith(prefix)) {
                // Use M.content (already properly extracted for all msg types incl. groups)
                const rawTrimmed = text.trim();
                // 1. Awaiting state: onboarding YES/NO/GRADE replies (highest priority)
                if (RoxyBrain_1.roxyAwaitingUsers.has(M.sender.jid)) {
                    if (rawTrimmed) {
                        await (0, RoxyBrain_1.handleRoxyReply)(M.sender.jid, rawTrimmed, (t) => M.reply(t)).catch(() => { });
                    }
                    return void this.client.log(`${chalk_1.default.cyanBright('Roxy-await')} from ${chalk_1.default.yellowBright(M.sender.username)}`);
                }
                // 2. Prefix-free Roxy trigger: "roxy <question>" or "roxie <question>"
                const rawLower = rawTrimmed.toLowerCase();
                const roxyTrigger = ['roxy', 'roxie'].find((t) => rawLower === t || rawLower.startsWith(t + ' '));
                if (roxyTrigger && rawTrimmed) {
                    const question = rawTrimmed.slice(roxyTrigger.length).trim();
                    (async () => {
                        try {
                            const profile = (0, RoxyBrain_1.getProfile)(M.sender.jid);
                            // New user — start onboarding
                            if (profile.state === 'new') {
                                (0, RoxyBrain_1.updateProfile)(M.sender.jid, { state: 'awaiting_student' });
                                const lang = (0, RoxyBrain_1.detectLang)(question || 'hello');
                                await this.client.sendMessage(M.from, {
                                    text: (0, RoxyBrain_1.ROXY_INTRO)(prefix, lang),
                                    footer: lang === 'hi' ? 'Student ho ya nahi?' : 'Are you a student?',
                                    buttonsFormat: 'buttons',
                                    buttons: [
                                        { text: lang === 'hi' ? '✅ Haan, Student Hun' : '✅ Yes, I\'m a Student', id: `${prefix}roxy yes` },
                                        { text: lang === 'hi' ? '❌ Nahi' : '❌ No, I\'m Not', id: `${prefix}roxy no` }
                                    ]
                                }, { quoted: M.message });
                                return;
                            }
                            // No question given — hint
                            if (!question) {
                                await M.reply(`🌟 *Hey! Main hun Roxy!* 😊\n\n` +
                                    `Seedha sawaal poochho — koi bhi subject, koi bhi topic! 📚\n` +
                                    `_Example: "roxy photosynthesis kya hai?"_`);
                                return;
                            }
                            if (question.length > 800) {
                                await M.reply(`❌ Message bahut lamba hai! 800 se kam rakho. 😊`);
                                return;
                            }
                            await this.client.sendPresenceUpdate('composing', M.from);
                            const answer = await (0, RoxyBrain_1.askRoxy)(M.sender.jid, question);
                            await this.client.sendPresenceUpdate('paused', M.from);
                            if (answer) {
                                await this.client.sendMessage(M.from, {
                                    text: `🌟 *Roxy*\n\n${answer}\n\n_⚡ RedzeoX × Groq_`,
                                    footer: 'Roxy — AI Study Assistant',
                                    buttonsFormat: 'buttons',
                                    buttons: [
                                        { text: '🔁 Ask Again', id: `${prefix}roxy ` },
                                        { text: '👤 Profile', id: `${prefix}roxy profile` }
                                    ]
                                }, { quoted: M.message });
                            }
                            else {
                                await M.reply(`😔 Roxy abhi thodi busy hai, thodi der baad try karo! 🙏`);
                            }
                        }
                        catch (err) {
                            console.error('[Roxy free-chat]', err);
                        }
                    })();
                    return void this.client.log(`${chalk_1.default.cyanBright('Roxy-free')} from ${chalk_1.default.yellowBright(M.sender.username)} in ${chalk_1.default.blueBright(title)}`);
                }
                return void this.client.log(`${chalk_1.default.cyanBright('Message')} from ${chalk_1.default.yellowBright(M.sender.username)} in ${chalk_1.default.blueBright(title)}`);
            }
            this.client.log(`${chalk_1.default.cyanBright(`Command ${args[0]}[${args.length - 1}]`)} from ${chalk_1.default.yellowBright(M.sender.username)} in ${chalk_1.default.blueBright(`${title}`)}`);
            const cmd = args[0].toLowerCase().slice(prefix.length);
            // ── Prefix-only (blank cmd) → Odyssey-style welcome card + intro video ──
            if (cmd === '') {
                const nsfwOn = M.chat === 'group' ? (groupData?.nsfw ?? false) : false;
                const menuRows = Object.entries({
                    general: '🌐', games: '🎮', economy: '💰', fun: '🎭',
                    moderation: '🛡️', media: '🎵', utils: '🔧', weeb: '🌸',
                    pokemon: '⚡', cards: '🃏', study: '📚',
                    ...(nsfwOn ? { nsfw: '🔞' } : {})
                }).map(([cat, icon]) => ({
                    title: `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                    id: `menu:${cat}`,
                    description: `Tap to view ${cat} commands`
                }));
                const activePersona = this.client.config.persona;
                const personaName = (0, lib_1.getPersonaName)(this.client.config.persona);
                const personaEmoji = { rias: '👑', alya: '❄️', akino: '🏯', hinata: '💜', zerotwo: '🌺', miku: '🎤' }[activePersona] ?? '🌸';
                const personaTitle = { rias: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑷𝒆𝒆𝒓𝒂𝒈𝒆', alya: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑲𝒖𝒋𝒐𝒖 𝑾𝒐𝒓𝒍𝒅', akino: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑯𝒊𝒎𝒆𝒋𝒊𝒎𝒂 𝑪𝒍𝒂𝒏', hinata: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑯𝒚𝒖𝒈𝒂 𝑪𝒍𝒂𝒏', zerotwo: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑺𝒒𝒖𝒂𝒅 𝟏𝟑', miku: '𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝒕𝒉𝒆 𝑪𝒐𝒏𝒄𝒆𝒓𝒕' }[activePersona] ?? '𝑾𝒆𝒍𝒄𝒐𝒎𝒆';
                const personaQuote = { rias: 'Ara ara~ Stay close~', alya: 'Apni limits mein raho~', akino: 'Fufufu~ Watching over you~', hinata: 'A-ano... Nice to meet~', zerotwo: 'For the ride, Darling~', miku: 'Enjoy the show~' }[activePersona] ?? 'Welcome~';
                const welcomeCard = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                    `  🌸✿ᰰ  *${M.sender.username}*  ✿ᰰ🌸\n` +
                    `      𐚁 ${personaTitle} 𐚁\n` +
                    `  🍃 ⁺. 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒚𝒑𝒆 ${prefix}𝑯𝒆𝒍𝒑 .⁺ 🍃\n\n` +
                    `  ꒰ ✦ 𝑴𝒂𝒚 𝒚𝒐𝒖𝒓 𝑶𝒅𝒚𝒔𝒔𝒆𝒚 𝒃𝒆𝒈𝒊𝒏~ ✦ ꒱`;
                try {
                    const introVideo = (0, lib_1.getRandomIntroVideo)();
                    if (!introVideo)
                        throw new Error('No intro videos found on disk');
                    const videoBuf = introVideo.buffer;
                    return void await this.client.sendMessage(M.from, {
                        video: videoBuf,
                        caption: welcomeCard,
                        gifPlayback: true,
                        mimetype: 'video/mp4',
                        footer: `⚡ RedzeoX — ${personaName}`,
                        buttons: [
                            { text: '📋 Open Menu', sections: [{ title: '📂 Select a Category', rows: menuRows }] }
                        ]
                    });
                }
                catch (err) {
                    this.client.log(`[Intro video] failed: ${err.message}`, true);
                    return void await this.client.sendMessage(M.from, {
                        text: welcomeCard,
                        footer: `⚡ RedzeoX — ${personaName}`,
                        buttons: [
                            { text: '📋 Open Menu', sections: [{ title: '📂 Select a Category', rows: menuRows }] }
                        ]
                    });
                }
            }
            const command = this.commands.get(cmd) || this.aliases.get(cmd);
            if (!command)
                return void M.reply(persona.commandNotFound());
            // ── Single parallel fetch: user + disabled commands ───────────────────────
            // groupData already prefetched above — lang derived in-memory, zero extra DB call
            const [user, disabledCommands] = await Promise.all([
                this.client.DB.getUser(M.sender.jid),
                this.client.DB.getDisabledCommands()
            ]);
            if (user.banned)
                return void M.reply(persona.banned());
            if (!user.tag)
                this.client.DB.updateUser(M.sender.jid, 'tag', 'set', this.client.utils.generateRandomUniqueTag()).catch(() => { });
            // ── Gender Gate — user must select gender before using any command ──────────
            const GENDER_BYPASS = ['gender', 'setgender', 'mygender', 'start', 'help', 'botinfo'];
            if (!user.gender && !GENDER_BYPASS.includes(cmd)) {
                return void await this.client.sendMessage(M.from, {
                    text: `✦ ───────────── ✦\n` +
                        `    🌸 *WELCOME SETUP* 🌸\n` +
                        `✦ ───────────── ✦\n\n` +
                        `Hey *${M.sender.username}*!\n\n` +
                        `Before you begin your journey,\n` +
                        `tell me — who are you? ✨\n\n` +
                        `✦ ───────────── ✦`,
                    footer: '⚡ RedzeoX',
                    buttons: [
                        {
                            text: '🚻 Select Gender',
                            sections: [
                                {
                                    title: '👤 Choose Your Gender',
                                    rows: [
                                        { title: '🤵 Male', id: 'gender:male', description: 'Set your gender to Male' },
                                        { title: '👰 Female', id: 'gender:female', description: 'Set your gender to Female' }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            }
            // ─────────────────────────────────────────────────────────────────────────
            const BYPASS_DISABLE = ['repo', 'script', 'botinfo', 'source'];
            const index = disabledCommands.findIndex((CMD) => CMD.command === command.name);
            if (index >= 0 && !BYPASS_DISABLE.includes(command.name) && !BYPASS_DISABLE.includes(cmd))
                return void M.reply(`*${this.client.utils.capitalize(cmd)}* is currently disabled by *${disabledCommands[index].disabledBy}* in *${disabledCommands[index].time} (GMT)*. ❓ *Reason:* ${disabledCommands[index].reason}`);
            // ── Language — derived from prefetched groupData, NO extra DB call ────────
            const lang = groupData?.language || 'en';
            const p = this.client.config.prefix;
            if (command.config.casino && M.from !== this.client.config.casinoGroup && !groupData?.casino)
                return void M.reply((0, lib_1.t)('casino_only', lang, { p }));
            const senderJid = this.client.correctJid(M.sender.jid);
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === senderJid);
            if (command.config.category === 'dev' && !isMod)
                return void M.reply((0, lib_1.t)('mods_only', lang));
            if (M.chat === 'dm' && !command.config.dm)
                return void M.reply((0, lib_1.t)('group_only', lang));
            if (command.config.category === 'moderation' && !M.sender.isAdmin && !isMod)
                return void M.reply((0, lib_1.t)('admin_only', lang));
            // ── NSFW check — prefetched groupData, NO extra DB call ──────────────────
            if (command.config.category === 'nsfw') {
                if (!groupData?.nsfw)
                    return void M.reply((0, lib_1.t)('nsfw_only', lang));
            }
            const cooldownAmount = (command.config.cooldown ?? 2) * 1000;
            // ── Cooldown bypass: give command amount-selection flow ───────────────────
            const isGiveAmountResponse = command.name === 'give'
                && M.numbers.length >= 1
                && !M.mentioned.length
                && Give_1.pendingGives.has(M.sender.jid)
                && Date.now() < (Give_1.pendingGives.get(M.sender.jid)?.expiresAt ?? 0);
            if (!isGiveAmountResponse && this.cooldowns.has(`${M.sender.jid}${command.name}`)) {
                const cd = this.cooldowns.get(`${M.sender.jid}${command.name}`);
                const remainingTime = this.client.utils.convertMs(cd - Date.now());
                return void M.reply((0, lib_1.t)('cooldown', lang, { time: String(remainingTime) }));
            }
            this.cooldowns.set(`${M.sender.jid}${command.name}`, cooldownAmount + Date.now());
            setTimeout(() => this.cooldowns.delete(`${M.sender.jid}${command.name}`), cooldownAmount);
            Promise.all([
                this.client.DB.setExp(M.sender.jid, command.config.exp || 10),
                this.handleUserStats(M, user)
            ]).catch(() => { });
            // ── Track command usage per user (fire-and-forget, zero latency) ─────────
            this.client.DB.trackCommandUsage(M.sender.jid, command.name).catch(() => { });
            // Fire composing presence without awaiting — no extra latency before command runs
            this.client.sendPresenceUpdate('composing', M.from).catch(() => { });
            try {
                await command.execute(M, this.formatArgs(args));
            }
            catch (error) {
                this.client.log(error.message, true);
                M.reply(`❌ *An error occurred while running this command.*\n\n_If this keeps happening, report it with *${this.client.config.prefix}bugreport*_`).catch(() => { });
            }
            finally {
                this.client.sendPresenceUpdate('paused', M.from).catch(() => { });
            }
        };
        this.spawnRocketRaid = () => {
            // Runs every 3 hours — 30% chance to raid each wild-enabled group
            (0, node_cron_1.schedule)('0 */3 * * *', async () => {
                if (this.wild.length < 1)
                    return;
                for (let i = 0; i < this.wild.length; i++) {
                    if (Math.random() > 0.30)
                        continue; // 30% chance per group per cycle
                    const jitter = Math.floor(Math.random() * 40 * 60 * 1000); // 0-40 min offset
                    setTimeout(async () => {
                        const groupJid = this.wild[i];
                        try {
                            const { wild, bot } = await this.client.DB.getGroup(groupJid);
                            if (!wild)
                                return;
                            if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0])
                                return;
                            if (this.rocketRaids.has(groupJid))
                                return; // raid already active
                            // Get group participants
                            const meta = await this.client.groupMetadata(groupJid).catch(() => null);
                            if (!meta || meta.participants.length < 2)
                                return;
                            // Shuffle participants, try up to 10 to find a victim with party Pokémon
                            const shuffled = [...meta.participants].sort(() => Math.random() - 0.5);
                            let victimJid = '';
                            let stolenPokemon = null;
                            for (const p of shuffled.slice(0, 10)) {
                                if (this.client.correctJid(p.id) === this.client.correctJid(this.client.user?.id || ''))
                                    continue;
                                try {
                                    const user = await this.client.DB.getUser(p.id);
                                    if (user.party && user.party.length > 0) {
                                        victimJid = p.id;
                                        stolenPokemon = user.party[0];
                                        // Remove from party immediately
                                        const newParty = user.party.slice(1);
                                        await this.client.DB.user.updateOne({ jid: victimJid }, { $set: { party: newParty } });
                                        this.client.DB.cacheInvalidate(`user:${victimJid}`);
                                        break;
                                    }
                                }
                                catch {
                                    continue;
                                }
                            }
                            if (!victimJid || !stolenPokemon)
                                return;
                            const rocket = (0, TeamRocket_1.getRocketMember)();
                            const requiredDamage = 400 + Math.floor(Math.random() * 301); // 400–700
                            const victimName = victimJid.split('@')[0];
                            const pokeName = this.client.utils.capitalize(stolenPokemon.name);
                            const raidAppearImg = this.client.assets.get('rocket-raid-appear');
                            const caption = `🚀 *TEAM ROCKET APPEARED!* 🚀\n\n` +
                                `${rocket.emoji} *${rocket.name}:*\n${rocket.taunt}\n\n` +
                                `😱 *@${victimName}'s ${pokeName} has been stolen!*\n\n` +
                                `━━━━━━━━━━━━━━━━\n` +
                                `⚔️ *Fight together to get it back!*\n` +
                                `💢 Damage needed: *${requiredDamage}*\n` +
                                `⏳ Time limit: *5 minutes*\n` +
                                `━━━━━━━━━━━━━━━━\n\n` +
                                `▸ Type *${this.client.config.prefix}fight* to attack\n` +
                                `▸ Each trainer fights *once*\n` +
                                `▸ Higher Pokémon level = more damage\n` +
                                `▸ All fighters get *+50 Crystals* on win\n\n` +
                                `[▱▱▱▱▱▱▱▱▱▱] 0%\n` +
                                `🔴 *Status: Active Raid!*`;
                            let sentMsg = null;
                            try {
                                sentMsg = raidAppearImg
                                    ? await this.client.sendMessage(groupJid, { image: raidAppearImg, caption, mentions: [victimJid] })
                                    : await this.client.sendMessage(groupJid, { text: caption, mentions: [victimJid] });
                            }
                            catch {
                                // If message fails, return Pokémon to victim
                                await this.client.DB.user.updateOne({ jid: victimJid }, { $push: { party: stolenPokemon } }).catch(() => { });
                                return;
                            }
                            const timer = setTimeout(async () => {
                                const raid = this.rocketRaids.get(groupJid);
                                if (!raid)
                                    return;
                                this.rocketRaids.delete(groupJid);
                                if (raid.spawnMsgKey) {
                                    this.client.sendMessage(groupJid, {
                                        text: `🚀 *TEAM ROCKET ESCAPED!* 🚀\n\n` +
                                            `${rocket.emoji} *${rocket.name}:* "Looks like Team Rocket's blasting off again!"\n\n` +
                                            `💔 *${pokeName}* is gone forever...\n` +
                                            `💥 Final damage: ${raid.totalDamage}/${raid.requiredDamage}\n` +
                                            `🔴 *Status: Raid Failed*`,
                                        edit: raid.spawnMsgKey,
                                        mentions: [victimJid]
                                    }).catch(() => { });
                                }
                                // Team Rocket wins — use celebration image
                                const rocketWinImg = this.client.assets.get('rocket-raid-win');
                                const failCaption = `💀 *RAID FAILED!*\n\n` +
                                    `Team Rocket got away with @${victimName}'s *${pokeName}*!\n` +
                                    `⚔️ Total damage: ${raid.totalDamage}/${raid.requiredDamage}\n\n` +
                                    `_Train harder and beat them next time!_ 💪`;
                                (rocketWinImg
                                    ? this.client.sendMessage(groupJid, { image: rocketWinImg, caption: failCaption, mentions: [victimJid] })
                                    : this.client.sendMessage(groupJid, { text: failCaption, mentions: [victimJid] })).catch(() => { });
                                // ── Send random loss GIF for raiders who failed ──
                                const LOSE_KEYS = ['lose-1', 'lose-2', 'lose-3', 'lose-4', 'lose-5', 'lose-6', 'lose-7', 'lose-8', 'lose-9', 'lose-10', 'lose-11', 'lose-12'];
                                const loseGifBuf = this.client.assets.get(LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]);
                                if (loseGifBuf)
                                    this.client.utils.gifToMp4(loseGifBuf).then(mp4 => this.client.sendMessage(groupJid, { video: mp4, gifPlayback: true, mimetype: 'video/mp4' })).catch(() => { });
                            }, 5 * 60 * 1000);
                            this.rocketRaids.set(groupJid, {
                                victimJid,
                                victimName,
                                stolenPokemon,
                                totalDamage: 0,
                                requiredDamage,
                                fighters: new Map(),
                                expiresAt: Date.now() + 5 * 60 * 1000,
                                rocketMember: rocket,
                                spawnMsgKey: sentMsg?.key ?? null,
                                timer
                            });
                        }
                        catch { }
                    }, jitter);
                }
            });
        };
        this.startRocketRaids = () => {
            this.spawnRocketRaid();
            this.client.log(`${chalk_1.default.magentaBright('Team Rocket')} raid system started 🚀`);
        };
        this.loadWildEnabledGroups = async () => {
            const groupJids = !this.groups ? await this.client.getAllGroups() : this.groups;
            const allDocs = await this.client.DB.group.find({ jid: { $in: groupJids }, wild: true }).lean();
            const enabledJids = new Set(allDocs.map((d) => d.jid));
            for (const jid of groupJids) {
                if (enabledJids.has(jid))
                    this.wild.push(jid);
            }
            this.client.log(`Successfully loaded ${chalk_1.default.blueBright(`${this.wild.length}`)} ${this.wild.length > 1 ? 'groups' : 'group'} which has enabled wild`);
            await this.spawnPokemon();
            this.spawnGymChallenge();
        };
        this.loadCharaEnabledGroups = async () => {
            const groupJids = !this.groups ? await this.client.getAllGroups() : this.groups;
            const allDocs = await this.client.DB.group.find({ jid: { $in: groupJids }, chara: true }).lean();
            const enabledJids = new Set(allDocs.map((d) => d.jid));
            for (const jid of groupJids) {
                if (enabledJids.has(jid))
                    this.chara.push(jid);
            }
            this.client.log(`Successfully loaded ${chalk_1.default.blueBright(`${this.chara.length}`)} ${this.chara.length > 1 ? 'groups' : 'group'} which has enabled card spawning`);
            await this.spawnCard();
        };
        this.loadSmashBoomGroups = async () => {
            const groupJids = !this.groups ? await this.client.getAllGroups() : this.groups;
            const allDocs = await this.client.DB.group.find({ jid: { $in: groupJids }, smashboom: true }).lean();
            const enabledJids = new Set(allDocs.map((d) => d.jid));
            for (const jid of groupJids) {
                if (enabledJids.has(jid))
                    this.smashboom.push(jid);
            }
            this.client.log(`Successfully loaded ${chalk_1.default.blueBright(`${this.smashboom.length}`)} ${this.smashboom.length > 1 ? 'groups' : 'group'} which has enabled smashboom`);
            this.spawnSmashBoom();
        };
        this.spawnSmashBoom = () => {
            setInterval(async () => {
                if (this.smashboom.length < 1)
                    return void null;
                for (let i = 0; i < this.smashboom.length; i++) {
                    setTimeout(async () => {
                        const jid = this.smashboom[i];
                        try {
                            const data = await this.client.DB.getGroup(jid);
                            if (!data.smashboom)
                                return void null;
                            if (data.bot !== 'all' && data.bot !== this.client.config.name.split(' ')[0])
                                return void null;
                            const meta = await this.client.groupMetadata(jid);
                            const botId = this.client.correctJid(this.client.user?.id || '');
                            const participants = meta.participants.filter((p) => this.client.correctJid(p.id) !== botId);
                            if (!participants.length)
                                return void null;
                            const target = participants[Math.floor(Math.random() * participants.length)];
                            const line = SmashBoomLines_1.SMASHBOOM_LINES[Math.floor(Math.random() * SmashBoomLines_1.SMASHBOOM_LINES.length)];
                            await this.client.sendMessage(jid, {
                                text: `@${target.id.split('@')[0]} ${line}`,
                                mentions: [target.id]
                            });
                        }
                        catch {
                            // ignore — group may have been deleted or bot removed
                        }
                    }, i * 100); // stagger groups by 0.1s each in test mode
                }
            }, 1000); // every 1 second in test mode
        };
        // ─── Birthday Cron ───────────────────────────────────────────────────────
        this.startBirthdayCron = () => {
            (0, node_cron_1.schedule)('0 8 * * *', async () => {
                const today = new Date();
                const ddmm = today.getDate() * 100 + (today.getMonth() + 1);
                const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const dateStr = `${today.getDate()} ${MONTHS[today.getMonth()]}`;
                const users = await this.client.DB.user.find({ birthday: ddmm }).catch(() => []);
                // Fetch all groups bot is in (for group announcements)
                let allGroups = {};
                try {
                    allGroups = await this.client.groupFetchAllParticipating();
                }
                catch { /* ignore */ }
                for (const user of users) {
                    const jid = user.jid;
                    // Give gold reward
                    try {
                        await this.client.DB.setCrystal(jid, 2000, 'wallet');
                    }
                    catch { /* ignore */ }
                    // ── Group Announcements (only groups with birthday flag ON) ───
                    for (const [groupJid, meta] of Object.entries(allGroups)) {
                        const isMember = meta.participants.some((p) => p.id === jid);
                        if (!isMember)
                            continue;
                        try {
                            const groupData = await this.client.DB.getGroup(groupJid);
                            if (!groupData.birthday)
                                continue;
                            await this.client.sendMessage(groupJid, {
                                text: `🎂 *HAPPY BIRTHDAY!* 🎉\n\n` +
                                    `🥳 Let's all wish @${jid.split('@')[0]} a very *Happy Birthday!*\n` +
                                    `📅 *${dateStr}* — A special day! 🌟\n` +
                                    `🎁 They received *+2000 Gold* as a birthday gift!\n\n` +
                                    `_Wish them below!_ 👇`,
                                mentions: [jid]
                            });
                        }
                        catch { /* Group message might fail */ }
                    }
                }
                if (users.length > 0)
                    this.client.log(`[BIRTHDAY] Wished ${users.length} user(s) on ${dateStr}`);
            });
        };
        // ─── Loan EMI Cron ────────────────────────────────────────────────────────
        // Runs every 5 hours. For every user whose EMI is due:
        //   ✅ Enough funds  → deduct EMI (bank first, then wallet), reduce remaining
        //   ❌ Can't pay     → apply 20% penalty on remaining, push next EMI window
        this.startLoanEmiCron = () => {
            (0, node_cron_1.schedule)('0 */5 * * *', async () => {
                this.client.log(chalk_1.default.blueBright('[LOAN EMI]') + ' Running EMI collection cycle...');
                try {
                    const dueUsers = await this.client.DB.getDueLoanUsers();
                    if (dueUsers.length === 0)
                        return void null;
                    for (const user of dueUsers) {
                        const { jid, bank, wallet, loan } = user;
                        if (!loan?.active)
                            continue;
                        const { emiAmount, remaining, emisPaid, penaltyCount } = loan;
                        const totalAvailable = (bank ?? 0) + (wallet ?? 0);
                        if (totalAvailable >= emiAmount) {
                            // ✅ Deduct EMI — bank first, then wallet
                            let toPay = emiAmount;
                            const bankDeduct = Math.min(bank ?? 0, toPay);
                            toPay -= bankDeduct;
                            const walletDeduct = Math.min(wallet ?? 0, toPay);
                            if (bankDeduct > 0)
                                await this.client.DB.setCrystal(jid, -bankDeduct, 'bank');
                            if (walletDeduct > 0)
                                await this.client.DB.setCrystal(jid, -walletDeduct, 'wallet');
                            const newRemaining = remaining - emiAmount;
                            const newEmisPaid = emisPaid + 1;
                            await this.client.DB.updateLoanAfterEmi(jid, newRemaining, newEmisPaid, penaltyCount);
                            const cleared = newRemaining <= 0;
                            const phone = jid.split('@')[0];
                            if (cleared) {
                                this.client.log(chalk_1.default.green(`[LOAN EMI] Loan CLEARED for ${phone}`));
                                try {
                                    await this.client.sendMessage(jid, {
                                        text: `🎉 *LOAN CLEARED!* 🎉\n` +
                                            `${'═'.repeat(28)}\n\n` +
                                            `✅ Your loan has been *fully repaid!*\n` +
                                            `💸 Final EMI of *${emiAmount.toLocaleString()} 💰* deducted.\n\n` +
                                            `🏆 You are now *debt-free!*\n` +
                                            `_Need more gold? Use \`${this.client.config.prefix}loan\` anytime._`
                                    });
                                }
                                catch { /* DM might fail — ignore */ }
                            }
                            else {
                                this.client.log(chalk_1.default.yellow(`[LOAN EMI] EMI deducted ${emiAmount} from ${phone} | Remaining: ${newRemaining}`));
                                try {
                                    await this.client.sendMessage(jid, {
                                        text: `🏦 *LOAN EMI DEDUCTED*\n` +
                                            `${'─'.repeat(28)}\n\n` +
                                            `💸 *EMI Paid:* ${emiAmount.toLocaleString()} 💰\n` +
                                            `   (Bank: ${bankDeduct.toLocaleString()} + Wallet: ${walletDeduct.toLocaleString()})\n\n` +
                                            `🔴 *Remaining:* ${newRemaining.toLocaleString()} 💰\n` +
                                            `📊 *Progress:* ${newEmisPaid}/${loan.totalEmis} EMIs done\n\n` +
                                            `⏰ *Next EMI in 5 hours*\n` +
                                            `_Use \`${this.client.config.prefix}myloan\` to track your loan_`
                                    });
                                }
                                catch { /* DM might fail — ignore */ }
                            }
                        }
                        else {
                            // ❌ Cannot pay — apply 20% penalty
                            const penalty = Math.ceil(remaining * 0.2);
                            const newRemaining = remaining + penalty;
                            await this.client.DB.updateLoanAfterPenalty(jid, newRemaining, penaltyCount + 1);
                            const phone = jid.split('@')[0];
                            this.client.log(chalk_1.default.red(`[LOAN EMI] Penalty applied to ${phone} | +${penalty} | New remaining: ${newRemaining}`));
                            try {
                                await this.client.sendMessage(jid, {
                                    text: `⚠️ *LOAN EMI MISSED — PENALTY APPLIED!*\n` +
                                        `${'═'.repeat(28)}\n\n` +
                                        `😓 You didn't have enough gold for your EMI!\n\n` +
                                        `💸 *EMI Due:*       ${emiAmount.toLocaleString()} 💰\n` +
                                        `💳 *Your Balance:*  ${totalAvailable.toLocaleString()} 💰\n\n` +
                                        `🔴 *Old Remaining:* ${remaining.toLocaleString()} 💰\n` +
                                        `➕ *Penalty (20%):* +${penalty.toLocaleString()} 💰\n` +
                                        `🆕 *New Remaining:* ${newRemaining.toLocaleString()} 💰\n\n` +
                                        `${'─'.repeat(28)}\n` +
                                        `⚠️ Penalties keep stacking! Keep your balance topped up.\n` +
                                        `💡 Use \`${this.client.config.prefix}loanpay <amount>\` to pay manually.`
                                });
                            }
                            catch { /* DM might fail — ignore */ }
                        }
                    }
                }
                catch (err) {
                    this.client.log(chalk_1.default.red('[LOAN EMI] Cron error: ' + err));
                }
            });
            this.client.log(chalk_1.default.blueBright('[LOAN EMI]') + ' EMI cron scheduled (every 5 hours)');
        };
        this.spawnDxDGreetings = () => {
            const sendGreeting = async (kind) => {
                const groups = !this.groups ? await this.client.getAllGroups() : this.groups;
                // ── Parallel: fetch all group settings at once, then send concurrently ──
                await Promise.allSettled(groups.map(async (group) => {
                    try {
                        const data = await this.client.DB.getGroup(group);
                        if (!data.dxdGreetings)
                            return;
                        const { character, line } = (0, lib_1.getRandomGreeting)(kind);
                        await this.client.sendMessage(group, { text: `🐉 *${character}:*\n"${line}"` });
                    }
                    catch {
                        // group unreachable/left — ignore aur aage badho
                    }
                }));
            };
            const tz = { timezone: 'Asia/Kolkata' };
            // ☀️ Good Morning ~7:00 AM IST
            (0, node_cron_1.schedule)('0 7 * * *', () => void sendGreeting('morning'), tz);
            // 🌤️ Good Afternoon ~1:00 PM IST
            (0, node_cron_1.schedule)('0 13 * * *', () => void sendGreeting('afternoon'), tz);
            // 🌇 Good Evening ~6:00 PM IST
            (0, node_cron_1.schedule)('0 18 * * *', () => void sendGreeting('evening'), tz);
            // 🌙 Good Night ~10:00 PM IST
            (0, node_cron_1.schedule)('0 22 * * *', () => void sendGreeting('night'), tz);
        };
        this.spawnCard = async () => {
            (0, node_cron_1.schedule)('*/15 * * * *', async () => {
                this.client.log(`[CARD SPAWN] Cron fired — groups: ${this.chara.length}, paused: ${this.cardsPaused}`);
                if (this.cardsPaused || this.chara.length < 1)
                    return void null;
                for (let i = 0; i < this.chara.length; i++) {
                    setTimeout(async () => {
                        const jid = this.chara[i];
                        const { chara, bot } = await this.client.DB.getGroup(jid);
                        this.client.log(`[CARD SPAWN] Group ${jid} — chara: ${chara}, bot: ${bot}, activeCard: ${this.cardResponse.has(jid)}`);
                        if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0])
                            return void null;
                        if (!chara)
                            return void null;
                        if (this.cardResponse.has(jid))
                            return void null; // unclaimed card still active
                        // ── Fetch card from Shoob.gg API; fallback to local S-tier ──────────
                        let cardTitle;
                        let cardTier;
                        let cardUrl;
                        let cardSeries;
                        let price;
                        const apiCard = await (0, CardData_1.fetchSpawnCard)();
                        if (apiCard) {
                            cardTitle = apiCard.title;
                            cardTier = apiCard.tier;
                            cardUrl = apiCard.url;
                            cardSeries = apiCard.series;
                            price = apiCard.price;
                            this.client.log(`[CARD SPAWN] API card: ${cardTitle} (T${cardTier}) — ${price} gold`);
                        }
                        else {
                            // Fallback to local S-tier pool
                            const fallback = (0, CardData_1.getRandomCard)();
                            cardTitle = fallback.title;
                            cardTier = fallback.tier;
                            cardUrl = fallback.url;
                            cardSeries = '';
                            price = (0, CardData_1.getCardPrice)(fallback.tier);
                            this.client.log(`[CARD SPAWN] API failed — fallback local S-tier: ${cardTitle}`);
                        }
                        const te = CardData_1.TIER_EMOJI[cardTier] ?? '🃏';
                        const tn = CardData_1.TIER_NAME[cardTier] ?? `Tier ${cardTier}`;
                        this.cardResponse.set(jid, {
                            card: `${cardTitle}-${cardTier}`,
                            cardTitle,
                            tier: cardTier,
                            price
                        });
                        const seriesLine = cardSeries
                            ? `  ‧₊˚ 🎬 𝑺𝒆𝒓𝒊𝒆𝒔  ·❀·  ${cardSeries}\n`
                            : '';
                        const caption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                            `  🌸✿ᰰ  *${cardTitle}*  ✿ᰰ🌸\n` +
                            `      𐚁 🃏 𝑾𝒊𝒍𝒅 𝑪𝒂𝒓𝒅 𝑺𝒑𝒂𝒘𝒏𝒆𝒅 🃏 𐚁\n\n` +
                            `  ‧₊˚ ${te} 𝑻𝒊𝒆𝒓    ·❀·  ${cardTier} — ${tn}\n` +
                            seriesLine +
                            `  ‧₊˚ 💰 𝑷𝒓𝒊𝒄𝒆  ·❀·  ${price.toLocaleString()} gold\n\n` +
                            `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                            `  𖤐 Type *${this.client.config.prefix}collect* to claim! 𖤐\n` +
                            `  🍃 ⁺. 10 mins left! .⁺ 🍃\n\n` +
                            `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`;
                        try {
                            const gif = (0, CardData_1.isGif)(cardUrl);
                            let buffer = null;
                            if (gif) {
                                const gifBuf = await this.client.utils.getBuffer(cardUrl);
                                buffer = await this.client.utils.gifToMp4(gifBuf);
                            }
                            else {
                                buffer = await this.client.utils.getBufferCapped(cardUrl, 5 * 1024 * 1024);
                            }
                            const cardBtns = [
                                { text: '📦 Collect Card', id: `${this.client.config.prefix}collect` },
                                { text: '💰 My Wallet', id: `${this.client.config.prefix}wallet` }
                            ];
                            if (buffer) {
                                await this.client.sendMessage(jid, (gif
                                    ? { video: buffer, caption, gifPlayback: true, mimetype: 'video/mp4', buttonsFormat: 'buttons', buttons: cardBtns }
                                    : { image: buffer, caption, buttonsFormat: 'buttons', buttons: cardBtns }));
                            }
                            else {
                                await this.client.sendMessage(jid, { text: caption, footer: '⚡ RedzeoX', buttonsFormat: 'buttons', buttons: cardBtns });
                            }
                        }
                        catch {
                            const cardBtns = [
                                { text: '📦 Collect Card', id: `${this.client.config.prefix}collect` },
                                { text: '💰 My Wallet', id: `${this.client.config.prefix}wallet` }
                            ];
                            await this.client.sendMessage(jid, { text: caption, footer: '⚡ RedzeoX', buttonsFormat: 'buttons', buttons: cardBtns });
                        }
                        // Auto-expire after 10 minutes
                        setTimeout(() => this.cardResponse.delete(jid), 10 * 60 * 1000);
                    }, (i + 1) * 30 * 1000);
                }
            });
        };
        this.moderate = async (M, groupData) => {
            if (M.chat !== 'group')
                return void null;
            const { mods } = groupData ?? await this.client.DB.getGroup(M.from);
            const isAdmin = M.groupMetadata?.admins?.includes(this.client.correctJid(this.client.user?.id || ''));
            if (!mods || M.sender.isAdmin || !isAdmin)
                return void null;
            const urls = this.client.utils.extractUrls(M.content);
            if (urls.length > 0) {
                const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'));
                if (groupinvites.length > 0) {
                    groupinvites.forEach(async (invite) => {
                        const code = await this.client.groupInviteCode(M.from);
                        const inviteSplit = invite.split('/');
                        if (inviteSplit[inviteSplit.length - 1] !== code) {
                            this.client.log(`${chalk_1.default.blueBright('MOD')} ${chalk_1.default.green('Group Invite')} by ${chalk_1.default.yellow(M.sender.username)} in ${chalk_1.default.cyanBright(M.groupMetadata?.subject || 'Group')}`);
                            return void (await this.client.groupParticipantsUpdate(M.from, [M.sender.jid], 'remove'));
                        }
                    });
                }
            }
        };
        this.formatArgs = (args) => {
            args.splice(0, 1);
            return {
                args,
                context: args.join(' ').trim(),
                flags: args.filter((arg) => arg.startsWith('--'))
            };
        };
        this.loadCommands = async () => {
            this.client.log('Loading Commands...');
            const files = (0, fs_extra_1.readdirSync)((0, path_1.join)(...this.path)).filter((file) => !file.startsWith('_'));
            let loaded = 0;
            for (const file of files) {
                this.path.push(file);
                const Commands = (0, fs_extra_1.readdirSync)((0, path_1.join)(...this.path));
                for (const Command of Commands) {
                    this.path.push(Command);
                    const command = new (require((0, path_1.join)(...this.path)).default)();
                    command.client = this.client;
                    command.handler = this;
                    this.commands.set(command.name, command);
                    if (command.config.aliases)
                        command.config.aliases.forEach((alias) => this.aliases.set(alias, command));
                    this.client.log(`Loaded: ${chalk_1.default.yellowBright(command.name)} from ${chalk_1.default.cyanBright(command.config.category)}`);
                    this.path.splice(this.path.indexOf(Command), 1);
                    loaded++;
                    // Requiring all command modules is CPU-heavy. Yield regularly
                    // so an already-created WhatsApp socket can process its
                    // connection events instead of waiting for all 255 modules.
                    if (loaded % 8 === 0)
                        await new Promise((resolve) => setImmediate(resolve));
                }
                this.path.splice(this.path.indexOf(file), 1);
            }
            this.client.log(`Successfully loaded ${chalk_1.default.cyanBright(this.commands.size)} ${this.commands.size > 1 ? 'commands' : 'command'} with ${chalk_1.default.yellowBright(this.aliases.size)} ${this.aliases.size > 1 ? 'aliases' : 'alias'}`);
        };
        this.handleUserStats = async (M, user) => {
            const { experience, level } = user ?? await this.client.DB.getUser(M.sender.jid);
            const { requiredXpToLevelUp } = (0, lib_1.getStats)(level);
            if (requiredXpToLevelUp > experience)
                return void null;
            await this.client.DB.updateUser(M.sender.jid, 'level', 'inc', 1);
        };
        this.persistBattleDamage = async (jid, pokemonName, hp, maxHp) => {
            try {
                const user = await this.client.DB.getUser(jid);
                const target = pokemonName.toLowerCase();
                const party = user.party.map((pokemon) => {
                    if (pokemon.name.toLowerCase() !== target)
                        return pokemon;
                    return {
                        ...pokemon,
                        hp,
                        maxHp,
                        status: hp <= 0 ? 'Fainted' : hp < maxHp ? 'Injured' : 'Healthy'
                    };
                });
                await this.client.DB.user.updateOne({ jid }, { $set: { party } });
                this.client.DB.cacheInvalidate(`user:${jid}`);
            }
            catch {
                // Battle result should still be delivered if health persistence fails.
            }
        };
        this.commands = new Map();
        this.aliases = new Map();
        this.cooldowns = new Map();
        this.path = [__dirname, '..', 'Commands'];
        this.pokemonResponse = new Map();
        this.pokemonTradeResponse = new Map();
        this.pvpChallenges = new Map();
        this.pvpBattles = new Map();
        this.haigushaResponse = new Map();
        this.cardResponse = new Map();
        this.pokemonSpawnInfo = new Map();
        // ── Special spawn tracking (Tier S / Event cards spawned by mods) ──────────
        this.specialSpawnInfo = new Map();
        this.quiz = {
            quizResponse: new Map(),
            failed: new Map(),
            creator: new Map()
        };
    }
}
exports.MessageHandler = MessageHandler;
