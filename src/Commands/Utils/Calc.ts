import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('calc', {
    description: 'Calculate any mathematical expression 🧮',
    category: 'utils',
    usage: 'calc <expression>',
    aliases: ['calculate', 'math'],
    cooldown: 3,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const prefix = this.client.config.prefix
        if (!context.trim())
            return void M.reply(t('calc_usage', lang, { p: prefix }))

        const expression = context.trim()
        if (expression.length > 100)
            return void M.reply(t('calc_too_long', lang, { p: prefix }))

        // Strict allowlist: digits, operators, parens, dots, spaces only
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '').trim()
        if (!sanitized)
            return void M.reply(t('calc_invalid', lang, { p: prefix }))

        // Guard: reject consecutive operators or other suspicious patterns
        if (/[+\-*/]{3,}/.test(sanitized))
            return void M.reply(t('calc_bad_ops', lang, { p: prefix }))

        try {
            const result = this.safeEval(sanitized)
            if (result === null || !isFinite(result))
                return void M.reply(t('calc_bad_result', lang, { p: prefix }))

            return void M.reply(
                `🧮 *CALCULATOR* 🧮\n` +
                `${'─'.repeat(25)}\n\n` +
                `📝 *Expression:* \`${expression}\`\n` +
                `✅ *Result:* *${result}*\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}calc <expression>\``
            )
        } catch {
            return void M.reply(t('calc_error', lang, { p: prefix }))
        }
    }

    private safeEval = (expr: string): number | null => {
        let pos = 0
        const MAX_DEPTH = 20
        const next = (): string => expr[pos] ?? ''

        const parseExpr = (depth = 0): number => {
            if (depth > MAX_DEPTH) throw new Error('Too deep')
            let left = parseTerm(depth)
            while (next() === '+' || next() === '-') {
                const op = expr[pos++]
                left = op === '+' ? left + parseTerm(depth) : left - parseTerm(depth)
            }
            return left
        }
        const parseTerm = (depth: number): number => {
            let left = parsePower(depth)
            while (next() === '*' || next() === '/') {
                const op = expr[pos++]
                const right = parsePower(depth)
                if (op === '/' && right === 0) throw new Error('Div by zero')
                left = op === '*' ? left * right : left / right
            }
            return left
        }
        const parsePower = (depth: number): number => {
            const base = parseUnary(depth)
            if (next() === '*' && expr[pos + 1] === '*') { pos += 2; return Math.pow(base, parsePower(depth)) }
            return base
        }
        const parseUnary = (depth: number): number => {
            while (next() === ' ') pos++
            if (next() === '-') { pos++; return -parsePrimary(depth) }
            if (next() === '+') { pos++; return parsePrimary(depth) }
            return parsePrimary(depth)
        }
        const parsePrimary = (depth: number): number => {
            while (next() === ' ') pos++
            if (next() === '(') {
                pos++
                const val = parseExpr(depth + 1)
                if (next() === ')') pos++
                while (next() === ' ') pos++
                return val
            }
            let numStr = ''
            while (/[0-9.]/.test(next())) numStr += expr[pos++]
            while (next() === ' ') pos++
            if (!numStr) throw new Error('Expected number')
            return parseFloat(numStr)
        }
        try {
            const result = parseExpr(0)
            return typeof result === 'number' && isFinite(result) ? result : null
        } catch { return null }
    }
}
