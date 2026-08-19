"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const user = await this.client.DB.getUser(M.sender.jid);
            const loan = user.loan;
            if (!loan?.active) {
                return void M.reply(`📭 *No Active Loan*\n\n` +
                    `You currently have no outstanding loan.\n\n` +
                    `💡 Take a loan with \`${prefix}loan <amount>\`\n` +
                    `📊 Range: 1,000 – 50,000 💰`);
            }
            const pad = (s) => (s < 10 ? '0' : '') + s;
            const formatCountdown = (ms) => {
                if (ms <= 0)
                    return '*DUE NOW ⚠️*';
                const totalSecs = Math.floor(ms / 1000);
                const h = Math.floor(totalSecs / 3600);
                const m = Math.floor((totalSecs % 3600) / 60);
                const s = totalSecs % 60;
                return `*${pad(h)}h ${pad(m)}m ${pad(s)}s*`;
            };
            const now = Date.now();
            const timeLeft = loan.nextEmiAt - now;
            const nextEmiStr = timeLeft <= 0
                ? '⚠️ *OVERDUE — will deduct on next cron cycle*'
                : `in ${formatCountdown(timeLeft)}`;
            const emisDone = loan.emisPaid;
            const emisLeft = loan.totalEmis - emisDone;
            const progressBar = '█'.repeat(emisDone) + '░'.repeat(emisLeft);
            const takenDate = new Date(loan.takenAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            return void M.reply(`🏦 *YOUR LOAN STATUS*\n` +
                `${'═'.repeat(30)}\n\n` +
                `💸 *Original Loan:*  ${loan.principal.toLocaleString()} 💰\n` +
                `💰 *Total Repay:*   ${loan.totalRepay.toLocaleString()} 💰\n` +
                `🔴 *Remaining:*     ${loan.remaining.toLocaleString()} 💰\n` +
                `💎 *Per EMI:*       ${loan.emiAmount.toLocaleString()} 💰\n\n` +
                `${'─'.repeat(30)}\n` +
                `📊 *Progress:* [${progressBar}] ${emisDone}/${loan.totalEmis}\n\n` +
                `⏰ *Next EMI:* ${nextEmiStr}\n` +
                (loan.penaltyCount > 0
                    ? `⚠️ *Penalties hit:* ${loan.penaltyCount}x (20% each time)\n`
                    : '') +
                `\n📅 *Loan taken:* ${takenDate} IST\n\n` +
                `${'═'.repeat(30)}\n` +
                `💡 Use \`${prefix}loanpay <amount>\` to pay early & save on penalties`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('myloan', {
        category: 'economy',
        description: 'Check your active loan status and EMI schedule',
        usage: 'myloan',
        aliases: ['loanstatus', 'loaninfo'],
        exp: 5
    })
], command);
exports.default = command;
