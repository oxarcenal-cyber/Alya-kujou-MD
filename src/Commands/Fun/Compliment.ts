import { Command, BaseCommand, Message } from '../../Structures'
import { t } from '../../lib'

const compliments = [
    'You have a great sense of humor! 😄',
    'You always know how to make people smile 😊',
    "You're genuinely one of the kindest people around!",
    'Your positivity is absolutely contagious!',
    'You make people around you feel special.',
    'You are more amazing than you realize.',
    'Your energy lights up any room (or group chat)! ✨',
    "You're creative in ways that genuinely inspire others.",
    'I really admire your dedication and passion.',
    'You handle tough situations with so much grace.',
    "You're smarter than you give yourself credit for.",
    'The world is genuinely a better place with you in it.',
    'Your sense of style is on another level!',
    'You always go above and beyond — people notice.',
    'You have a magical ability to make things better.',
    'Your thoughtfulness means more than you know.',
    "You're a total rockstar in disguise! 🎸",
    'People are lucky to have you around.',
    'You have a heart of gold. Truly. 💛',
    "You're like sunshine on a rainy day ☀️"
]

@Command('compliment', {
    description: 'Give a sweet compliment to someone 💖',
    category: 'fun',
    usage: 'compliment [@user / quote user]',
    aliases: ['comp', 'praise'],
    cooldown: 10,
    exp: 15
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang = await this.getLang(M)
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        const target = users.length ? users[0] : M.sender.jid
        const compliment = compliments[Math.floor(Math.random() * compliments.length)]
        return void M.reply(
            `💖 *COMPLIMENT* 💖\n` +
            `${'─'.repeat(25)}\n\n` +
            `@${target.split('@')[0]} — ${compliment}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}compliment @user\`\n` +
            t('fun_compliment_footer', lang, { prefix }),
            'text', undefined, undefined, undefined, [target]
        )
    }
}
