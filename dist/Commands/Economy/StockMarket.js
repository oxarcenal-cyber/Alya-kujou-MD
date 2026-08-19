"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
// In-memory stock state (resets on restart — by design for fun)
const STOCKS = [
    { symbol: 'RIAS', name: 'Rias Corp', emoji: '👑', basePrice: 500, volatility: 0.08 },
    { symbol: 'DRGN', name: 'Dragon Fire Ltd', emoji: '🐉', basePrice: 1200, volatility: 0.12 },
    { symbol: 'GOLD', name: 'Gold Mine', emoji: '💎', basePrice: 800, volatility: 0.06 },
    { symbol: 'ANME', name: 'Anime Studios', emoji: '🎌', basePrice: 350, volatility: 0.10 },
    { symbol: 'WBOT', name: 'WhatsApp Bots', emoji: '🤖', basePrice: 2000, volatility: 0.15 },
    { symbol: 'MNGO', name: 'Mango Tech', emoji: '🥭', basePrice: 150, volatility: 0.07 },
    { symbol: 'NITE', name: 'Night Holdings', emoji: '🌙', basePrice: 600, volatility: 0.09 },
    { symbol: 'FIRE', name: 'Blaze Industries', emoji: '🔥', basePrice: 900, volatility: 0.11 },
];
// Live prices map: symbol → StockPrice
const prices = new Map();
// User portfolios: jid → symbol → holding
const portfolios = new Map();
// Initialize prices
for (const s of STOCKS) {
    prices.set(s.symbol, {
        price: s.basePrice,
        change: 0,
        history: Array(5).fill(s.basePrice)
    });
}
// Market tick every 5 minutes
setInterval(() => {
    for (const s of STOCKS) {
        const p = prices.get(s.symbol);
        const swing = (Math.random() * 2 - 1) * s.volatility;
        const newPrice = Math.max(10, Math.round(p.price * (1 + swing)));
        p.change = Math.round(((newPrice - p.price) / p.price) * 100 * 10) / 10;
        p.history = [...p.history.slice(1), newPrice];
        p.price = newPrice;
    }
}, 5 * 60 * 1000);
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getOrInitPortfolio(jid) {
    if (!portfolios.has(jid))
        portfolios.set(jid, new Map());
    return portfolios.get(jid);
}
function trend(history) {
    const last = history[history.length - 1];
    const first = history[0];
    return last > first ? '📈' : last < first ? '📉' : '➡️';
}
function changeStr(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
}
function priceColor(change) {
    return change > 0 ? '🟢' : change < 0 ? '🔴' : '⚪';
}
// ─── Command ─────────────────────────────────────────────────────────────────
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const parts = context.trim().toLowerCase().split(/\s+/);
            const sub = parts[0] || '';
            const fromJid = this.client.correctJid(M.sender.jid);
            // ── Help ──────────────────────────────────────────────────────────
            if (!sub)
                return void M.reply(`📈 *STOCK MARKET*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}stock market\` → Sab stocks ki prices dekho\n` +
                    `  \`${prefix}stock info RIAS\` → Ek stock ki detail\n` +
                    `  \`${prefix}stock buy RIAS 5\` → 5 shares kharido\n` +
                    `  \`${prefix}stock sell RIAS 5\` → 5 shares becho\n` +
                    `  \`${prefix}stock sell RIAS all\` → Sab shares becho\n` +
                    `  \`${prefix}stock portfolio\` → Apna portfolio dekho\n\n` +
                    `⏰ *Market tick:* Har 5 minute mein prices change hoti hain\n` +
                    `📊 *Available stocks:*\n` +
                    STOCKS.map(s => `  ${s.emoji} *${s.symbol}* — ${s.name}`).join('\n') +
                    `\n\n📢 *Example:*\n` +
                    `  \`${prefix}stock buy CRYS 10\``);
            // ── Market ────────────────────────────────────────────────────────
            if (sub === 'market' || sub === 'list') {
                const rows = STOCKS.map(s => {
                    const p = prices.get(s.symbol);
                    const tr = trend(p.history);
                    const cc = priceColor(p.change);
                    return `${s.emoji} *${s.symbol}*  ${cc} *${p.price.toLocaleString()}*  ${tr} ${changeStr(p.change)}`;
                });
                return void M.reply(`📊 ═══ *STOCK MARKET* ═══ 📊\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    rows.join('\n') +
                    `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `⏰ Prices har 5 min update hoti hain\n` +
                    `📢 Buy: \`${prefix}stock buy <SYMBOL> <qty>\``);
            }
            // ── Info ──────────────────────────────────────────────────────────
            if (sub === 'info') {
                const sym = (parts[1] || '').toUpperCase();
                const stock = STOCKS.find(s => s.symbol === sym);
                if (!stock)
                    return void M.reply(`❌ Stock *${sym}* nahi mila!\n📢 \`${prefix}stock market\` se list dekho`);
                const p = prices.get(sym);
                const graph = p.history.map(h => {
                    const bar = Math.round((h / Math.max(...p.history)) * 8);
                    return '█'.repeat(bar) + '░'.repeat(8 - bar);
                }).join('\n');
                return void M.reply(`${stock.emoji} ═══ *${stock.name}* ═══\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `📊 Symbol: *${stock.symbol}*\n` +
                    `💰 Price: *${p.price.toLocaleString()} gold*\n` +
                    `${priceColor(p.change)} Change: *${changeStr(p.change)}*\n` +
                    `⚡ Volatility: *${Math.round(stock.volatility * 100)}%*\n\n` +
                    `📈 *Price History (last 5 ticks):*\n\`\`\`\n${graph}\n\`\`\`\n\n` +
                    `📢 Buy: \`${prefix}stock buy ${sym} <qty>\``);
            }
            // ── Portfolio ─────────────────────────────────────────────────────
            if (sub === 'portfolio' || sub === 'port' || sub === 'p') {
                const port = getOrInitPortfolio(fromJid);
                if (port.size === 0)
                    return void M.reply(`📋 *Portfolio khali hai!*\n\n` +
                        `📢 Shares kharido: \`${prefix}stock buy RIAS 5\``);
                let totalInvested = 0;
                let totalValue = 0;
                const rows = [];
                for (const [sym, h] of port) {
                    const stock = STOCKS.find(s => s.symbol === sym);
                    const p = prices.get(sym);
                    const value = h.shares * p.price;
                    const cost = h.shares * h.avgBuy;
                    const pnl = value - cost;
                    const pnlPct = Math.round((pnl / cost) * 100);
                    totalInvested += cost;
                    totalValue += value;
                    rows.push(`${stock.emoji} *${sym}* × ${h.shares}\n` +
                        `  Avg: ${h.avgBuy} | Now: ${p.price} | ${pnl >= 0 ? '🟢' : '🔴'} ${pnl >= 0 ? '+' : ''}${pnl.toLocaleString()} (${pnl >= 0 ? '+' : ''}${pnlPct}%)`);
                }
                const totalPnl = totalValue - totalInvested;
                return void M.reply(`📋 ═══ *MY PORTFOLIO* ═══ 📋\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    rows.join('\n\n') +
                    `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `💼 Total Value: *${totalValue.toLocaleString()} gold*\n` +
                    `${totalPnl >= 0 ? '🟢' : '🔴'} P&L: *${totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()} gold*`);
            }
            // ── Buy ───────────────────────────────────────────────────────────
            if (sub === 'buy') {
                const sym = (parts[1] || '').toUpperCase();
                const qty = parseInt(parts[2]);
                const stock = STOCKS.find(s => s.symbol === sym);
                if (!stock)
                    return void M.reply(`❌ Stock *${sym}* nahi mila!\n📢 \`${prefix}stock market\``);
                if (!qty || qty < 1)
                    return void M.reply(`❌ Kitne shares? Min *1*\n📢 Example: \`${prefix}stock buy ${sym} 5\``);
                if (qty > 1000)
                    return void M.reply(`❌ Max *1000 shares* ek baar mein`);
                const p = prices.get(sym);
                const total = p.price * qty;
                const { wallet } = await this.client.DB.getUser(fromJid);
                if (wallet < total)
                    return void M.reply(`❌ Wallet mein *${wallet.toLocaleString()} gold* hai\n` +
                        `💸 Cost: *${total.toLocaleString()} gold* (${qty} × ${p.price})\n` +
                        `❌ Nahi kharid sakte!`);
                await this.client.DB.setCrystal(fromJid, -total);
                const port = getOrInitPortfolio(fromJid);
                const holding = port.get(sym) || { shares: 0, avgBuy: 0 };
                const newShares = holding.shares + qty;
                holding.avgBuy = Math.round((holding.avgBuy * holding.shares + p.price * qty) / newShares);
                holding.shares = newShares;
                port.set(sym, holding);
                return void M.reply(`✅ *${qty} ${sym} shares kharide!*\n\n` +
                    `${stock.emoji} *${stock.name}*\n` +
                    `💰 Price: *${p.price.toLocaleString()}* each\n` +
                    `💸 Total cost: *${total.toLocaleString()} gold*\n` +
                    `📦 Holdings: *${newShares} shares*\n\n` +
                    `📢 Portfolio: \`${prefix}stock portfolio\``);
            }
            // ── Sell ──────────────────────────────────────────────────────────
            if (sub === 'sell') {
                const sym = (parts[1] || '').toUpperCase();
                const stock = STOCKS.find(s => s.symbol === sym);
                if (!stock)
                    return void M.reply(`❌ Stock *${sym}* nahi mila!\n📢 \`${prefix}stock market\``);
                const port = getOrInitPortfolio(fromJid);
                const holding = port.get(sym);
                if (!holding || holding.shares === 0)
                    return void M.reply(`❌ Tumhare paas *${sym}* shares nahi hain!`);
                const qtyStr = parts[2];
                const qty = qtyStr === 'all' ? holding.shares : parseInt(qtyStr);
                if (!qty || qty < 1)
                    return void M.reply(`❌ Kitne shares becho? Ya \`all\`\n📢 Example: \`${prefix}stock sell ${sym} 5\``);
                if (qty > holding.shares)
                    return void M.reply(`❌ Tumhare paas sirf *${holding.shares} shares* hain!`);
                const p = prices.get(sym);
                const earned = p.price * qty;
                const cost = holding.avgBuy * qty;
                const pnl = earned - cost;
                await this.client.DB.setCrystal(fromJid, earned);
                holding.shares -= qty;
                if (holding.shares === 0)
                    port.delete(sym);
                else
                    port.set(sym, holding);
                return void M.reply(`✅ *${qty} ${sym} shares bech diye!*\n\n` +
                    `${stock.emoji} *${stock.name}*\n` +
                    `💰 Sell price: *${p.price.toLocaleString()}* each\n` +
                    `💵 Earned: *${earned.toLocaleString()} gold*\n` +
                    `${pnl >= 0 ? '🟢' : '🔴'} P&L: *${pnl >= 0 ? '+' : ''}${pnl.toLocaleString()} gold*\n\n` +
                    `📢 Portfolio: \`${prefix}stock portfolio\``);
            }
            return void M.reply(`❓ Sahi command batao!\n📢 Help: \`${prefix}stock\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('stock', {
        description: 'Virtual stock market — buy/sell aur profit kamao! 📈',
        category: 'economy',
        usage: 'stock market | stock buy <symbol> <shares> | stock sell <symbol> <shares> | stock portfolio | stock info <symbol>',
        aliases: ['stocks', 'share', 'market'],
        cooldown: 3,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
