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
const SYSTEM = `You are an expert academic tutor. Answer the student's question clearly and concisely.
- Use simple, easy-to-understand English.
- For factual/science/math questions: give accurate, direct answers.
- Add a short example or analogy if it helps understanding.
- Keep your response under 200 words unless more detail is truly necessary.
- Use bullet points or numbered steps when listing information.
- Do NOT use markdown headers like ## or ***. Use plain text with asterisks for bold (*word*).`;
let AskCommand = class AskCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const question = context.trim();
            if (!question)
                return void M.reply(`🤖 *ASK — AI Study Assistant*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❓ Please provide a question!\n\n` +
                    `📢 *How to use:* \`${p}ask <your question>\`\n\n` +
                    `💬 *Examples:*\n` +
                    `  • \`${p}ask What is photosynthesis?\`\n` +
                    `  • \`${p}ask Explain Newton's 3rd law\`\n` +
                    `  • \`${p}ask What causes earthquakes?\``);
            if (question.length > 500)
                return void M.reply(`❌ Question is too long! Please keep it under 500 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('🤖 _Thinking... please wait a moment!_ ⏳');
            const answer = await (0, StudyAI_1.studyAI)(question, SYSTEM, 500);
            if (!answer)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            return void M.reply(`🤖 *Answer*\n\n` +
                `${answer}\n\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
AskCommand = __decorate([
    (0, Structures_1.Command)('ask', {
        description: 'Ask any academic question and get an AI-powered answer 🤖',
        category: 'study',
        usage: 'ask <your question>',
        aliases: ['question', 'studyask'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], AskCommand);
exports.default = AskCommand;
