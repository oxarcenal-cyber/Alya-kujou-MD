import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

const choices = ['rock', 'paper', 'scissors'] as const
type Choice = typeof choices[number]

const emojis: Record<Choice, string> = {
    rock: '🪨 Rock',
    paper: '📄 Paper',
    scissors: '✂️ Scissors'
}

const beats: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
}

@Command('rps', {
    description: 'Play Rock Paper Scissors against the bot ✂️',
    category: 'games',
    usage: 'rps <rock/paper/scissors>',
    aliases: ['rockpaperscissors'],
    cooldown: 5,
    exp: 15,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const sendChoiceButtons = async (text: string): Promise<void> => {
            await this.client.sendMessage(
                M.from,
                {
                    text,
                    footer: '✂️ RedzeoX RPS',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🪨 Rock',     id: `${prefix}rps rock` },
                        { text: '📄 Paper',    id: `${prefix}rps paper` },
                        { text: '✂️ Scissors', id: `${prefix}rps scissors` }
                    ]
                } as any,
                { quoted: M.message }
            )
        }

        if (!context.trim())
            return void sendChoiceButtons(
                `✂️ *ROCK PAPER SCISSORS*\n\n` +
                `Bot ke khilaf khelo! Apna choice choose karo 👇`
            )

        const player = context.trim().toLowerCase() as Choice
        if (!choices.includes(player))
            return void sendChoiceButtons(
                `❌ Invalid choice! Neeche se choose karo 👇`
            )

        const bot = choices[Math.floor(Math.random() * choices.length)]
        let result = ''
        if (player === bot) result = "🤝 *It's a Tie!*"
        else if (beats[player] === bot) result = '🎉 *You Win!* 🏆'
        else result = '😂 *Bot Wins!* Better luck next time!'

        return void sendChoiceButtons(
            `✂️ *ROCK PAPER SCISSORS* ✂️\n` +
            `${'─'.repeat(25)}\n\n` +
            `👤 *You:* ${emojis[player]}\n` +
            `🤖 *Bot:* ${emojis[bot]}\n\n` +
            `${result}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *Play again — choose karo:*`
        )
    }
}
