import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { renderBlackjackTable, BJCard, BJStatus } from '../../lib/BlackjackRenderer'
import { join } from 'path'

// ─── Types ────────────────────────────────────────────────────────────────────
interface BJGame {
    playerHand: BJCard[]
    dealerHand: BJCard[]
    bet:        number
    balance:    number
    playerJid:  string
    phase:      'playing' | 'done'
}

// ─── State ────────────────────────────────────────────────────────────────────
const games = new Map<string, BJGame>()
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── Card Logic ───────────────────────────────────────────────────────────────
const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']

function makeCard(rank: string, suit: string): BJCard {
    let value = parseInt(rank)
    if (isNaN(value)) value = rank === 'A' ? 11 : 10
    return { suit, rank, value }
}

function makeDeck(): BJCard[] {
    const deck: BJCard[] = []
    for (const suit of SUITS)
        for (const rank of RANKS)
            deck.push(makeCard(rank, suit))
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
}

const deck: BJCard[] = makeDeck()
let deckIdx = 0

function drawCard(): BJCard {
    if (deckIdx >= deck.length) deckIdx = 0
    return deck[deckIdx++]
}

function handValue(hand: BJCard[]): number {
    let total = hand.reduce((s, c) => s + c.value, 0)
    let aces  = hand.filter(c => c.rank === 'A').length
    while (total > 21 && aces > 0) { total -= 10; aces-- }
    return total
}

// ─── Shared button rows ───────────────────────────────────────────────────────
function newGameRows(p: string) {
    return [
        { title: '💰 Bet 100 gold',  description: 'Minimum bet', id: `${p}bj 100`   },
        { title: '💰 Bet 500 gold',  description: 'Small bet',   id: `${p}bj 500`   },
        { title: '💰 Bet 1000 gold', description: 'Medium bet',  id: `${p}bj 1000`  },
        { title: '💰 Bet 5000 gold', description: 'Big bet',     id: `${p}bj 5000`  },
        { title: '💰 Bet 10K gold',  description: 'High roller', id: `${p}bj 10000` },
    ]
}

function newGameListBtn(p: string) {
    return [{ text: '🃏 New Game', sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(p) }] }]
}

// ─── Image sender ─────────────────────────────────────────────────────────────
async function sendTable(
    client:      any,
    from:        string,
    game:        BJGame,
    status:      BJStatus,
    hideDealer:  boolean,
    resultMsg?:  string,
    quoted?:     any,
    dealerExtra?: string        // extra info line for dealer phase
) {
    const pv = handValue(game.playerHand)
    const dv = handValue(game.dealerHand)
    const p  = client.config.prefix

    const buf = await renderBlackjackTable({
        playerHand:  game.playerHand,
        dealerHand:  game.dealerHand,
        playerScore: pv,
        dealerScore: dv,
        bet:         game.bet,
        balance:     game.balance,
        status,
        hideDealer,
        resultMsg,
    })

    // ── Captions ──────────────────────────────────────────────────────────────
    const dealerScore = hideDealer ? game.dealerHand[0].value : dv
    const dealerStatus = !hideDealer && dv > 21
        ? '💥 Dealer BUST!'
        : !hideDealer && dv >= 17
        ? `✅ Dealer stands at ${dv}`
        : !hideDealer
        ? `⬆️ Dealer score: ${dv} — needs 17+`
        : `👀 Dealer shows: ${dealerScore}`

    const captions: Record<BJStatus, string> = {
        playing: `🃏 *BLACKJACK* — Your move!\n\n` +
                 `📊 *Your score:* ${pv}${pv === 21 ? ' — 21! Auto-stand' : pv > 15 ? ' — Careful!' : ''}\n` +
                 `${dealerStatus}`,

        dealer:  `⏳ *Dealer is playing...*\n\n` +
                 `📊 *Dealer score:* ${dv}${dv >= 17 ? ' (stands)' : ' — drawing more...'}\n` +
                 `📊 *Your score:* ${pv}\n` +
                 (dealerExtra ? `\n${dealerExtra}` : ''),

        bust:      `💥 *BUST!* Your score went over 21.\n\n📊 Your: *${pv}* | Dealer: *${dv}*\n💰 Lost: *${game.bet.toLocaleString()} gold*`,
        win:       `🏆 *YOU WIN!*\n\n📊 Your: *${pv}* | Dealer: *${dv}*\n💰 Won: *+${game.bet.toLocaleString()} gold*`,
        lose:      `😢 *Dealer wins!*\n\n📊 Your: *${pv}* | Dealer: *${dv}*\n💔 Lost: *${game.bet.toLocaleString()} gold*`,
        push:      `🤝 *PUSH!* It's a tie — bet returned.\n\n📊 Both scored: *${pv}*`,
        blackjack: `🃏 *BLACKJACK!* Natural 21!\n\n💰 Payout: *+${Math.floor(game.bet * 1.5).toLocaleString()} gold* (1.5x)`,
    }

    // ── Buttons per status ────────────────────────────────────────────────────
    const isDone   = ['bust','win','lose','push','blackjack'].includes(status)
    const isDealer = status === 'dealer'

    const msgPayload: any = {
        image:    buf,
        mimetype: 'image/jpeg',
        caption:  captions[status],
        footer:   '🃏 RedzeoX BlackJack',
    }

    if (isDone) {
        // Game over — list button to start new game
        msgPayload.buttons = newGameListBtn(p)
    } else if (isDealer) {
        // Dealer playing — show new game list (player can queue next)
        msgPayload.buttons = newGameListBtn(p)
    } else {
        // Playing — Hit / Stand / Quit action buttons
        msgPayload.buttonsFormat = 'buttons'
        msgPayload.buttons = [
            { text: '🃏 Hit',   id: `${p}bj hit`   },
            { text: '✋ Stand', id: `${p}bj stand`  },
            { text: '🚪 Quit',  id: `${p}bj quit`   },
        ]
    }

    await client.sendMessage(from, msgPayload, quoted ? { quoted } : undefined)
}

// ─── Motivation lines ─────────────────────────────────────────────────────────
const MOTIVATIONS = [
    `🌟 *"Every loss is a lesson in disguise. Rise up and play smarter!"*`,
    `💪 *"The comeback is always stronger than the setback."*`,
    `🔥 *"Champions don't quit after one bad hand. Shuffle up and deal!"*`,
    `⚡ *"Failure is just the universe telling you — try again, but wiser."*`,
    `🌈 *"Even the best players lose sometimes. What matters is you keep going."*`,
    `🎯 *"One loss doesn't define you. Your courage to play again does."*`,
    `💎 *"Diamonds are made under pressure. Keep pushing!"*`,
    `🚀 *"You didn't lose — you just found one way that didn't work. Next hand!"*`,
    `🌊 *"Every wave crashes, but the ocean never gives up. Neither should you."*`,
    `🏆 *"Legends aren't built on wins alone — they're built on getting back up."*`,
    `✨ *"The cards don't always go your way, but your spirit is unbeatable."*`,
    `🎲 *"Risk is what separates players from spectators. You're a player!"*`,
    `🌙 *"Even the darkest night ends with sunrise. Your winning streak is coming."*`,
    `⚔️ *"A warrior doesn't fear defeat — they learn from it and strike again."*`,
    `🎪 *"Fortune favors the bold. Take a breath, bet smart, and go again!"*`,
]

// ─── Lose GIF sender ──────────────────────────────────────────────────────────
function sendLoseGif(client: any, from: string, bet: number, prefix: string) {
    const key    = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]
    const gifBuf = client.assets.get(key) as Buffer | undefined
    if (!gifBuf) return
    client.utils.gifToMp4(gifBuf)
        .then((mp4: Buffer) =>
            client.sendMessage(from, {
                video:       mp4,
                gifPlayback: true,
                mimetype:    'video/mp4',
                caption:     `😭 *-${bet.toLocaleString()} gold gone!* Better luck next time...`,
                footer:      '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '💬 What now?',
                    sections: [{
                        title: '🎭 Choose an option',
                        rows: [
                            {
                                title:       '💔 Sorry for your loss',
                                description: 'Let the bot comfort you',
                                id:          `${prefix}bj sorry`,
                            },
                            {
                                title:       '📋 Bot Menu',
                                description: 'See all available commands',
                                id:          `${prefix}help`,
                            },
                            {
                                title:       '🌟 Motivate Me!',
                                description: 'Get a powerful motivation boost',
                                id:          `${prefix}bj motivate`,
                            },
                        ]
                    }]
                }]
            } as any)
        )
        .catch(() => {})
}

// ─── Command ──────────────────────────────────────────────────────────────────
@Command('blackjack', {
    description: 'Play Blackjack against the dealer 🃏',
    category:    'games',
    usage:       'blackjack <amount> | blackjack hit | blackjack stand | blackjack quit',
    aliases:     ['bj', 'bkjk'],
    cooldown:    0,
    exp:         25
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context, args }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input  = context.trim().toLowerCase()
        const key    = `${M.from}_${M.sender.jid}`
        const game   = games.get(key)

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🃏 *BLACKJACK — Casino Style*\n\n` +
                    `📢 *Commands:*\n` +
                    `  \`${prefix}bj <amount>\` → Place bet & start\n` +
                    `  \`${prefix}bj hit\`      → Take another card\n` +
                    `  \`${prefix}bj stand\`    → Hold your hand\n` +
                    `  \`${prefix}bj quit\`     → Forfeit the game\n\n` +
                    `📖 *Rules:*\n` +
                    `  🎯 Beat dealer without going over 21\n` +
                    `  🤖 Dealer must draw until 17+\n` +
                    `  🃏 Natural Blackjack = 1.5× payout!\n` +
                    `  💀 Bust (>21) = instant loss\n\n` +
                    `💰 *Min:* 100 gold  |  *Max:* 50,000 gold`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Start Game',
                    sections: [{
                        title: '💰 Choose Bet Amount',
                        rows: newGameRows(prefix)
                    }]
                }]
            } as any, { quoted: M.message })

        // ── Sorry ─────────────────────────────────────────────────────────
        if (input === 'sorry') {
            const sorrys = [
                `🤗 *Hey, it's okay!* The dealer got lucky this time — that's blackjack!\n\nYour gold will come back, I promise. 💛`,
                `💙 *I'm really sorry you lost!* But honestly? You played bravely.\n\nThe next hand is yours to win. 🃏`,
                `🫂 *Aw, that hurt to watch!* Don't worry — even pros lose sometimes.\n\nTake a breath and come back stronger! 💪`,
                `😔 *So sorry about that loss!* The cards weren't kind this round.\n\nBut hey, every great winner has lost a hundred times before winning big! 🌟`,
                `💜 *That one stung, didn't it?* It's alright — the table will turn.\n\nI believe in you! Try again when you're ready. 🎯`,
            ]
            const msg = sorrys[Math.floor(Math.random() * sorrys.length)]
            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Play Again',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
        }

        // ── Motivate ───────────────────────────────────────────────────────
        if (input === 'motivate') {
            const quote = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌟 *Daily Motivation — Just for You*\n\n` +
                    `${quote}\n\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `💰 Ready to bounce back? Get back to the table!`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Play Again',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
        }

        // ── Quit ──────────────────────────────────────────────────────────
        if (input === 'quit' || input === 'stop') {
            if (!game) return void await this.client.sendMessage(M.from, {
                text: `❌ *No active game!*\n\nStart one with \`${prefix}bj <amount>\``,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Start Game',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
            games.delete(key)
            return void await this.client.sendMessage(M.from, {
                text: `🛑 *Game quit.* Bet is forfeited.\n\nStart a new game anytime!`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 New Game',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
        }

        // ── Hit ───────────────────────────────────────────────────────────
        if (input === 'hit') {
            if (!game) return void await this.client.sendMessage(M.from, {
                text: `❌ *No active game!*\n\nStart one first:`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Start Game',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
            if (game.phase === 'done') return void M.reply(`❌ Game over! Start new: \`${prefix}bj <amount>\``)

            game.playerHand.push(drawCard())
            const pv = handValue(game.playerHand)

            if (pv > 21) {
                await this.client.DB.setCrystal(M.sender.jid, -game.bet)
                game.balance -= game.bet
                games.delete(key)
                await sendTable(this.client, M.from, game, 'bust', false, `💥 BUST! -${game.bet.toLocaleString()} GOLD`, M.message)
                sendLoseGif(this.client, M.from, game.bet, prefix)
                return
            }

            if (pv === 21) return void this.resolveGame(M, game, key)
            return void await sendTable(this.client, M.from, game, 'playing', true, undefined, M.message)
        }

        // ── Stand ─────────────────────────────────────────────────────────
        if (input === 'stand') {
            if (!game) return void await this.client.sendMessage(M.from, {
                text: `❌ *No active game!*\n\nStart one first:`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Start Game',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })
            if (game.phase === 'done') return void M.reply('❌ Game already over!')
            return void this.resolveGame(M, game, key)
        }

        // ── Already in game ───────────────────────────────────────────────
        if (game && game.phase === 'playing') {
            return void await sendTable(this.client, M.from, game, 'playing', true, undefined, M.message)
        }

        // ── New Game ──────────────────────────────────────────────────────
        const amount = parseInt(args[0])
        if (!amount || amount < 100)
            return void await this.client.sendMessage(M.from, {
                text: `❌ *Enter a valid bet!* Minimum is *100 gold*\n\nPick an amount:`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Choose Bet',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })

        if (amount > 50_000)
            return void M.reply(`❌ Maximum bet is *50,000 gold*`)

        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (wallet < amount)
            return void await this.client.sendMessage(M.from, {
                text: `❌ *Not enough gold!*\n\nYour wallet: *${wallet.toLocaleString()} gold*\nPick a lower bet:`,
                footer: '🃏 RedzeoX BlackJack',
                buttons: [{
                    text: '🃏 Choose Bet',
                    sections: [{ title: '💰 Choose Bet Amount', rows: newGameRows(prefix) }]
                }]
            } as any, { quoted: M.message })

        // Deal cards
        const pHand = [drawCard(), drawCard()]
        const dHand = [drawCard(), drawCard()]

        const newGame: BJGame = {
            playerHand: pHand,
            dealerHand: dHand,
            bet:        amount,
            balance:    wallet,
            playerJid:  M.sender.jid,
            phase:      'playing'
        }
        games.set(key, newGame)

        if (handValue(pHand) === 21) return void this.resolveGame(M, newGame, key)
        return void await sendTable(this.client, M.from, newGame, 'playing', true, undefined, M.message)
    }

    // ── Resolve: dealer plays ──────────────────────────────────────────────
    private resolveGame = async (M: Message, game: BJGame, key: string): Promise<void> => {
        const prefix = this.client.config.prefix
        game.phase = 'done'

        // Reveal dealer's hand
        await sendTable(
            this.client, M.from, game, 'dealer', false,
            undefined, M.message,
            `🎴 Dealer reveals hidden card!`
        )
        await sleep(1200)

        // Dealer draws until 17+
        while (handValue(game.dealerHand) < 17) {
            game.dealerHand.push(drawCard())
            const dv = handValue(game.dealerHand)
            await sleep(800)
            await sendTable(
                this.client, M.from, game, 'dealer', false,
                undefined, M.message,
                dv >= 17
                    ? `✅ Dealer stands at ${dv} — resolving...`
                    : `⬆️ Dealer drew a card — now at ${dv}`
            )
        }

        // Determine result
        const pv = handValue(game.playerHand)
        const dv = handValue(game.dealerHand)
        const isBlackjack = pv === 21 && game.playerHand.length === 2

        let status: BJStatus
        let resultMsg: string
        let delta = 0

        if (pv > 21) {
            status    = 'bust'
            delta     = -game.bet
            resultMsg = `💥 BUST! -${game.bet.toLocaleString()} GOLD`
        } else if (dv > 21 || pv > dv) {
            const payout = isBlackjack ? Math.floor(game.bet * 1.5) : game.bet
            delta        = payout
            status       = isBlackjack ? 'blackjack' : 'win'
            resultMsg    = `${isBlackjack ? '🃏 BLACKJACK!' : '🏆 YOU WIN!'} +${payout.toLocaleString()} GOLD`
        } else if (pv === dv) {
            status    = 'push'
            delta     = 0
            resultMsg = `🤝 PUSH — Bet Returned`
        } else {
            status    = 'lose'
            delta     = -game.bet
            resultMsg = `😢 DEALER WINS -${game.bet.toLocaleString()} GOLD`
        }

        if (delta !== 0) await this.client.DB.setCrystal(M.sender.jid, delta)
        game.balance += delta
        games.delete(key)

        await sleep(400)
        await sendTable(this.client, M.from, game, status, false, resultMsg, M.message)

        // Lose GIF 😭
        if (status === 'lose' || status === 'bust') {
            sendLoseGif(this.client, M.from, game.bet, prefix)
        }
    }
}
