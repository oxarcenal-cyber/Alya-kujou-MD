import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

interface TTTGame {
    board: (string | null)[]
}

const playerGames = new Map<string, TTTGame>()

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

@Command('tictactoe', {
    description: 'Play Tic Tac Toe against the bot! ❌⭕',
    category: 'games',
    usage: 'tictactoe start || tictactoe <1-9> || tictactoe quit',
    aliases: ['ttt'],
    cooldown: 3,
    exp: 25,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input = context.trim().toLowerCase()
        const key = `${M.from}_${M.sender.jid}`
        const game = playerGames.get(key)

        if (!input)
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌⭕ *TIC TAC TOE*\n\n` +
                    `Bot ke khilaf khelo! Tum ❌, Bot ⭕\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}ttt start\` → Nayi game shuru karo\n` +
                    `  \`${prefix}ttt 5\` → Position 5 pe chaal chalo\n` +
                    `  \`${prefix}ttt quit\` → Game band karo\n\n` +
                    `*Board positions:*\n\`\`\`\n 1 | 2 | 3 \n───────────\n 4 | 5 | 6 \n───────────\n 7 | 8 | 9 \n\`\`\``,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌⭕ Start Game', id: `${prefix}ttt start` }]
            } as any, { quoted: M.message })

        if (input === 'quit' || input === 'stop') {
            if (!game) return void M.reply('❌ Koi game nahi chal rahi!')
            playerGames.delete(key)
            return void M.reply('🛑 Game quit!')
        }

        if (input === 'start' || input === 'new') {
            playerGames.set(key, { board: Array(9).fill(null) })
            const newGame = playerGames.get(key)!
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌⭕ *GAME SHURU!*\n\nTum ❌ | Bot ⭕\n\n` +
                    `${this.renderBoard(newGame.board)}\n\n` +
                    `👇 Position choose karo:`,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttons: [{
                    text: '📍 Choose Position',
                    sections: [{
                        title: '🎯 Pick Your Move',
                        rows: [
                            { title: '1️⃣ Position 1', description: 'Top-left',    id: `${prefix}ttt 1` },
                            { title: '2️⃣ Position 2', description: 'Top-center',  id: `${prefix}ttt 2` },
                            { title: '3️⃣ Position 3', description: 'Top-right',   id: `${prefix}ttt 3` },
                            { title: '4️⃣ Position 4', description: 'Mid-left',    id: `${prefix}ttt 4` },
                            { title: '5️⃣ Position 5', description: 'Center',      id: `${prefix}ttt 5` },
                            { title: '6️⃣ Position 6', description: 'Mid-right',   id: `${prefix}ttt 6` },
                            { title: '7️⃣ Position 7', description: 'Bottom-left', id: `${prefix}ttt 7` },
                            { title: '8️⃣ Position 8', description: 'Bottom-center', id: `${prefix}ttt 8` },
                            { title: '9️⃣ Position 9', description: 'Bottom-right', id: `${prefix}ttt 9` },
                        ]
                    }]
                }]
            } as any, { quoted: M.message })
        }

        const pos = parseInt(input)
        if (isNaN(pos) || pos < 1 || pos > 9)
            return void M.reply(`❌ 1-9 ke beech number daalo!\n📢 Example: \`${prefix}ttt 5\``)

        if (!game)
            return void M.reply(`❌ Koi game nahi chal rahi!\n📢 *Shuru karo:* \`${prefix}ttt start\``)

        if (game.board[pos - 1] !== null)
            return void M.reply(`❌ Woh position pehle se bhari hui hai! Aur jagah try karo.`)

        game.board[pos - 1] = 'X'
        if (this.checkWin(game.board, 'X')) {
            playerGames.delete(key)
            return void await this.client.sendMessage(M.from, {
                text: `🎉 *TUMNE JEETA!* 🎉\n\n${this.renderBoard(game.board)}\n\n🏆 Congratulations!`,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌⭕ New Game', id: `${prefix}ttt start` }]
            } as any, { quoted: M.message })
        }
        if (this.isFull(game.board)) {
            playerGames.delete(key)
            return void await this.client.sendMessage(M.from, {
                text: `🤝 *TIE!*\n\n${this.renderBoard(game.board)}\n\nKoi nahi jeeta!`,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌⭕ New Game', id: `${prefix}ttt start` }]
            } as any, { quoted: M.message })
        }

        const botMove = this.getBotMove(game.board)
        game.board[botMove] = 'O'
        if (this.checkWin(game.board, 'O')) {
            playerGames.delete(key)
            return void await this.client.sendMessage(M.from, {
                text: `😂 *BOT JEETA!*\n\n${this.renderBoard(game.board)}\n\nBetter luck next time!`,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌⭕ Try Again', id: `${prefix}ttt start` }]
            } as any, { quoted: M.message })
        }
        if (this.isFull(game.board)) {
            playerGames.delete(key)
            return void await this.client.sendMessage(M.from, {
                text: `🤝 *TIE!*\n\n${this.renderBoard(game.board)}\n\nKoi nahi jeeta!`,
                footer: '❌⭕ RedzeoX TicTacToe',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌⭕ New Game', id: `${prefix}ttt start` }]
            } as any, { quoted: M.message })
        }

        return void await this.client.sendMessage(M.from, {
            text: `⭕ Bot ne chaal chali!\n\n${this.renderBoard(game.board)}\n\n👇 Tumhari baari:`,
            footer: '❌⭕ RedzeoX TicTacToe',
            buttons: [{
                text: '📍 Choose Position',
                sections: [{
                    title: '🎯 Pick Your Move',
                    rows: [
                        { title: '1️⃣ Position 1', description: 'Top-left',       id: `${prefix}ttt 1` },
                        { title: '2️⃣ Position 2', description: 'Top-center',     id: `${prefix}ttt 2` },
                        { title: '3️⃣ Position 3', description: 'Top-right',      id: `${prefix}ttt 3` },
                        { title: '4️⃣ Position 4', description: 'Mid-left',       id: `${prefix}ttt 4` },
                        { title: '5️⃣ Position 5', description: 'Center',         id: `${prefix}ttt 5` },
                        { title: '6️⃣ Position 6', description: 'Mid-right',      id: `${prefix}ttt 6` },
                        { title: '7️⃣ Position 7', description: 'Bottom-left',    id: `${prefix}ttt 7` },
                        { title: '8️⃣ Position 8', description: 'Bottom-center',  id: `${prefix}ttt 8` },
                        { title: '9️⃣ Position 9', description: 'Bottom-right',   id: `${prefix}ttt 9` },
                    ]
                }]
            }]
        } as any, { quoted: M.message })
    }

    private renderBoard = (board: (string | null)[]): string => {
        const c = board.map((cell, i) => (cell === 'X' ? '❌' : cell === 'O' ? '⭕' : `${i + 1}`))
        return `\`\`\`\n ${c[0]} | ${c[1]} | ${c[2]} \n───────────\n ${c[3]} | ${c[4]} | ${c[5]} \n───────────\n ${c[6]} | ${c[7]} | ${c[8]} \n\`\`\``
    }

    private checkWin = (board: (string | null)[], p: string): boolean =>
        winCombos.some(([a, b, c]) => board[a] === p && board[b] === p && board[c] === p)

    private isFull = (board: (string | null)[]): boolean => board.every(c => c !== null)

    private getBotMove = (board: (string | null)[]): number => {
        for (const [a, b, c] of winCombos) {
            if (board[a] === 'O' && board[b] === 'O' && board[c] === null) return c
            if (board[a] === 'O' && board[c] === 'O' && board[b] === null) return b
            if (board[b] === 'O' && board[c] === 'O' && board[a] === null) return a
        }
        for (const [a, b, c] of winCombos) {
            if (board[a] === 'X' && board[b] === 'X' && board[c] === null) return c
            if (board[a] === 'X' && board[c] === 'X' && board[b] === null) return b
            if (board[b] === 'X' && board[c] === 'X' && board[a] === null) return a
        }
        if (board[4] === null) return 4
        const empty = board.map((v, i) => (v === null ? i : -1)).filter(i => i >= 0)
        return empty[Math.floor(Math.random() * empty.length)]
    }
}
