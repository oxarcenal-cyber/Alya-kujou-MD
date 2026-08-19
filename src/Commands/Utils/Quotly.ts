import { Command, BaseCommand, Message } from '../../Structures'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { IArgs } from '../../Types'
import axios from 'axios'
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas'

@Command('quotly', {
    description: 'Generates a Telegram-style quote sticker from any text',
    category: 'utils',
    usage: 'quotly [text] | quotly [quote a message]',
    aliases: ['q'],
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context && (!M.quoted || M.quoted.content === ''))
            return void M.reply('Provide the text you want as a quote sticker!')

        const content = context ? context.trim() : (M.quoted?.content as string)
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 1) users.push(M.sender.jid)

        const user = users[0]
        const username =
            user === M.sender.jid
                ? M.sender.username
                : this.client.contact.getContact(user).username

        let pfpBuf: Buffer | null = null
        try {
            const pfpUrl =
                (await this.client.profilePictureUrl(user, 'image').catch(() => null)) ||
                'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            const res = await axios.get(pfpUrl, { responseType: 'arraybuffer', timeout: 8000 })
            pfpBuf = Buffer.from(res.data)
        } catch {
            pfpBuf = null
        }

        try {
            const buffer = await this.buildQuoteImage(username, content, pfpBuf)
            const sticker = new Sticker(buffer, {
                pack: 'Quote',
                author: M.sender.username,
                type: StickerTypes.FULL,
                categories: ['✨', '💗'],
                quality: 90
            })
            return void (await M.reply(await sticker.build(), 'sticker'))
        } catch (err) {
            console.error('[Quotly] canvas error:', (err as Error).message)
            return void M.reply('Failed to generate quote sticker. Please try again.')
        }
    }

    private buildQuoteImage = async (
        username: string,
        text: string,
        pfpBuf: Buffer | null
    ): Promise<Buffer> => {
        const W = 512
        const PADDING = 20
        const AVATAR_SIZE = 52
        const FONT_NAME = 18
        const FONT_TEXT = 16
        const LINE_HEIGHT = FONT_TEXT + 6
        const MAX_TEXT_W = W - PADDING * 2 - AVATAR_SIZE - 16

        // Pre-measure text to get canvas height
        const tmpCanvas = createCanvas(W, 10)
        const tmpCtx = tmpCanvas.getContext('2d')
        tmpCtx.font = `${FONT_TEXT}px sans-serif`
        const lines = this.wrapText(tmpCtx, text, MAX_TEXT_W)
        const textBlockH = lines.length * LINE_HEIGHT

        const H = Math.max(AVATAR_SIZE + PADDING * 2, PADDING * 2 + FONT_NAME + 8 + textBlockH + 10)

        const canvas = createCanvas(W, H)
        const ctx = canvas.getContext('2d')

        // Background
        ctx.fillStyle = '#1e1e2e'
        this.roundRect(ctx, 0, 0, W, H, 18)
        ctx.fill()

        // Left accent bar
        ctx.fillStyle = '#cba6f7'
        ctx.fillRect(PADDING, PADDING, 4, H - PADDING * 2)

        // Avatar circle
        const AX = PADDING + 4 + 12
        const AY = PADDING + 4
        ctx.save()
        ctx.beginPath()
        ctx.arc(AX + AVATAR_SIZE / 2, AY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2)
        ctx.clip()
        if (pfpBuf) {
            try {
                const img = await loadImage(pfpBuf)
                ctx.drawImage(img, AX, AY, AVATAR_SIZE, AVATAR_SIZE)
            } catch {
                ctx.fillStyle = '#45475a'
                ctx.fillRect(AX, AY, AVATAR_SIZE, AVATAR_SIZE)
            }
        } else {
            ctx.fillStyle = '#45475a'
            ctx.fillRect(AX, AY, AVATAR_SIZE, AVATAR_SIZE)
        }
        ctx.restore()

        // Username
        const TX = AX + AVATAR_SIZE + 12
        const TY_NAME = PADDING + FONT_NAME
        ctx.fillStyle = '#cba6f7'
        ctx.font = `bold ${FONT_NAME}px sans-serif`
        ctx.fillText(username, TX, TY_NAME, W - TX - PADDING)

        // Message text
        ctx.fillStyle = '#cdd6f4'
        ctx.font = `${FONT_TEXT}px sans-serif`
        let lineY = TY_NAME + 10
        for (const line of lines) {
            ctx.fillText(line, TX, lineY)
            lineY += LINE_HEIGHT
        }

        return canvas.toBuffer('image/png')
    }

    private wrapText = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
        const lines: string[] = []
        for (const paragraph of text.split('\n')) {
            const words = paragraph.split(' ')
            let current = ''
            for (const word of words) {
                const test = current ? `${current} ${word}` : word
                if (ctx.measureText(test).width > maxW && current) {
                    lines.push(current)
                    current = word
                } else {
                    current = test
                }
            }
            if (current) lines.push(current)
        }
        return lines.slice(0, 18) // cap at 18 lines so sticker stays readable
    }

    private roundRect = (
        ctx: CanvasRenderingContext2D,
        x: number, y: number, w: number, h: number, r: number
    ): void => {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.arcTo(x + w, y, x + w, y + r, r)
        ctx.lineTo(x + w, y + h - r)
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
        ctx.lineTo(x + r, y + h)
        ctx.arcTo(x, y + h, x, y + h - r, r)
        ctx.lineTo(x, y + r)
        ctx.arcTo(x, y, x + r, y, r)
        ctx.closePath()
    }
}
