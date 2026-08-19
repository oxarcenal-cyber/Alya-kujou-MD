import { join } from 'path'
import { readdirSync } from 'fs'

// ── Valid categories (must match TCategory in Types/Command.ts) ───────────────
const VALID_CATEGORIES = new Set([
    'dev', 'fun', 'games', 'nsfw', 'utils', 'pokemon',
    'moderation', 'weeb', 'general', 'media', 'coding',
    'economy', 'characters', 'cards'
])

export type TestStatus = 'pass' | 'warn' | 'fail'

export interface CommandTestResult {
    name: string
    file: string
    category: string
    status: TestStatus
    checks: CheckResult[]
    aliases: string[]
    duration: number // ms
}

interface CheckResult {
    label: string
    status: TestStatus
    detail?: string
}

export interface TestReport {
    timestamp: string
    total: number
    pass: number
    warn: number
    fail: number
    duration: number // ms total
    results: CommandTestResult[]
}

// ─────────────────────────────────────────────────────────────────────────────

export class CommandTester {
    // Commands directory — from dist/test/../Commands = dist/Commands
    private cmdDir = join(__dirname, '..', 'Commands')

    public run(): TestReport {
        const start = Date.now()
        const results: CommandTestResult[] = []
        const seenNames = new Map<string, string>()   // name → file
        const seenAliases = new Map<string, string>() // alias → command name

        // 1. Discover all command folders & files
        let categories: string[]
        try {
            categories = readdirSync(this.cmdDir).filter((f) => !f.startsWith('_'))
        } catch (e) {
            return {
                timestamp: new Date().toISOString(),
                total: 0, pass: 0, warn: 0, fail: 0,
                duration: Date.now() - start,
                results: []
            }
        }

        for (const cat of categories) {
            const catDir = join(this.cmdDir, cat)
            let files: string[]
            try {
                files = readdirSync(catDir).filter((f) => f.endsWith('.js'))
            } catch {
                continue
            }

            for (const file of files) {
                const filePath = join(catDir, file)
                const cmdStart = Date.now()
                const checks: CheckResult[] = []
                let cmdName = file.replace('.js', '')
                let category = cat.toLowerCase()
                let aliases: string[] = []

                // ── Check 1: File loads without error ──────────────────────
                let CommandClass: any = null
                let instance: any = null
                try {
                    // Clear require cache for fresh load
                    delete require.cache[require.resolve(filePath)]
                    CommandClass = require(filePath).default
                    instance = new CommandClass()
                    checks.push({ label: 'File loads', status: 'pass' })
                } catch (err: any) {
                    checks.push({
                        label: 'File loads',
                        status: 'fail',
                        detail: err?.message || 'Unknown error'
                    })
                    results.push({
                        name: cmdName,
                        file: `${cat}/${file}`,
                        category,
                        status: 'fail',
                        checks,
                        aliases,
                        duration: Date.now() - cmdStart
                    })
                    continue
                }

                // ── Check 2: Has .name property ────────────────────────────
                if (instance.name && typeof instance.name === 'string' && instance.name.trim()) {
                    cmdName = instance.name.trim()
                    checks.push({ label: 'Has name', status: 'pass' })
                } else {
                    checks.push({ label: 'Has name', status: 'fail', detail: 'name is missing or empty' })
                }

                // ── Check 3: Has config object ─────────────────────────────
                const config = instance.config
                if (!config || typeof config !== 'object') {
                    checks.push({ label: 'Has config', status: 'fail', detail: 'config object is missing' })
                } else {
                    checks.push({ label: 'Has config', status: 'pass' })

                    // ── Check 4: config.description ───────────────────────
                    if (typeof config.description === 'string' && config.description.trim()) {
                        checks.push({ label: 'Has description', status: 'pass' })
                    } else {
                        checks.push({ label: 'Has description', status: 'warn', detail: 'description is empty or missing' })
                    }

                    // ── Check 5: config.usage ─────────────────────────────
                    if (typeof config.usage === 'string' && config.usage.trim()) {
                        checks.push({ label: 'Has usage', status: 'pass' })
                    } else {
                        checks.push({ label: 'Has usage', status: 'warn', detail: 'usage is empty or missing' })
                    }

                    // ── Check 6: config.category is valid ─────────────────
                    if (config.category && VALID_CATEGORIES.has(config.category)) {
                        category = config.category
                        checks.push({ label: 'Valid category', status: 'pass' })
                    } else {
                        checks.push({
                            label: 'Valid category',
                            status: 'fail',
                            detail: `"${config.category}" is not a valid category`
                        })
                    }

                    // ── Check 7: Aliases ──────────────────────────────────
                    if (Array.isArray(config.aliases)) {
                        aliases = config.aliases
                        let aliasOk = true
                        for (const alias of config.aliases) {
                            if (seenAliases.has(alias)) {
                                checks.push({
                                    label: 'Alias conflict',
                                    status: 'fail',
                                    detail: `Alias "${alias}" already used by "${seenAliases.get(alias)}"`
                                })
                                aliasOk = false
                            } else {
                                seenAliases.set(alias, cmdName)
                            }
                        }
                        if (aliasOk) checks.push({ label: 'Aliases unique', status: 'pass' })
                    }

                    // ── Check 8: cooldown sensible ────────────────────────
                    if (config.cooldown !== undefined) {
                        if (typeof config.cooldown === 'number' && config.cooldown >= 0 && config.cooldown <= 1800) {
                            checks.push({ label: 'Cooldown valid', status: 'pass' })
                        } else {
                            checks.push({
                                label: 'Cooldown valid',
                                status: 'warn',
                                detail: `Cooldown "${config.cooldown}" seems unusual`
                            })
                        }
                    }
                }

                // ── Check 9: execute is a function ─────────────────────────
                if (typeof instance.execute === 'function') {
                    checks.push({ label: 'Has execute()', status: 'pass' })
                } else {
                    checks.push({ label: 'Has execute()', status: 'fail', detail: 'execute method is missing or not a function' })
                }

                // ── Check 10: Duplicate command name ───────────────────────
                if (seenNames.has(cmdName)) {
                    checks.push({
                        label: 'Name unique',
                        status: 'fail',
                        detail: `Duplicate name — also defined in "${seenNames.get(cmdName)}"`
                    })
                } else {
                    seenNames.set(cmdName, `${cat}/${file}`)
                    checks.push({ label: 'Name unique', status: 'pass' })
                }

                // ── Determine overall status ───────────────────────────────
                const status: TestStatus =
                    checks.some((c) => c.status === 'fail') ? 'fail' :
                    checks.some((c) => c.status === 'warn') ? 'warn' : 'pass'

                results.push({
                    name: cmdName,
                    file: `${cat}/${file}`,
                    category,
                    status,
                    checks,
                    aliases,
                    duration: Date.now() - cmdStart
                })
            }
        }

        const pass = results.filter((r) => r.status === 'pass').length
        const warn = results.filter((r) => r.status === 'warn').length
        const fail = results.filter((r) => r.status === 'fail').length

        return {
            timestamp: new Date().toISOString(),
            total: results.length,
            pass,
            warn,
            fail,
            duration: Date.now() - start,
            results
        }
    }
}
