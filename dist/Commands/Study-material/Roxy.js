"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const RoxyBrain_1 = require("../../lib/RoxyBrain");
const StudyAI_1 = require("../../lib/StudyAI");
const D = '━'.repeat(28);
let RoxyCommand = class RoxyCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context, args }) => {
            const p = this.client.config.prefix;
            const jid = M.sender.jid;
            const input = context.trim();
            const sub = (args[0] || '').toLowerCase();
            const reply = (text) => M.reply(text);
            // ── Sub-commands ─────────────────────────────────────────────────────
            // -roxy reset
            if (sub === 'reset') {
                (0, RoxyBrain_1.resetProfile)(jid);
                return void await this.client.sendMessage(M.from, {
                    text: `🔄 *Roxy profile reset!*\n\n` +
                        `Teri saari history aur settings delete ho gayi. Fresh start! ✨`,
                    footer: 'Start fresh with Roxy',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '👋 Say Hello to Roxy', id: `${p}roxy hello` }
                    ]
                }, { quoted: M.message });
            }
            // -roxy profile
            if (sub === 'profile') {
                const prof = (0, RoxyBrain_1.getProfile)(jid);
                const stateLabel = {
                    new: '🆕 New — Not set up yet',
                    awaiting_student: '⏳ Waiting for student reply',
                    awaiting_grade: '⏳ Waiting for grade input',
                    active_student: '🎓 Active Student',
                    active_non_student: '👤 Regular User'
                };
                return void await this.client.sendMessage(M.from, {
                    text: `🌟 *ROXY — Your Profile* 🌟\n` +
                        `${D}\n\n` +
                        `👤 *Status:*   ${stateLabel[prof.state] ?? prof.state}\n` +
                        `🎓 *Student:*  ${prof.isStudent === null ? 'Not set' : prof.isStudent ? 'Yes ✅' : 'No'}\n` +
                        `📖 *Grade:*    ${prof.grade ?? 'Not set'}\n` +
                        `💬 *Questions asked:* ${prof.totalQ}\n` +
                        `🕐 *Member since:* ${new Date(prof.createdAt).toLocaleDateString('en-IN')}\n\n` +
                        `${D}`,
                    footer: 'Manage your Roxy profile',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📖 Update Grade', id: `${p}roxy setgrade ` },
                        { text: '🔄 Reset Profile', id: `${p}roxy reset` }
                    ]
                }, { quoted: M.message });
            }
            // -roxy setgrade <grade>
            if (sub === 'setgrade') {
                const grade = args.slice(1).join(' ').trim();
                if (!grade)
                    return void reply(`❌ Please provide your grade!\nExample: \`${p}roxy setgrade 10th\``);
                (0, RoxyBrain_1.updateProfile)(jid, { grade: grade.slice(0, 50) });
                return void await this.client.sendMessage(M.from, {
                    text: `✅ *Grade updated!*\n\n` +
                        `📖 Grade set to: *${grade}*\n\n` +
                        `Roxy will now tailor explanations to your level! 🎓`,
                    footer: 'Ask Roxy anything!',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🌟 Ask Roxy', id: `${p}roxy ` },
                        { text: '👤 View Profile', id: `${p}roxy profile` }
                    ]
                }, { quoted: M.message });
            }
            // ── No AI key check (Groq or OpenAI) ─────────────────────────────────
            if (!(0, StudyAI_1.hasStudyAIKey)())
                return void reply((0, RoxyBrain_1.ROXY_NO_AI)(p));
            const profile = (0, RoxyBrain_1.getProfile)(jid);
            const lang = (0, RoxyBrain_1.detectLang)(input || 'hello');
            // ── New user — show intro ─────────────────────────────────────────────
            if (profile.state === 'new') {
                (0, RoxyBrain_1.updateProfile)(jid, { state: 'awaiting_student' });
                const introText = (0, RoxyBrain_1.ROXY_INTRO)(p, lang);
                // Add Yes/No buttons for student question
                return void await this.client.sendMessage(M.from, {
                    text: introText,
                    footer: lang === 'hi' ? 'Student ho ya nahi?' : 'Are you a student?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: lang === 'hi' ? '✅ Haan, Student Hun' : '✅ Yes, I\'m a Student', id: `${p}roxy yes` },
                        { text: lang === 'hi' ? '❌ Nahi, Student Nahi' : '❌ No, I\'m Not', id: `${p}roxy no` }
                    ]
                }, { quoted: M.message });
            }
            // ── Awaiting student yes/no ───────────────────────────────────────────
            if (profile.state === 'awaiting_student') {
                const clean = input.toLowerCase();
                const YES = /^(yes|haan|ha|haa|han|yep|yeah|yup|bilkul|zarur|sure|ok|okay)\b/i;
                const NO = /^(no|nahi|nope|nah|nahin|mat|never|nhi)\b/i;
                if (YES.test(clean)) {
                    (0, RoxyBrain_1.updateProfile)(jid, { isStudent: true, state: 'awaiting_grade' });
                    const gradeText = (0, RoxyBrain_1.ROXY_ASK_GRADE)(lang);
                    // Grade selection list
                    const gradeRows = [
                        { title: '📚 Class 6', description: 'Middle School', id: `${p}roxy 6th` },
                        { title: '📚 Class 7', description: 'Middle School', id: `${p}roxy 7th` },
                        { title: '📚 Class 8', description: 'Middle School', id: `${p}roxy 8th` },
                        { title: '📚 Class 9', description: 'Secondary', id: `${p}roxy 9th` },
                        { title: '📚 Class 10', description: 'Secondary (Board)', id: `${p}roxy 10th` },
                        { title: '📚 Class 11', description: 'Senior Secondary', id: `${p}roxy 11th` },
                        { title: '📚 Class 12', description: 'Senior Secondary (Board)', id: `${p}roxy 12th` },
                        { title: '🎓 College', description: 'Undergraduate', id: `${p}roxy college` },
                        { title: '⏭️ Skip', description: 'Skip grade selection', id: `${p}roxy skip` },
                    ];
                    return void await this.client.sendMessage(M.from, {
                        text: gradeText,
                        footer: lang === 'hi' ? 'Apni class chuno' : 'Select your class',
                        buttons: [{
                                text: lang === 'hi' ? '📖 Apni Class Chuno' : '📖 Select Your Grade',
                                sections: [{ title: lang === 'hi' ? 'Apni Class' : 'Your Grade', rows: gradeRows }]
                            }]
                    }, { quoted: M.message });
                }
                if (NO.test(clean)) {
                    (0, RoxyBrain_1.updateProfile)(jid, { isStudent: false, state: 'active_non_student' });
                    return void await this.client.sendMessage(M.from, {
                        text: (0, RoxyBrain_1.ROXY_NON_STUDENT)(lang),
                        footer: lang === 'hi' ? 'Roxy ready hai!' : 'Roxy is ready!',
                        buttonsFormat: 'buttons',
                        buttons: [
                            { text: lang === 'hi' ? '💬 Kuch Poochho' : '💬 Ask Something', id: `${p}roxy ` }
                        ]
                    }, { quoted: M.message });
                }
                // Anything else — re-show yes/no buttons
                return void await this.client.sendMessage(M.from, {
                    text: `🤔 ${lang === 'hi' ? 'Pehle bata — *student ho ya nahi?* 😊' : 'First things first — *are you a student?* 😊'}`,
                    footer: lang === 'hi' ? 'Haan ya Nahi?' : 'Yes or No?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: lang === 'hi' ? '✅ Haan' : '✅ Yes', id: `${p}roxy yes` },
                        { text: lang === 'hi' ? '❌ Nahi' : '❌ No', id: `${p}roxy no` }
                    ]
                }, { quoted: M.message });
            }
            // ── Awaiting grade ────────────────────────────────────────────────────
            if (profile.state === 'awaiting_grade') {
                if (!input)
                    return void reply((0, RoxyBrain_1.ROXY_ASK_GRADE)(lang));
                const grade = input.toLowerCase() === 'skip' ? null : input.slice(0, 50);
                (0, RoxyBrain_1.updateProfile)(jid, { grade, state: 'active_student' });
                return void await this.client.sendMessage(M.from, {
                    text: (0, RoxyBrain_1.ROXY_CONFIRMED_STUDENT)(grade, lang),
                    footer: lang === 'hi' ? 'Roxy ready hai!' : 'Roxy is ready for you!',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: lang === 'hi' ? '🌟 Pehla Sawaal Poochho' : '🌟 Ask First Question', id: `${p}roxy ` },
                        { text: '👤 Profile', id: `${p}roxy profile` }
                    ]
                }, { quoted: M.message });
            }
            // ── Active modes — need a question ───────────────────────────────────
            if (!input) {
                const isStudent = profile.state === 'active_student';
                return void await this.client.sendMessage(M.from, {
                    text: `🌟 *Hey! Main hun Roxy!* 😊\n\n` +
                        `${isStudent
                            ? (lang === 'hi'
                                ? `Koi sawaal? Kuch samajhna hai? Seedha poochh! 📚\n\n_Example: \`${p}roxy Photosynthesis kya hai?\`_`
                                : `Got a question? Something to explain? Just ask! 📚\n\n_Example: \`${p}roxy What is photosynthesis?\`_`)
                            : (lang === 'hi'
                                ? `Koi topic explore karna hai ya kuch seekhna hai? Poochh lo! 🌟\n\n_Example: \`${p}roxy How does the internet work?\`_`
                                : `Want to explore a topic or learn something? Ask away! 🌟\n\n_Example: \`${p}roxy How does the internet work?\`_`)}`,
                    footer: 'Roxy is ready!',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '👤 My Profile', id: `${p}roxy profile` },
                        { text: '🔄 Reset', id: `${p}roxy reset` }
                    ]
                }, { quoted: M.message });
            }
            if (input.length > 800)
                return void reply(lang === 'hi'
                    ? `❌ Sawaal bahut lamba hai! 800 characters se kam rakho please. 😊`
                    : `❌ Your message is too long! Please keep it under 800 characters. 😊`);
            // ── Non-student asking a study question — still help! ─────────────────
            // Show thinking indicator
            await reply(lang === 'hi' ? '🧠 _Soch rahi hun... ek second!_ ⏳' : '🧠 _Thinking... just a moment!_ ⏳');
            const answer = await (0, RoxyBrain_1.askRoxy)(jid, input);
            if (!answer)
                return void reply((0, RoxyBrain_1.ROXY_ERROR)(lang));
            // ── Send answer ───────────────────────────────────────────────────────
            const updatedProfile = (0, RoxyBrain_1.getProfile)(jid);
            const qNum = updatedProfile.totalQ;
            return void await this.client.sendMessage(M.from, {
                text: `🌟 *Roxy*\n\n` +
                    `${answer}\n\n` +
                    `_Q#${qNum} • ⚡ RedzeoX × Groq_`,
                footer: 'Roxy — AI Study Assistant',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🔁 Ask Again', id: `${p}roxy ` },
                    { text: '👤 Profile', id: `${p}roxy profile` },
                    { text: '🔄 Reset', id: `${p}roxy reset` }
                ]
            }, { quoted: M.message });
        };
    }
};
RoxyCommand = __decorate([
    (0, Structures_1.Command)('roxy', {
        description: 'Chat with Roxy — your personal AI study assistant 🌟',
        category: 'study',
        usage: 'roxy <question>  |  roxy reset  |  roxy profile  |  roxy setgrade <grade>',
        aliases: ['rx', 'studyai', 'roxie'],
        cooldown: 5,
        exp: 15,
        dm: true
    })
], RoxyCommand);
exports.default = RoxyCommand;
