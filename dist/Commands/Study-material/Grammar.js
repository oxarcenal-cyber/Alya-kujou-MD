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
const SYSTEM = `You are a professional grammar checker and English teacher.
When given a piece of text:
1. Show the corrected version of the full text first under "✅ Corrected:".
2. Then list the specific mistakes found under "🔍 Mistakes Found:" — number each one.
   Format: "1. [original] → [corrected] — reason"
3. If no mistakes found, say so and give a compliment.
4. Keep your response concise and educational. No markdown headers. Use plain text.`;
let GrammarCommand = class GrammarCommand extends Structures_1.BaseCommand {
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
                return void M.reply(`✅ *GRAMMAR CHECKER*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide text to check!\n\n` +
                    `📢 *How to use:*\n` +
                    `  • \`${p}grammar <your text here>\`\n` +
                    `  • Or *reply* to any message and type \`${p}grammar\`\n\n` +
                    `💬 *Example:* \`${p}grammar She don't like to goes school\``);
            if (inputText.length < 5)
                return void M.reply(`❌ Text is too short! Please provide at least 5 characters.`);
            if (inputText.length > 1500)
                return void M.reply(`❌ Text is too long! Please keep it under 1500 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('✅ _Checking grammar... please wait!_ ⏳');
            const result = await (0, StudyAI_1.studyAI)(inputText, SYSTEM, 500);
            if (!result)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            const preview = inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText;
            return void M.reply(`✅ *Grammar Check*\n\n` +
                `${result}\n\n` +
                `_Original: "${preview}"_\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
GrammarCommand = __decorate([
    (0, Structures_1.Command)('grammar', {
        description: 'Check & correct grammar mistakes in your text ✅',
        category: 'study',
        usage: 'grammar <text>  OR  reply to a message with: grammar',
        aliases: ['grammarcheck', 'gc', 'spellcheck'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], GrammarCommand);
exports.default = GrammarCommand;
