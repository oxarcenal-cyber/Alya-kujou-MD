"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const userCards = new Map();
const getCards = (jid) => {
    if (!userCards.has(jid))
        userCards.set(jid, []);
    return userCards.get(jid);
};
let FlashcardCommand = class FlashcardCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args, context }) => {
            const p = this.client.config.prefix;
            const uid = M.sender.jid;
            const sub = (args[0] || '').toLowerCase().trim();
            const rest = args.slice(1).join(' ').trim();
            // ── USAGE / Help — show list menu with subcommands ────────────────────
            if (!sub || !['add', 'list', 'del', 'delete', 'clear', 'quiz'].includes(sub)) {
                const rows = [
                    { title: '➕ Add a Card', description: `${p}flashcard add <term> : <definition>`, id: `${p}flashcard add ` },
                    { title: '📋 View All Cards', description: `${p}flashcard list`, id: `${p}flashcard list` },
                    { title: '🎲 Random Quiz', description: `${p}flashcard quiz`, id: `${p}flashcard quiz` },
                    { title: '🗑️ Delete a Card', description: `${p}flashcard del <number>`, id: `${p}flashcard del ` },
                    { title: '🧹 Clear All Cards', description: `${p}flashcard clear`, id: `${p}flashcard clear` },
                ];
                return void await this.client.sendMessage(M.from, {
                    text: `🃏 *FLASHCARD — Study Deck Manager*\n` +
                        `${'━'.repeat(28)}\n\n` +
                        `📢 *How to use:*\n\n` +
                        `  ➕ Add a card:  \`${p}flashcard add <term> : <definition>\`\n` +
                        `  📋 View cards:  \`${p}flashcard list\`\n` +
                        `  🎲 Quiz:         \`${p}flashcard quiz\`\n` +
                        `  🗑️ Delete card:  \`${p}flashcard del <number>\`\n` +
                        `  🧹 Clear all:   \`${p}flashcard clear\`\n\n` +
                        `💬 *Example:*\n` +
                        `  \`${p}flashcard add Mitosis : Cell division producing 2 identical daughter cells\`\n\n` +
                        `⚠️ _Cards are stored in memory and reset when the bot restarts._`,
                    footer: 'Tap below to pick an action',
                    buttons: [{
                            text: '🃏 Choose Action',
                            sections: [{ title: 'Flashcard Options', rows }]
                        }]
                }, { quoted: M.message });
            }
            const cards = getCards(uid);
            // ── ADD ───────────────────────────────────────────────────────────────
            if (sub === 'add') {
                const full = rest || args.slice(1).join(' ');
                const sepIdx = full.indexOf(':');
                if (sepIdx === -1)
                    return void M.reply(`❌ *Wrong format!*\n\n` +
                        `Use a colon ( : ) to separate term and definition:\n` +
                        `\`${p}flashcard add <term> : <definition>\`\n\n` +
                        `💬 *Example:*\n` +
                        `\`${p}flashcard add Osmosis : Movement of water through a semi-permeable membrane\``);
                const term = full.slice(0, sepIdx).trim();
                const definition = full.slice(sepIdx + 1).trim();
                if (!term || !definition)
                    return void M.reply(`❌ Both *term* and *definition* must be filled in!`);
                if (term.length > 100)
                    return void M.reply(`❌ Term is too long! Keep it under 100 characters.`);
                if (definition.length > 300)
                    return void M.reply(`❌ Definition is too long! Keep it under 300 characters.`);
                if (cards.length >= 50)
                    return void M.reply(`❌ You've reached the *50 card limit!* Delete some cards first with \`${p}flashcard del <number>\` or \`${p}flashcard clear\`.`);
                cards.push({ term, definition });
                return void await this.client.sendMessage(M.from, {
                    text: `✅ *Flashcard Added!* 🃏\n\n` +
                        `📌 *Term:* ${term}\n` +
                        `📖 *Definition:* ${definition}\n\n` +
                        `📊 You now have *${cards.length}* card${cards.length !== 1 ? 's' : ''} in your deck.`,
                    footer: 'What do you want to do next?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📋 View My Deck', id: `${p}flashcard list` },
                        { text: '🎲 Take a Quiz', id: `${p}flashcard quiz` },
                        { text: '➕ Add Another', id: `${p}flashcard add ` }
                    ]
                }, { quoted: M.message });
            }
            // ── LIST ──────────────────────────────────────────────────────────────
            if (sub === 'list') {
                if (!cards.length)
                    return void await this.client.sendMessage(M.from, {
                        text: `🃏 *Your Flashcard Deck is Empty!*\n\n` +
                            `Add cards using:\n\`${p}flashcard add <term> : <definition>\``,
                        footer: 'Start building your deck!',
                        buttonsFormat: 'buttons',
                        buttons: [
                            { text: '➕ Add First Card', id: `${p}flashcard add ` }
                        ]
                    }, { quoted: M.message });
                let text = `🃏 *YOUR FLASHCARD DECK* 🃏\n`;
                text += `${'━'.repeat(28)}\n`;
                text += `📊 Total: *${cards.length}* card${cards.length !== 1 ? 's' : ''}\n\n`;
                for (let i = 0; i < cards.length; i++) {
                    text += `*${i + 1}.* 📌 ${cards[i].term}\n`;
                    text += `     📖 ${cards[i].definition}\n\n`;
                }
                text += `${'━'.repeat(28)}\n`;
                text += `💡 Use quiz/del/clear buttons below`;
                return void await this.client.sendMessage(M.from, {
                    text,
                    footer: 'Manage your flashcard deck',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎲 Quiz Me!', id: `${p}flashcard quiz` },
                        { text: '🗑️ Delete a Card', id: `${p}flashcard del ` },
                        { text: '🧹 Clear All', id: `${p}flashcard clear` }
                    ]
                }, { quoted: M.message });
            }
            // ── QUIZ ──────────────────────────────────────────────────────────────
            if (sub === 'quiz') {
                if (!cards.length)
                    return void await this.client.sendMessage(M.from, {
                        text: `🃏 *No cards in your deck!*\n\n` +
                            `Add cards first:\n\`${p}flashcard add <term> : <definition>\``,
                        footer: 'Build your deck to start quizzing!',
                        buttonsFormat: 'buttons',
                        buttons: [
                            { text: '➕ Add a Card', id: `${p}flashcard add ` }
                        ]
                    }, { quoted: M.message });
                const card = cards[Math.floor(Math.random() * cards.length)];
                const idx = cards.indexOf(card) + 1;
                return void await this.client.sendMessage(M.from, {
                    text: `🎲 *FLASHCARD QUIZ* 🎲\n` +
                        `${'━'.repeat(28)}\n\n` +
                        `🃏 *Card #${idx} of ${cards.length}*\n\n` +
                        `❓ *What is the definition of:*\n\n` +
                        `    ✦ *${card.term}* ✦\n\n` +
                        `${'━'.repeat(28)}\n` +
                        `👇 _Think about it... then tap to reveal!_\n\n` +
                        `||📖 *Answer:* ${card.definition}||`,
                    footer: 'Keep practising!',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🔁 Next Card', id: `${p}flashcard quiz` },
                        { text: '📋 View Deck', id: `${p}flashcard list` }
                    ]
                }, { quoted: M.message });
            }
            // ── DELETE ────────────────────────────────────────────────────────────
            if (sub === 'del' || sub === 'delete') {
                if (!cards.length)
                    return void M.reply(`❌ Your deck is already empty!`);
                const num = parseInt(rest, 10);
                if (isNaN(num) || num < 1 || num > cards.length)
                    return void M.reply(`❌ *Invalid card number!*\n\n` +
                        `You have *${cards.length}* card${cards.length !== 1 ? 's' : ''}.\n` +
                        `Use \`${p}flashcard del 1\` to \`${p}flashcard del ${cards.length}\``);
                const removed = cards.splice(num - 1, 1)[0];
                return void await this.client.sendMessage(M.from, {
                    text: `🗑️ *Card Deleted!*\n\n` +
                        `Removed: *${removed.term}*\n\n` +
                        `📊 *${cards.length}* card${cards.length !== 1 ? 's' : ''} remaining in your deck.`,
                    footer: 'What next?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📋 View Deck', id: `${p}flashcard list` },
                        { text: '➕ Add a Card', id: `${p}flashcard add ` }
                    ]
                }, { quoted: M.message });
            }
            // ── CLEAR ─────────────────────────────────────────────────────────────
            if (sub === 'clear') {
                if (!cards.length)
                    return void M.reply(`❌ Your deck is already empty!`);
                const count = cards.length;
                userCards.set(uid, []);
                return void await this.client.sendMessage(M.from, {
                    text: `🧹 *Deck Cleared!*\n\n` +
                        `Deleted *${count}* card${count !== 1 ? 's' : ''} from your deck.\n\n` +
                        `Start fresh with:\n\`${p}flashcard add <term> : <definition>\``,
                    footer: 'Your deck is now empty',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '➕ Add First Card', id: `${p}flashcard add ` }
                    ]
                }, { quoted: M.message });
            }
        };
    }
};
FlashcardCommand = __decorate([
    (0, Structures_1.Command)('flashcard', {
        description: 'Create and manage your personal flashcard deck 🃏',
        category: 'study',
        usage: 'flashcard add <term> : <definition> | flashcard list | flashcard del <number> | flashcard clear | flashcard quiz',
        aliases: ['fc', 'flashcards', 'flash'],
        cooldown: 3,
        exp: 10,
        dm: true
    })
], FlashcardCommand);
exports.default = FlashcardCommand;
