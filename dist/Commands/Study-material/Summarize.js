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
const SYSTEM = `You are an expert at summarizing text. When given a passage:
1. Identify the main topic in 1 sentence.
2. List 3-5 key points as bullet points (use • symbol).
3. Write a 1-sentence conclusion or takeaway.
Keep the summary clear, concise, and in plain English. No markdown headers.
If the text is very short (under 50 words), note it's already concise but still summarize.`;
let SummarizeCommand = class SummarizeCommand extends Structures_1.BaseCommand {
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
                return void M.reply(`📝 *SUMMARIZE — Text Summarizer*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide text to summarize!\n\n` +
                    `📢 *How to use:*\n` +
                    `  • \`${p}summarize <your long text here>\`\n` +
                    `  • Or *reply* to any message and type \`${p}summarize\`\n\n` +
                    `💬 *Tip:* Works great with notes, articles, or homework passages!`);
            if (inputText.length < 30)
                return void M.reply(`❌ Text is too short to summarize! Please provide at least 30 characters.`);
            if (inputText.length > 2000)
                return void M.reply(`❌ Text is too long! Please keep it under 2000 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('📝 _Reading and summarizing... please wait!_ ⏳');
            const summary = await (0, StudyAI_1.studyAI)(inputText, SYSTEM, 400);
            if (!summary)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            const preview = inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText;
            return void M.reply(`📝 *Summary*\n\n` +
                `${summary}\n\n` +
                `_Original: "${preview}"_\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
SummarizeCommand = __decorate([
    (0, Structures_1.Command)('summarize', {
        description: 'Summarize any long text into clear key points 📝',
        category: 'study',
        usage: 'summarize <text>  OR  reply to a message with: summarize',
        aliases: ['summary', 'tldr', 'shorten'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], SummarizeCommand);
exports.default = SummarizeCommand;
