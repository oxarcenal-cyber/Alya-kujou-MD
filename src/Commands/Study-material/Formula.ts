import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, NO_AI_MSG } from '../../lib/StudyAI'

// ── Local quick-lookup for common formulas (works without AI) ────────────────
const LOCAL_FORMULAS: Record<string, string> = {
    'quadratic':         `*Quadratic Formula*\nx = (-b ± √(b² - 4ac)) / 2a\nFor ax² + bx + c = 0`,
    'area circle':       `*Area of Circle*\nA = π × r²\n(r = radius, π ≈ 3.14159)`,
    'circumference':     `*Circumference of Circle*\nC = 2πr  or  C = πd`,
    'pythagoras':        `*Pythagorean Theorem*\na² + b² = c²\n(c = hypotenuse)`,
    'kinetic energy':    `*Kinetic Energy*\nKE = ½mv²\n(m = mass in kg, v = velocity in m/s)`,
    'potential energy':  `*Potential Energy*\nPE = mgh\n(m = mass, g = 9.8 m/s², h = height)`,
    'force':             `*Newton\'s Second Law*\nF = ma\n(F = force in N, m = mass in kg, a = acceleration in m/s²)`,
    'velocity':          `*Velocity*\nv = u + at\n(u = initial velocity, a = acceleration, t = time)`,
    'distance':          `*Distance (Kinematics)*\ns = ut + ½at²\n(u = initial velocity, a = acceleration, t = time)`,
    'ohm law':           `*Ohm\'s Law*\nV = IR\n(V = voltage in V, I = current in A, R = resistance in Ω)`,
    'power':             `*Electrical Power*\nP = VI  or  P = I²R  or  P = V²/R`,
    'ideal gas':         `*Ideal Gas Law*\nPV = nRT\n(P = pressure, V = volume, n = moles, R = 8.314, T = temp in K)`,
    'molarity':          `*Molarity*\nM = moles of solute / volume of solution (in L)`,
    'density':           `*Density*\nρ = m/V\n(m = mass in kg, V = volume in m³)`,
    'pressure':          `*Pressure*\nP = F/A\n(F = force in N, A = area in m²)`,
    'wave':              `*Wave Equation*\nv = fλ\n(v = speed, f = frequency in Hz, λ = wavelength in m)`,
    'simple interest':   `*Simple Interest*\nSI = (P × R × T) / 100\n(P = principal, R = rate %, T = time in years)`,
    'compound interest': `*Compound Interest*\nA = P(1 + r/n)^(nt)\n(P = principal, r = annual rate, n = times/year, t = years)`,
    'speed':             `*Speed*\nSpeed = Distance / Time`,
    'area rectangle':    `*Area of Rectangle*\nA = length × width`,
    'area triangle':     `*Area of Triangle*\nA = ½ × base × height`,
    'volume cube':       `*Volume of Cube*\nV = a³  (a = side length)`,
    'volume cylinder':   `*Volume of Cylinder*\nV = πr²h  (r = radius, h = height)`,
    'slope':             `*Slope of a Line*\nm = (y₂ - y₁) / (x₂ - x₁)`,
}

const SYSTEM = `You are a formula reference expert. When asked for a formula or equation:
1. State the formula name clearly.
2. Write the formula/equation using plain text symbols (², √, π, etc.).
3. Define each variable with its units.
4. Give one quick example or usage tip.
Keep it concise (under 150 words). No markdown headers. Use plain text with *bold* for formula names.`

@Command('formula', {
    description: 'Get formulas for Physics, Math, Chemistry and more 📐',
    category: 'study',
    usage: 'formula <topic>',
    aliases: ['formulas', 'equation', 'eq'],
    cooldown: 8,
    exp: 10,
    dm: true
})
export default class FormulaCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix
        const topic = context.trim().toLowerCase()

        if (!topic)
            return void M.reply(
                `📐 *FORMULA LOOKUP* 📐\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide a topic!\n\n` +
                `📢 *How to use:* \`${p}formula <topic>\`\n\n` +
                `💬 *Examples:*\n` +
                `  • \`${p}formula quadratic\`\n` +
                `  • \`${p}formula kinetic energy\`\n` +
                `  • \`${p}formula ohm law\`\n` +
                `  • \`${p}formula compound interest\`\n` +
                `  • \`${p}formula pythagoras\`\n\n` +
                `📚 *Quick topics:* quadratic, pythagoras, force, velocity, distance, ohm law, ideal gas, molarity, density, power, wave, speed, slope, area circle, area triangle, volume cylinder, simple interest, compound interest`
            )

        // ── Try local lookup first (fast, no AI needed) ──────────────────────
        const localKey = Object.keys(LOCAL_FORMULAS).find(k => topic.includes(k) || k.includes(topic))
        if (localKey) {
            return void M.reply(
                `📐 *FORMULA* 📐\n` +
                `${'━'.repeat(28)}\n\n` +
                `🔍 *Topic:* ${topic}\n\n` +
                `${LOCAL_FORMULAS[localKey]}\n\n` +
                `${'━'.repeat(28)}\n` +
                `📢 *How to use:* \`${p}formula <topic>\`\n` +
                `⚡ _Powered by RedzeoX_`
            )
        }

        // ── AI fallback for topics not in local list ──────────────────────────
        await M.reply('📐 _Looking up formula... please wait!_ ⏳')

        const result = await studyAI(`Give me the formula for: ${topic}`, SYSTEM, 300)

        if (!result)
            return void M.reply(NO_AI_MSG(p))

        return void M.reply(
            `📐 *${topic}*\n\n` +
            `${result}\n\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
