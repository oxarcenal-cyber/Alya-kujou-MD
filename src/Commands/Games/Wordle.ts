import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Word List ────────────────────────────────────────────────────────────────

const WORDS = [
    'apple','brain','chair','dance','eagle','flame','grape','heart','index','juice',
    'knife','lemon','mango','night','ocean','piano','queen','river','stone','tiger',
    'ultra','voice','water','xenon','youth','zebra','angel','blood','cream','dream',
    'earth','flood','ghost','hotel','image','joint','karma','light','magic','north',
    'opera','pearl','quick','radio','smile','table','union','valve','wheat','xerox',
    'yield','zones','alarm','brave','cloud','doubt','empty','fence','giant','house',
    'india','japan','kenya','lunar','monks','novel','olive','proud','quest','round',
    'sharp','tower','under','vivid','witch','exact','young','zonal','about','beach',
    'candy','digit','equal','flute','guard','habit','input','jewel','kneel','lance',
    'march','nerve','often','plant','quote','reach','spend','train','upper','visit',
    'waste','extra','yeast','zesty','alert','brush','civil','depth','every','field',
    'greed','human','inner','judge','knack','lover','money','nurse','offer','power',
    'ridge','skill','taste','urban','vault','world','xenon','yours','zones'
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface WordleGame {
    word: string
    guesses: string[]
    maxGuesses: number
    startedAt: number
}

const games = new Map<string, WordleGame>()

const GREEN  = '🟩'
const YELLOW = '🟨'
const GRAY   = '⬛'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function checkGuess(guess: string, word: string): string[] {
    const result = Array(5).fill(GRAY)
    const wordArr  = word.split('')
    const guessArr = guess.split('')
    const used     = Array(5).fill(false)

    // First pass: greens
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === wordArr[i]) {
            result[i] = GREEN
            used[i]   = true
            guessArr[i] = '*'
        }
    }
    // Second pass: yellows
    for (let i = 0; i < 5; i++) {
        if (result[i] === GREEN) continue
        const idx = wordArr.findIndex((c, j) => c === guessArr[i] && !used[j])
        if (idx !== -1) {
            result[i]   = YELLOW
            used[idx]   = true
        }
    }
    return result
}

function renderBoard(game: WordleGame): string {
    const rows: string[] = []

    for (let i = 0; i < game.maxGuesses; i++) {
        if (i < game.guesses.length) {
            const guess  = game.guesses[i]
            const colors = checkGuess(guess, game.word)
            rows.push(colors.join('') + `  \`${guess.toUpperCase()}\``)
        } else {
            rows.push('⬜⬜⬜⬜⬜')
        }
    }

    return rows.join('\n')
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('wordle', {
    description: '5-letter word guess karo — 6 attempts! 🟩',
    category: 'games',
    usage: 'wordle start | wordle <5-letter-guess> | wordle quit',
    aliases: ['wrd', 'wordl'],
    cooldown: 2,
    exp: 30,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input  = context.trim().toLowerCase()
        const key    = `${M.from}_${M.sender.jid}`
        const game   = games.get(key)

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🟩 *WORDLE*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}wordle start\` → Nayi game shuru karo\n` +
                    `  \`${prefix}wordle apple\` → 5-letter word guess karo\n` +
                    `  \`${prefix}wordle quit\` → Game band karo\n\n` +
                    `🎨 *Color Guide:*\n` +
                    `  🟩 → Sahi letter, sahi jagah\n` +
                    `  🟨 → Letter hai but galat jagah\n` +
                    `  ⬛ → Letter nahi hai word mein\n\n` +
                    `⚡ *Rules:*\n` +
                    `  📝 5-letter English word guess karo\n` +
                    `  🔢 Max 6 attempts\n` +
                    `  🏆 Sahi guess = 50 gold reward!`,
                footer: '🟩 RedzeoX Wordle',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🟩 Start Wordle', id: `${prefix}wordle start` }]
            } as any, { quoted: M.message })

        // ── Quit ──────────────────────────────────────────────────────────
        if (input === 'quit' || input === 'stop') {
            if (!game) return void M.reply('❌ Koi game nahi chal rahi!')
            games.delete(key)
            return void M.reply(`🛑 Game quit!\n_Word tha: *${game.word.toUpperCase()}*_`)
        }

        // ── Start ─────────────────────────────────────────────────────────
        if (input === 'start' || input === 'new') {
            if (game) return void M.reply(
                `❌ Pehle se game chal rahi hai!\n` +
                `📢 Guess karo: \`${prefix}wordle <word>\`\n` +
                `📢 Quit: \`${prefix}wordle quit\``
            )
            const word = WORDS[Math.floor(Math.random() * WORDS.length)]
            games.set(key, { word, guesses: [], maxGuesses: 6, startedAt: Date.now() })

            return void M.reply(
                `🟩 *WORDLE SHURU!*\n\n` +
                `📝 5-letter word guess karo!\n` +
                `🔢 Attempts: *6*\n\n` +
                `⬜⬜⬜⬜⬜\n`.repeat(6).trim() +
                `\n\n🎨 Color guide:\n` +
                `  🟩 Sahi jagah | 🟨 Galat jagah | ⬛ Nahi hai\n\n` +
                `📢 *Guess karo:* \`${prefix}wordle apple\``
            )
        }

        // ── Guess ─────────────────────────────────────────────────────────
        if (!game)
            return void M.reply(`❌ Pehle game shuru karo!\n📢 \`${prefix}wordle start\``)

        if (input.length !== 5 || !/^[a-z]+$/.test(input))
            return void M.reply(`❌ *5-letter English word* daalo!\n📢 Example: \`${prefix}wordle brain\``)

        if (game.guesses.includes(input))
            return void M.reply(`❌ *${input.toUpperCase()}* pehle try kar chuke ho!`)

        game.guesses.push(input)
        const won = input === game.word
        const out = game.guesses.length >= game.maxGuesses

        const board = renderBoard(game)
        const attemptNum = game.guesses.length

        if (won) {
            games.delete(key)
            const reward = 50
            await this.client.DB.setCrystal(M.sender.jid, reward)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🎉 *WORDLE SOLVED!* 🎉\n\n` +
                    board +
                    `\n\n✅ *${input.toUpperCase()}* — Correct!\n` +
                    `🔢 Attempts: *${attemptNum}/6*\n\n` +
                    `💰 *+${reward} gold* reward! 🏆`,
                footer: '🟩 RedzeoX Wordle',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🟩 New Game', id: `${prefix}wordle start` }]
            } as any, { quoted: M.message })
        }

        if (out) {
            games.delete(key)
            return void await this.client.sendMessage(M.from, {
                text:
                    `💀 *GAME OVER!*\n\n` +
                    board +
                    `\n\n❌ Sahi word tha: *${game.word.toUpperCase()}*`,
                footer: '🟩 RedzeoX Wordle',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🟩 Try Again', id: `${prefix}wordle start` }]
            } as any, { quoted: M.message })
        }

        const left = game.maxGuesses - attemptNum
        return void await this.client.sendMessage(M.from, {
            text:
                `🟩 *WORDLE*\n\n` +
                board +
                `\n\n🔢 *${left} attempt${left !== 1 ? 's' : ''} bache hain!*`,
            footer: '🟩 RedzeoX Wordle',
            buttonsFormat: 'buttons',
            buttons: [{ text: '🚪 Quit Game', id: `${prefix}wordle quit` }]
        } as any, { quoted: M.message })
    }
}
