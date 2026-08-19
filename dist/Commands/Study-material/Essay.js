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
const SYSTEM = `You are an expert essay writer helping students. When given an essay topic:
Write a well-structured short essay with these sections:
1. Introduction (2-3 sentences) — introduce the topic and state your thesis.
2. Body Paragraph 1 — main point with 1-2 supporting sentences.
3. Body Paragraph 2 — second point with 1-2 supporting sentences.
4. Conclusion (2 sentences) — summarize and close.
Label each section clearly like "📌 Introduction:", "📌 Body 1:", "📌 Body 2:", "📌 Conclusion:".
Keep the total essay under 220 words. Write in clear, academic English. No markdown headers.`;
let EssayCommand = class EssayCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const topic = context.trim();
            if (!topic)
                return void M.reply(`✍️ *ESSAY WRITER*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide a topic for the essay!\n\n` +
                    `📢 *How to use:* \`${p}essay <topic>\`\n\n` +
                    `💬 *Examples:*\n` +
                    `  • \`${p}essay Global Warming\`\n` +
                    `  • \`${p}essay The Importance of Education\`\n` +
                    `  • \`${p}essay Social Media Pros and Cons\`\n` +
                    `  • \`${p}essay Space Exploration Benefits\``);
            if (topic.length > 150)
                return void M.reply(`❌ Topic is too long! Please keep it under 150 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('✍️ _Writing your essay... please wait!_ ⏳');
            const essay = await (0, StudyAI_1.studyAI)(`Write an essay on: ${topic}`, SYSTEM, 600);
            if (!essay)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            return void M.reply(`✍️ *Essay — ${topic}*\n\n` +
                `${essay}\n\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
EssayCommand = __decorate([
    (0, Structures_1.Command)('essay', {
        description: 'Generate a structured essay or paragraph on any topic ✍️',
        category: 'study',
        usage: 'essay <topic>',
        aliases: ['writeessay', 'paragraph'],
        cooldown: 15,
        exp: 20,
        dm: true
    })
], EssayCommand);
exports.default = EssayCommand;
