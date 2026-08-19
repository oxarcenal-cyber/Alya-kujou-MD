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
const SYSTEM = `You are an expert math and science problem solver. When given a problem:
1. Identify what type of problem it is (algebra, geometry, physics, etc.)
2. List the given information / known values
3. Write the formula or method you will use
4. Show each calculation step clearly, one step per line
5. Box or highlight the final answer at the end with "✅ Final Answer: ..."
Keep steps concise but complete. Use plain text — no markdown headers.
For word problems, extract variables and set up the equation first.`;
let SolveCommand = class SolveCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            const problem = context.trim();
            if (!problem)
                return void M.reply(`🔢 *SOLVE — Step-by-Step Problem Solver*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `❌ Please provide a problem to solve!\n\n` +
                    `📢 *How to use:* \`${p}solve <problem>\`\n\n` +
                    `💬 *Examples:*\n` +
                    `  • \`${p}solve 2x + 5 = 13\`\n` +
                    `  • \`${p}solve x² - 9 = 0\`\n` +
                    `  • \`${p}solve Find the area of a circle with radius 7cm\`\n` +
                    `  • \`${p}solve A train travels 60km/h for 2.5 hours, find distance\``);
            if (problem.length > 400)
                return void M.reply(`❌ Problem is too long! Please keep it under 400 characters.`);
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void M.reply((0, StudyAI_1.NO_AI_MSG)(p));
            await M.reply('🔢 _Solving step-by-step... please wait!_ ⏳');
            const solution = await (0, StudyAI_1.studyAI)(problem, SYSTEM, 600);
            if (!solution)
                return void M.reply((0, StudyAI_1.AI_ERROR_MSG)());
            return void M.reply(`🔢 *Solution*\n\n` +
                `${solution}\n\n` +
                `_⚡ RedzeoX × Groq_`);
        };
    }
};
SolveCommand = __decorate([
    (0, Structures_1.Command)('solve', {
        description: 'Solve math or science problems with step-by-step explanation 🔢',
        category: 'study',
        usage: 'solve <problem or equation>',
        aliases: ['mathsolve', 'calculate2'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], SolveCommand);
exports.default = SolveCommand;
