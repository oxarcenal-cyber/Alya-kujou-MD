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
const SYSTEM = `You are a brilliant teacher who explains complex topics in a very simple, engaging way.
When asked to explain a topic:
- Start with a 1-sentence definition.
- Then explain it like the student is 15 years old — use analogies, everyday examples.
- Mention 2-3 key points or facts about the topic.
- End with a real-life application or interesting fact.
- Keep response between 100-180 words. Use plain text with *bold* for key terms.
- No markdown headers. Be conversational and friendly.`;
let ExplainCommand = class ExplainCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const topic = context.trim();
            if (!topic)
                return void M.reply(`💡 *EXPLAIN — Topic Explainer*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide a topic to explain!\n\n` +
                    `📢 *How to use:* \`${p}explain <topic>\`\n\n` +
                    `💬 *Examples:*\n` +
                    `  • \`${p}explain Black Holes\`\n` +
                    `  • \`${p}explain Photosynthesis\`\n` +
                    `  • \`${p}explain DNA Replication\`\n` +
                    `  • \`${p}explain Supply and Demand\``);
            if (topic.length > 200)
                return void M.reply(`❌ Topic name is too long! Please keep it under 200 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('💡 _Preparing explanation... please wait!_ ⏳');
            const explanation = await (0, StudyAI_1.studyAI)(`Explain: ${topic}`, SYSTEM, 400);
            if (!explanation)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            return void M.reply(`💡 *${topic}*\n\n` +
                `${explanation}\n\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
ExplainCommand = __decorate([
    (0, Structures_1.Command)('explain', {
        description: 'Get a simple, clear explanation of any topic 💡',
        category: 'study',
        usage: 'explain <topic>',
        aliases: ['whatis', 'definition2'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], ExplainCommand);
exports.default = ExplainCommand;
