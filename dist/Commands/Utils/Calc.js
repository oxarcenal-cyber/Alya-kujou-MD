"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const prefix = this.client.config.prefix;
            if (!context.trim())
                return void M.reply((0, lib_1.t)('calc_usage', lang, { p: prefix }));
            const expression = context.trim();
            if (expression.length > 100)
                return void M.reply((0, lib_1.t)('calc_too_long', lang, { p: prefix }));
            // Strict allowlist: digits, operators, parens, dots, spaces only
            const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '').trim();
            if (!sanitized)
                return void M.reply((0, lib_1.t)('calc_invalid', lang, { p: prefix }));
            // Guard: reject consecutive operators or other suspicious patterns
            if (/[+\-*/]{3,}/.test(sanitized))
                return void M.reply((0, lib_1.t)('calc_bad_ops', lang, { p: prefix }));
            try {
                const result = this.safeEval(sanitized);
                if (result === null || !isFinite(result))
                    return void M.reply((0, lib_1.t)('calc_bad_result', lang, { p: prefix }));
                return void M.reply(`🧮 *CALCULATOR* 🧮\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📝 *Expression:* \`${expression}\`\n` +
                    `✅ *Result:* *${result}*\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}calc <expression>\``);
            }
            catch {
                return void M.reply((0, lib_1.t)('calc_error', lang, { p: prefix }));
            }
        };
        this.safeEval = (expr) => {
            let pos = 0;
            const MAX_DEPTH = 20;
            const next = () => expr[pos] ?? '';
            const parseExpr = (depth = 0) => {
                if (depth > MAX_DEPTH)
                    throw new Error('Too deep');
                let left = parseTerm(depth);
                while (next() === '+' || next() === '-') {
                    const op = expr[pos++];
                    left = op === '+' ? left + parseTerm(depth) : left - parseTerm(depth);
                }
                return left;
            };
            const parseTerm = (depth) => {
                let left = parsePower(depth);
                while (next() === '*' || next() === '/') {
                    const op = expr[pos++];
                    const right = parsePower(depth);
                    if (op === '/' && right === 0)
                        throw new Error('Div by zero');
                    left = op === '*' ? left * right : left / right;
                }
                return left;
            };
            const parsePower = (depth) => {
                const base = parseUnary(depth);
                if (next() === '*' && expr[pos + 1] === '*') {
                    pos += 2;
                    return Math.pow(base, parsePower(depth));
                }
                return base;
            };
            const parseUnary = (depth) => {
                while (next() === ' ')
                    pos++;
                if (next() === '-') {
                    pos++;
                    return -parsePrimary(depth);
                }
                if (next() === '+') {
                    pos++;
                    return parsePrimary(depth);
                }
                return parsePrimary(depth);
            };
            const parsePrimary = (depth) => {
                while (next() === ' ')
                    pos++;
                if (next() === '(') {
                    pos++;
                    const val = parseExpr(depth + 1);
                    if (next() === ')')
                        pos++;
                    while (next() === ' ')
                        pos++;
                    return val;
                }
                let numStr = '';
                while (/[0-9.]/.test(next()))
                    numStr += expr[pos++];
                while (next() === ' ')
                    pos++;
                if (!numStr)
                    throw new Error('Expected number');
                return parseFloat(numStr);
            };
            try {
                const result = parseExpr(0);
                return typeof result === 'number' && isFinite(result) ? result : null;
            }
            catch {
                return null;
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('calc', {
        description: 'Calculate any mathematical expression 🧮',
        category: 'utils',
        usage: 'calc <expression>',
        aliases: ['calculate', 'math'],
        cooldown: 3,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
