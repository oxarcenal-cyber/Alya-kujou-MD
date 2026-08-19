"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const userTodos = new Map();
const getTodos = (jid) => {
    if (!userTodos.has(jid))
        userTodos.set(jid, []);
    return userTodos.get(jid);
};
const getTime = () => {
    const now = new Date();
    return now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true,
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
let StudyTodoCommand = class StudyTodoCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const p = this.client.config.prefix;
            const uid = M.sender.jid;
            const sub = (args[0] || '').toLowerCase().trim();
            const rest = args.slice(1).join(' ').trim();
            // ── USAGE / Help — show list menu with subcommands ────────────────────
            if (!sub || !['add', 'list', 'done', 'del', 'delete', 'clear', 'undone', 'undo'].includes(sub)) {
                const rows = [
                    { title: '➕ Add a Task', description: `${p}studytodo add <task name>`, id: `${p}studytodo add ` },
                    { title: '📋 View All Tasks', description: `${p}studytodo list`, id: `${p}studytodo list` },
                    { title: '✅ Mark as Done', description: `${p}studytodo done <number>`, id: `${p}studytodo done ` },
                    { title: '↩️ Undo Done', description: `${p}studytodo undo <number>`, id: `${p}studytodo undo ` },
                    { title: '🗑️ Delete a Task', description: `${p}studytodo del <number>`, id: `${p}studytodo del ` },
                    { title: '🧹 Clear All Tasks', description: `${p}studytodo clear`, id: `${p}studytodo clear` },
                ];
                return void await this.client.sendMessage(M.from, {
                    text: `📌 *STUDY TO-DO LIST*\n` +
                        `${'━'.repeat(28)}\n\n` +
                        `📢 *How to use:*\n\n` +
                        `  ➕ Add a task:    \`${p}studytodo add <task name>\`\n` +
                        `  📋 View tasks:   \`${p}studytodo list\`\n` +
                        `  ✅ Mark done:    \`${p}studytodo done <number>\`\n` +
                        `  ↩️ Undo done:     \`${p}studytodo undo <number>\`\n` +
                        `  🗑️ Delete task:   \`${p}studytodo del <number>\`\n` +
                        `  🧹 Clear all:    \`${p}studytodo clear\`\n\n` +
                        `💬 *Examples:*\n` +
                        `  \`${p}studytodo add Finish Chemistry Chapter 5\`\n` +
                        `  \`${p}studytodo done 1\`\n\n` +
                        `⚠️ _Tasks are stored in memory and reset when the bot restarts._`,
                    footer: 'Tap below to pick an action',
                    buttons: [{
                            text: '📌 Choose Action',
                            sections: [{ title: 'Study To-Do Options', rows }]
                        }]
                }, { quoted: M.message });
            }
            const todos = getTodos(uid);
            // ── ADD ───────────────────────────────────────────────────────────────
            if (sub === 'add') {
                if (!rest)
                    return void M.reply(`❌ *Please provide a task name!*\n\n` +
                        `Example: \`${p}studytodo add Study for Biology exam\``);
                if (rest.length > 200)
                    return void M.reply(`❌ Task is too long! Please keep it under 200 characters.`);
                if (todos.length >= 30)
                    return void M.reply(`❌ You've reached the *30 task limit!*\n\n` +
                        `Mark tasks as done or delete them first:\n` +
                        `\`${p}studytodo done <number>\` or \`${p}studytodo del <number>\``);
                todos.push({ task: rest, done: false, addedAt: getTime() });
                const pending = todos.filter(t => !t.done).length;
                return void await this.client.sendMessage(M.from, {
                    text: `✅ *Task Added!* 📌\n\n` +
                        `📝 *"${rest}"*\n\n` +
                        `📊 Total: *${todos.length}* task${todos.length !== 1 ? 's' : ''} | ⏳ Pending: *${pending}*`,
                    footer: 'What do you want to do next?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📋 View All Tasks', id: `${p}studytodo list` },
                        { text: '✅ Mark Done', id: `${p}studytodo done ${todos.length}` },
                        { text: '➕ Add Another', id: `${p}studytodo add ` }
                    ]
                }, { quoted: M.message });
            }
            // ── LIST ──────────────────────────────────────────────────────────────
            if (sub === 'list') {
                if (!todos.length)
                    return void await this.client.sendMessage(M.from, {
                        text: `📌 *Your Study To-Do List is Empty!*\n\n` +
                            `Add tasks using:\n\`${p}studytodo add <task name>\``,
                        footer: 'Start tracking your study tasks!',
                        buttonsFormat: 'buttons',
                        buttons: [
                            { text: '➕ Add First Task', id: `${p}studytodo add ` }
                        ]
                    }, { quoted: M.message });
                const pending = todos.filter(t => !t.done);
                const done = todos.filter(t => t.done);
                let text = `📌 *STUDY TO-DO LIST* 📌\n`;
                text += `${'━'.repeat(28)}\n`;
                text += `📊 Total: *${todos.length}* | ⏳ Pending: *${pending.length}* | ✅ Done: *${done.length}*\n\n`;
                if (pending.length) {
                    text += `⏳ *PENDING TASKS:*\n`;
                    for (let i = 0; i < todos.length; i++) {
                        if (!todos[i].done) {
                            text += `  *${i + 1}.* ⬜ ${todos[i].task}\n`;
                            text += `       🕐 _Added: ${todos[i].addedAt}_\n`;
                        }
                    }
                    text += '\n';
                }
                if (done.length) {
                    text += `✅ *COMPLETED TASKS:*\n`;
                    for (let i = 0; i < todos.length; i++) {
                        if (todos[i].done) {
                            text += `  *${i + 1}.* ✅ ~${todos[i].task}~\n`;
                        }
                    }
                    text += '\n';
                }
                text += `${'━'.repeat(28)}\n`;
                text += `💡 Use buttons below to manage your tasks`;
                return void await this.client.sendMessage(M.from, {
                    text,
                    footer: 'Manage your study tasks',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✅ Mark Done', id: `${p}studytodo done ` },
                        { text: '🗑️ Delete Task', id: `${p}studytodo del ` },
                        { text: '🧹 Clear All', id: `${p}studytodo clear` }
                    ]
                }, { quoted: M.message });
            }
            // ── DONE ──────────────────────────────────────────────────────────────
            if (sub === 'done') {
                if (!todos.length)
                    return void M.reply(`❌ Your to-do list is empty!`);
                const num = parseInt(rest, 10);
                if (isNaN(num) || num < 1 || num > todos.length)
                    return void M.reply(`❌ *Invalid task number!*\n\n` +
                        `You have *${todos.length}* task${todos.length !== 1 ? 's' : ''}.\n` +
                        `Use \`${p}studytodo list\` to see all tasks.`);
                if (todos[num - 1].done)
                    return void M.reply(`⚠️ Task #${num} is *already marked as done!*`);
                todos[num - 1].done = true;
                const remaining = todos.filter(t => !t.done).length;
                return void await this.client.sendMessage(M.from, {
                    text: `🎉 *Task Completed!* ✅\n\n` +
                        `✅ *"${todos[num - 1].task}"*\n\n` +
                        `📊 *${remaining}* task${remaining !== 1 ? 's' : ''} remaining.\n\n` +
                        `${remaining === 0 ? '🏆 *Amazing! You completed all your tasks!* 🌟' : `💪 _Keep going! You're doing great!_`}`,
                    footer: remaining === 0 ? '🏆 All done!' : `${remaining} tasks left`,
                    buttonsFormat: 'buttons',
                    buttons: remaining > 0
                        ? [
                            { text: '📋 View Tasks', id: `${p}studytodo list` },
                            { text: '✅ Mark Another', id: `${p}studytodo done ` }
                        ]
                        : [
                            { text: '📋 View List', id: `${p}studytodo list` },
                            { text: '🧹 Clear All', id: `${p}studytodo clear` }
                        ]
                }, { quoted: M.message });
            }
            // ── UNDO ──────────────────────────────────────────────────────────────
            if (sub === 'undone' || sub === 'undo') {
                if (!todos.length)
                    return void M.reply(`❌ Your to-do list is empty!`);
                const num = parseInt(rest, 10);
                if (isNaN(num) || num < 1 || num > todos.length)
                    return void M.reply(`❌ *Invalid task number!* Use \`${p}studytodo list\` to see all tasks.`);
                if (!todos[num - 1].done)
                    return void M.reply(`⚠️ Task #${num} is *not marked as done yet!*`);
                todos[num - 1].done = false;
                return void await this.client.sendMessage(M.from, {
                    text: `↩️ *Task Unmarked!*\n\n` +
                        `⬜ *"${todos[num - 1].task}"*\n\n` +
                        `Task moved back to pending.`,
                    footer: 'Task is pending again',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📋 View Tasks', id: `${p}studytodo list` },
                        { text: '✅ Mark Done', id: `${p}studytodo done ${num}` }
                    ]
                }, { quoted: M.message });
            }
            // ── DELETE ────────────────────────────────────────────────────────────
            if (sub === 'del' || sub === 'delete') {
                if (!todos.length)
                    return void M.reply(`❌ Your to-do list is already empty!`);
                const num = parseInt(rest, 10);
                if (isNaN(num) || num < 1 || num > todos.length)
                    return void M.reply(`❌ *Invalid task number!*\n\n` +
                        `You have *${todos.length}* task${todos.length !== 1 ? 's' : ''}.\n` +
                        `Use \`${p}studytodo list\` to see all tasks.`);
                const removed = todos.splice(num - 1, 1)[0];
                return void await this.client.sendMessage(M.from, {
                    text: `🗑️ *Task Deleted!*\n\n` +
                        `Removed: _"${removed.task}"_\n\n` +
                        `📊 *${todos.length}* task${todos.length !== 1 ? 's' : ''} remaining.`,
                    footer: 'What next?',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📋 View Tasks', id: `${p}studytodo list` },
                        { text: '➕ Add a Task', id: `${p}studytodo add ` }
                    ]
                }, { quoted: M.message });
            }
            // ── CLEAR ─────────────────────────────────────────────────────────────
            if (sub === 'clear') {
                if (!todos.length)
                    return void M.reply(`❌ Your to-do list is already empty!`);
                const count = todos.length;
                userTodos.set(uid, []);
                return void await this.client.sendMessage(M.from, {
                    text: `🧹 *To-Do List Cleared!*\n\n` +
                        `Deleted *${count}* task${count !== 1 ? 's' : ''}.\n\n` +
                        `Start fresh with:\n\`${p}studytodo add <task name>\``,
                    footer: 'Your list is now empty',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '➕ Add First Task', id: `${p}studytodo add ` }
                    ]
                }, { quoted: M.message });
            }
        };
    }
};
StudyTodoCommand = __decorate([
    (0, Structures_1.Command)('studytodo', {
        description: 'Track your study tasks & homework to-do list 📌',
        category: 'study',
        usage: 'studytodo add <task> | studytodo list | studytodo done <number> | studytodo del <number> | studytodo clear',
        aliases: ['std', 'studytask', 'homework'],
        cooldown: 3,
        exp: 10,
        dm: true
    })
], StudyTodoCommand);
exports.default = StudyTodoCommand;
