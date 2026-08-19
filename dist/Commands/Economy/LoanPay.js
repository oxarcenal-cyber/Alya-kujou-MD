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
                    `You don't have any loan to pay.\n` +
                    `💡 Use \`${prefix}loan <amount>\` to take a loan.`);
            }
            if (M.numbers.length < 1) {
                return void M.reply(`❓ *How much do you want to pay?*\n\n` +
                    `🔴 *Remaining:* ${loan.remaining.toLocaleString()} 💰\n\n` +
                    `📢 *Usage:* \`${prefix}loanpay <amount>\`\n` +
                    `💡 Tip: Pay the full remaining amount to clear your loan instantly!`);
            }
            const payAmount = Math.floor(M.numbers[0]);
            if (payAmount <= 0)
                return void M.reply(`❌ Amount must be greater than 0!\n\n📢 *Usage:* \`${prefix}loanpay <amount>\``);
            const { wallet, bank } = user;
            const totalAvailable = wallet + bank;
            if (totalAvailable < payAmount) {
                return void M.reply(`❌ *Insufficient funds!*\n\n` +
                    `💸 *You want to pay:* ${payAmount.toLocaleString()} 💰\n` +
                    `💳 *Wallet:* ${wallet.toLocaleString()} 💰\n` +
                    `🏦 *Bank:* ${bank.toLocaleString()} 💰\n` +
                    `📊 *Total available:* ${totalAvailable.toLocaleString()} 💰`);
            }
            // Cap at remaining amount — don't overpay
            const actualPay = Math.min(payAmount, loan.remaining);
            // Deduct from bank first, then wallet
            let toPay = actualPay;
            const bankDeduct = Math.min(bank, toPay);
            toPay -= bankDeduct;
            const walletDeduct = Math.min(wallet, toPay);
            if (bankDeduct > 0)
                await this.client.DB.setCrystal(M.sender.jid, -bankDeduct, 'bank');
            if (walletDeduct > 0)
                await this.client.DB.setCrystal(M.sender.jid, -walletDeduct);
            const newRemaining = loan.remaining - actualPay;
            const loanCleared = newRemaining <= 0;
            await this.client.DB.updateLoanRemaining(M.sender.jid, newRemaining, loanCleared);
            if (loanCleared) {
                return void M.reply(`🎉 *LOAN FULLY CLEARED!* 🎉\n` +
                    `${'═'.repeat(30)}\n\n` +
                    `✅ You have paid off your entire loan!\n` +
                    `💸 *Paid now:* ${actualPay.toLocaleString()} 💰\n\n` +
                    `🏆 No more EMIs — you're debt-free!\n` +
                    `${'═'.repeat(30)}\n` +
                    `💡 Need more gold? Use \`${prefix}loan\` anytime.`);
            }
            return void M.reply(`✅ *PAYMENT RECEIVED!*\n` +
                `${'─'.repeat(30)}\n\n` +
                `💸 *Paid:*      ${actualPay.toLocaleString()} 💰\n` +
                `   (Bank: ${bankDeduct.toLocaleString()} + Wallet: ${walletDeduct.toLocaleString()})\n\n` +
                `🔴 *Remaining:* ${newRemaining.toLocaleString()} 💰\n\n` +
                `${'─'.repeat(30)}\n` +
                `💡 Use \`${prefix}myloan\` to see full status\n` +
                `💡 Use \`${prefix}loanpay ${newRemaining.toLocaleString()}\` to clear all at once`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('loanpay', {
        category: 'economy',
        description: 'Manually pay off your loan (partial or full) early',
        usage: 'loanpay <amount>',
        aliases: ['payloan', 'repayloan'],
        exp: 10
    })
], command);
exports.default = command;
