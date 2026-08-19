"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const StudyAI_1 = require("../../lib/StudyAI");
const SYSTEM = `You are an expert paraphrasing assistant. When given a piece of text:
1. Rewrite it completely in fresh words while keeping the exact same meaning.
2. Improve clarity and flow where possible.
3. Keep the same length (don't shorten too much or expand unnecessarily).
4. Output ONLY the paraphrased version — no explanation, no labels, no extra commentary.
Write in clear, natural English. Maintain the original tone (formal stays formal, casual stays casual).`;
let ParaphraseCommand = class ParaphraseCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            // Support replying to a message
            const quoted = M.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const quotedText = quoted?.conversation ||
                quoted?.extendedTextMessage?.text ||
                '';
            const inputText = context.trim() || quotedText.trim();
            if (!inputText)
                return void M.reply(`🔄 *PARAPHRASE — Text Rewriter*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide text to paraphrase!\n\n` +
                    `📢 *How to use:*\n` +
                    `  • \`${p}paraphrase <your text here>\`\n` +
                    `  • Or *reply* to any message and type \`${p}paraphrase\`\n\n` +
                    `💬 *Example:* \`${p}paraphrase The Earth revolves around the Sun taking 365 days to complete one full orbit.\``);
            if (inputText.length < 10)
                return void M.reply(`❌ Text is too short! Please provide at least 10 characters.`);
            if (inputText.length > 1500)
                return void M.reply(`❌ Text is too long! Please keep it under 1500 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('🔄 _Rewriting your text... please wait!_ ⏳');
            const result = await (0, StudyAI_1.studyAI)(inputText, SYSTEM, 500);
            if (!result)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            const preview = inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText;
            return void M.reply(`🔄 *Rewritten*\n\n` +
                `${result}\n\n` +
                `_Original: "${preview}"_\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
ParaphraseCommand = __decorate([
    (0, Structures_1.Command)('paraphrase', {
        description: 'Rewrite any text in fresh words while keeping the same meaning 🔄',
        category: 'study',
        usage: 'paraphrase <text>  OR  reply to a message with: paraphrase',
        aliases: ['rewrite', 'rephrase'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], ParaphraseCommand);
exports.default = ParaphraseCommand;
