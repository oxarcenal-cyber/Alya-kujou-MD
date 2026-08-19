import { Command, BaseCommand, Message } from '../../Structures'
import { askGroq } from '../../lib/GroqFun'

// ─── Fallback Roasts (agar Groq unavailable ho) ───────────────────────────────
const FALLBACK_ROASTS = [
    "I'd roast you, but my mom said I'm not allowed to burn trash.",
    "You're the reason the gene pool needs a lifeguard.",
    "I'd explain it to you, but I left my crayons at home.",
    'Somewhere out there, a tree is producing oxygen for you. You owe that tree an apology.',
    'If laughter is the best medicine, your face must be curing the world.',
    'You have your entire life to be an idiot. Take the day off.',
    "You're not stupid; you just have bad luck thinking.",
    'I would challenge you to a battle of wits, but you appear to be unarmed.',
    "You're about as useful as a screen door on a submarine.",
    "I'd say you're dull as a doorknob, but that'd be insulting to doorknobs.",
    "You're proof that even evolution makes mistakes.",
    "I've seen people like you before, but I had to pay admission.",
    'If ignorance is bliss, you must be the happiest person alive.',
    'You have miles to go before you reach mediocre.',
    "I'd agree with you but then we'd both be wrong.",
    "You're not completely useless — you can always serve as a bad example.",
    'I envy people who have never met you.',
    'Forget AI — you are already outdoing robots at being emotionless.',
    'If you were any more brain-dead, you would need someone to water you.',
    'The only way you could be more wrong is if you tried harder.'
]

@Command('roast', {
    description: 'Roast a user with a savage AI line 🔥',
    category: 'fun',
    usage: 'roast [@user / quote user]',
    aliases: ['burn'],
    cooldown: 10,
    exp: 15
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        const target = users.length ? users[0] : M.sender.jid
        const targetName = target.split('@')[0]

        // Groq se fresh AI roast lene ki koshish karo
        const aiRoast = await askGroq(
            `Generate ONE savage, funny, single-line roast for a person named "${targetName}". ` +
            `Keep it witty, creative, and under 20 words. ` +
            `Hinglish (Hindi+English mix) ya sirf English mein ho. ` +
            `Sirf roast line do — koi explanation, quotes ya prefix mat lagao.`
        )

        const roast = aiRoast ?? FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)]

        return void M.reply(
            `🔥 *ROAST* 🔥\n` +
            `${'─'.repeat(25)}\n\n` +
            `@${targetName} — ${roast}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}roast @user\`\n` +
            `_Compliment ke liye: \`${prefix}compliment @user\`_`,
            'text', undefined, undefined, undefined, [target]
        )
    }
}
