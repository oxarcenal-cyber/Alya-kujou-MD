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
const buildSystem = (count) => `You are a quiz creator making multiple-choice questions for students.
Generate exactly ${count} MCQ question(s) on the given topic.
Format EACH question EXACTLY like this (no deviation):
Q1. [Question text]
   A) [Option A]
   B) [Option B]
   C) [Option C]
   D) [Option D]
   ✅ Answer: [Correct letter]) [Correct option text]

Leave one blank line between questions.
Make questions educational, clear, and of medium difficulty.
Vary the correct answer position (don't always put it as A).
Do NOT add any intro text or closing remarks — just the questions.`;
let MCQCommand = class MCQCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context, args }) => {
            const p = this.client.config.prefix;
            if (!context.trim()) {
                // No topic — show list menu for quick topic examples + count buttons
                const topicRows = [
                    { title: '🌿 Photosynthesis', description: '3 questions', id: `${p}mcq Photosynthesis 3` },
                    { title: '⚗️ Chemical Reactions', description: '3 questions', id: `${p}mcq Chemical Reactions 3` },
                    { title: '📐 Algebra Basics', description: '3 questions', id: `${p}mcq Algebra Basics 3` },
                    { title: '🌍 World War 2', description: '5 questions', id: `${p}mcq World War 2 5` },
                    { title: '🧬 Human Cell Biology', description: '3 questions', id: `${p}mcq Human Cell Biology 3` },
                    { title: '💻 Computer Basics', description: '3 questions', id: `${p}mcq Computer Basics 3` },
                    { title: '🇮🇳 Indian History', description: '5 questions', id: `${p}mcq Indian History 5` },
                    { title: '⚡ Electricity & Circuits', description: '3 questions', id: `${p}mcq Electricity 3` },
                ];
                return void await this.client.sendMessage(M.from, {
                    text: `📋 *MCQ GENERATOR — Practice Questions*\n` +
                        `${'━'.repeat(28)}\n\n` +
                        `❌ *Please provide a topic!*\n\n` +
                        `📢 *How to use:* \`${p}mcq <topic> [count]\`\n\n` +
                        `💬 *Examples:*\n` +
                        `  • \`${p}mcq Photosynthesis\`\n` +
                        `  • \`${p}mcq World War 2 5\`\n` +
                        `  • \`${p}mcq Algebra Basics 3\`\n\n` +
                        `💡 *Tip:* Default is 3 questions. Max is 5.\n\n` +
                        `👇 _Or tap below to pick a quick topic:_`,
                    footer: 'Select a topic to generate MCQs',
                    buttons: [{
                            text: '📋 Pick a Quick Topic',
                            sections: [{ title: '🎯 Popular Topics', rows: topicRows }]
                        }]
                }, { quoted: M.message });
            }
            // Parse count from last arg if it's a number
            let count = 3;
            let topicArgs = args;
            const lastArg = args[args.length - 1];
            if (lastArg && /^\d+$/.test(lastArg)) {
                count = Math.min(5, Math.max(1, parseInt(lastArg, 10)));
                topicArgs = args.slice(0, -1);
            }
            const topic = topicArgs.join(' ').trim() || context.trim();
            if (topic.length > 150)
                return void M.reply(`❌ Topic is too long! Please keep it under 150 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply(`📋 _Generating ${count} MCQ question${count > 1 ? 's' : ''} on *${topic}*... please wait!_ ⏳`);
            const questions = await (0, StudyAI_1.studyAI)(topic, buildSystem(count), 800);
            if (!questions)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            return void await this.client.sendMessage(M.from, {
                text: `📋 *${topic}*\n\n` +
                    `${questions}\n\n` +
                    `_⚡ RedzeoX × Groq_`,
                footer: `Topic: ${topic} • ${count} question${count > 1 ? 's' : ''}`,
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🔁 More Questions', id: `${p}mcq ${topic} ${count}` },
                    { text: '➕ Try Another Topic', id: `${p}mcq ` },
                    { text: count < 5 ? '📊 Get 5 Questions' : '📊 Get 3 Questions',
                        id: `${p}mcq ${topic} ${count < 5 ? 5 : 3}` }
                ]
            }, { quoted: M.message });
        };
    }
};
MCQCommand = __decorate([
    (0, Structures_1.Command)('mcq', {
        description: 'Generate multiple-choice practice questions on any topic 📋',
        category: 'study',
        usage: 'mcq <topic> [number of questions]',
        aliases: ['quiz2', 'practice', 'mcqs'],
        cooldown: 15,
        exp: 20,
        dm: true
    })
], MCQCommand);
exports.default = MCQCommand;
