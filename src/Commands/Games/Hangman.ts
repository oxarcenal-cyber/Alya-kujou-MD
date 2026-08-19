import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

const wordList = [
    'javascript', 'typescript', 'programming', 'computer', 'keyboard', 'monitor', 'internet', 'network',
    'database', 'algorithm', 'developer', 'software', 'hardware', 'password', 'instagram', 'whatsapp',
    'elephant', 'butterfly', 'chocolate', 'adventure', 'friendship', 'beautiful', 'education', 'hospital',
    'mountain', 'umbrella', 'telephone', 'guitar', 'calendar', 'dictionary', 'basketball', 'football',
    'television', 'microphone', 'sandwich', 'library', 'birthday', 'diamond', 'science', 'engineering',
    'airplane', 'submarine', 'restaurant', 'apartment', 'festival', 'language', 'universe', 'treasure'
]

const stages = [
    '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========='
]

interface HangmanGame {
    word: string
    guessed: string[]
    wrong: number
}

const activeGames = new Map<string, HangmanGame>()

@Command('hangman', {
    description: 'Play Hangman — guess the hidden word letter by letter! 🎯',
    category: 'games',
    usage: 'hangman start || hangman <letter> || hangman quit',
    aliases: ['hm'],
    cooldown: 3,
    exp: 20,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input = context.trim().toLowerCase()
        const game = activeGames.get(M.from)

        if (!input)
            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🎯 *HANGMAN*\n\n` +
                        `Chupe hue word ko guess karo — ek letter ek baar!\n\n` +
                        `📢 Letter type karo: \`${prefix}hangman a\`\n` +
                        `📢 Quit: \`${prefix}hangman quit\``,
                    footer: '🎯 RedzeoX Hangman',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎯 Start Game', id: `${prefix}hangman start` }]
                } as any,
                { quoted: M.message }
            )

        if (input === 'quit' || input === 'stop') {
            if (!game) return void M.reply('❌ Koi game nahi chal raha!')
            activeGames.delete(M.from)
            return void M.reply(`🛑 Game quit!\n\n🔤 *Word tha:* ${game.word.toUpperCase()}`)
        }

        if (input === 'start' || input === 'new') {
            if (game)
                return void M.reply(
                    `⚠️ Game pehle se chal rahi hai!\n\n` +
                    `📢 Guess karo: \`${prefix}hangman <letter>\`\n` +
                    `Band karne ke liye: \`${prefix}hangman quit\``
                )
            const word = wordList[Math.floor(Math.random() * wordList.length)]
            activeGames.set(M.from, { word, guessed: [], wrong: 0 })
            return void M.reply(
                `🎯 *HANGMAN SHURU!*\n\n` +
                `\`\`\`${stages[0]}\`\`\`\n\n` +
                `🔤 *Word:* ${this.getDisplay(word, [])}\n` +
                `📏 *Letters:* ${word.length}\n` +
                `💀 *Chances left:* 6/6\n\n` +
                `📢 *Letter guess karo:* \`${prefix}hangman a\``
            )
        }

        if (!game)
            return void M.reply(
                `❌ Koi game nahi chal rahi!\n📢 *Shuru karo:* \`${prefix}hangman start\``
            )

        if (input.length !== 1 || !/^[a-z]$/.test(input))
            return void M.reply(`❌ Sirf ek letter type karo (a-z)\n📢 Example: \`${prefix}hangman a\``)

        if (game.guessed.includes(input))
            return void M.reply(
                `⚠️ *"${input.toUpperCase()}"* pehle se try kiya!\n🔡 *Used:* ${game.guessed.sort().join(', ')}`
            )

        game.guessed.push(input)
        if (!game.word.includes(input)) game.wrong++

        const display = this.getDisplay(game.word, game.guessed)
        const isWon = !display.includes('_')
        const isLost = game.wrong >= 6

        if (isWon) {
            activeGames.delete(M.from)
            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🎉 *WINNER!* 🎉\n\n\`\`\`${stages[game.wrong]}\`\`\`\n\n` +
                        `✅ *Word:* ${game.word.toUpperCase()}\n\n🏆 Tumne jeeta!`,
                    footer: '🎯 RedzeoX Hangman',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎯 New Game', id: `${prefix}hangman start` }]
                } as any,
                { quoted: M.message }
            )
        }

        if (isLost) {
            activeGames.delete(M.from)
            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `💀 *GAME OVER!* 💀\n\n\`\`\`${stages[6]}\`\`\`\n\n` +
                        `❌ *Word tha:* ${game.word.toUpperCase()}\n\n😔 Better luck next time!`,
                    footer: '🎯 RedzeoX Hangman',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎯 New Game', id: `${prefix}hangman start` }]
                } as any,
                { quoted: M.message }
            )
        }

        const correct = game.word.includes(input)
        return void M.reply(
            `${correct ? `✅ *"${input.toUpperCase()}"* sahi hai!` : `❌ *"${input.toUpperCase()}"* nahi hai!`}\n\n` +
            `\`\`\`${stages[game.wrong]}\`\`\`\n\n` +
            `🔤 *Word:* ${display}\n` +
            `💀 *Wrong:* ${game.wrong}/6\n` +
            `🔡 *Used:* ${game.guessed.sort().join(', ')}\n\n` +
            `📢 *Next guess:* \`${prefix}hangman <letter>\``
        )
    }

    private getDisplay = (word: string, guessed: string[]): string =>
        word.split('').map(l => (guessed.includes(l) ? l.toUpperCase() : '_')).join(' ')
}
