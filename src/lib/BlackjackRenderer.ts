/**
 * BlackjackRenderer — Casino-style Blackjack table image generator
 * Produces a 1000×580px image with green felt, pixel-art cards, gold trim
 */

import { createCanvas, registerFont, CanvasRenderingContext2D } from 'canvas'
import { join } from 'path'

const ROOT = join(__dirname, '..', '..')
try { registerFont(join(ROOT, 'assets', 'fonts', 'FredokaOne-Regular.ttf'),  { family: 'FredokaOne' }) } catch {}
try { registerFont(join(ROOT, 'assets', 'fonts', 'ComicNeue-Bold.ttf'),      { family: 'ComicNeue', weight: 'bold' }) } catch {}
try { registerFont(join(ROOT, 'assets', 'fonts', 'ComicNeue-Regular.ttf'),   { family: 'ComicNeue' }) } catch {}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BJCard { suit: string; rank: string; value: number }
export type BJStatus = 'playing' | 'bust' | 'win' | 'lose' | 'push' | 'blackjack' | 'dealer'

export interface BJRenderData {
    playerHand:  BJCard[]
    dealerHand:  BJCard[]
    playerScore: number
    dealerScore: number
    bet:         number
    balance:     number
    status:      BJStatus
    hideDealer:  boolean   // true = hide dealer's second card
    resultMsg?:  string    // e.g. "YOU WIN! +500 GOLD"
}

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 1000, H = 580
const RED_SUITS  = new Set(['♥', '♦'])

// ─── Helpers ──────────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

function shadow(ctx: CanvasRenderingContext2D, color: string, blur: number, cb: () => void) {
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; cb(); ctx.restore()
}

// ─── Card Drawing ─────────────────────────────────────────────────────────────
function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, card: BJCard, hidden = false) {
    const CW = 90, CH = 126, CR = 8

    // Drop shadow
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.55)'
    ctx.shadowBlur  = 14
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 5
    roundRect(ctx, x, y, CW, CH, CR)
    ctx.fillStyle = hidden ? '#1a4a8a' : '#f8f3e8'
    ctx.fill()
    ctx.restore()

    if (hidden) {
        // Card back — diagonal stripe pattern
        ctx.save()
        roundRect(ctx, x, y, CW, CH, CR)
        ctx.clip()

        // Base
        const bg = ctx.createLinearGradient(x, y, x + CW, y + CH)
        bg.addColorStop(0,   '#1855a0')
        bg.addColorStop(0.5, '#0e3d82')
        bg.addColorStop(1,   '#1855a0')
        ctx.fillStyle = bg
        ctx.fill()

        // Diamond pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'
        ctx.lineWidth = 1
        for (let i = -CH; i < CW + CH; i += 14) {
            ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i + CH, y + CH); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(x + i, y + CH); ctx.lineTo(x + i + CH, y); ctx.stroke()
        }

        // Inner border
        roundRect(ctx, x + 5, y + 5, CW - 10, CH - 10, 5)
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Suit symbol center
        ctx.font = '38px serif'
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('♠', x + CW / 2, y + CH / 2)

        ctx.restore()
        return
    }

    const isRed = RED_SUITS.has(card.suit)
    const fg    = isRed ? '#c0392b' : '#1a1a2e'

    ctx.save()
    roundRect(ctx, x, y, CW, CH, CR)
    ctx.clip()

    // White card face
    const faceBg = ctx.createLinearGradient(x, y, x, y + CH)
    faceBg.addColorStop(0, '#ffffff')
    faceBg.addColorStop(1, '#f0ead8')
    ctx.fillStyle = faceBg
    ctx.fill()

    // Card border
    roundRect(ctx, x + 1, y + 1, CW - 2, CH - 2, CR - 1)
    ctx.strokeStyle = isRed ? '#d9534f' : '#2c2c5e'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Top-left rank
    ctx.font      = `bold 19px 'FredokaOne', sans-serif`
    ctx.fillStyle = fg
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(card.rank, x + 7, y + 6)

    // Top-left suit
    ctx.font = '14px serif'
    ctx.fillText(card.suit, x + 7, y + 26)

    // Center big suit
    const bigSuit = card.rank === 'A' ? 54 :
                    ['K','Q','J'].includes(card.rank) ? 44 : 42
    ctx.font = `${bigSuit}px serif`
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle    = fg

    // Slight glow for red suits
    if (isRed) {
        ctx.shadowColor = 'rgba(192,57,43,0.3)'
        ctx.shadowBlur  = 6
    }
    ctx.fillText(card.suit, x + CW / 2, y + CH / 2)
    ctx.shadowBlur = 0

    // Bottom-right (rotated)
    ctx.save()
    ctx.translate(x + CW - 7, y + CH - 6)
    ctx.rotate(Math.PI)
    ctx.font = `bold 19px 'FredokaOne', sans-serif`
    ctx.fillStyle = fg
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(card.rank, 0, 0)
    ctx.font = '14px serif'
    ctx.fillText(card.suit, 0, 20)
    ctx.restore()

    // Face card label ribbon
    if (['K','Q','J'].includes(card.rank)) {
        const label = card.rank === 'K' ? 'KING' : card.rank === 'Q' ? 'QUEEN' : 'JACK'
        ctx.fillStyle = isRed ? 'rgba(192,57,43,0.12)' : 'rgba(26,26,46,0.10)'
        ctx.fillRect(x, y + CH / 2 + 24, CW, 20)
        ctx.font = `bold 9px 'ComicNeue', sans-serif`
        ctx.fillStyle = fg
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, x + CW / 2, y + CH / 2 + 34)
    }

    ctx.restore()
}

// ─── Hand row ─────────────────────────────────────────────────────────────────
function drawHand(ctx: CanvasRenderingContext2D, hand: BJCard[], cx: number, cy: number, hideSecond: boolean) {
    const CW = 90, gap = 20
    const total = hand.length * CW + Math.max(0, hand.length - 1) * gap
    let x = cx - total / 2
    for (let i = 0; i < hand.length; i++) {
        drawCard(ctx, x, cy, hand[i], i === 1 && hideSecond)
        x += CW + gap
    }
}

// ─── Score pill ───────────────────────────────────────────────────────────────
function drawScore(ctx: CanvasRenderingContext2D, cx: number, cy: number, score: number, bust: boolean, bj: boolean) {
    const label  = bust ? 'BUST' : bj ? 'BJ!' : String(score)
    const bgCol  = bust ? '#c0392b' : bj ? '#f39c12' : 'rgba(0,0,0,0.75)'
    const border = bust ? '#ff6b6b' : bj ? '#ffe066' : 'rgba(255,255,255,0.3)'
    const PW = 62, PH = 28

    ctx.save()
    roundRect(ctx, cx - PW / 2, cy - PH / 2, PW, PH, 14)
    ctx.fillStyle = bgCol
    ctx.fill()
    roundRect(ctx, cx - PW / 2, cy - PH / 2, PW, PH, 14)
    ctx.strokeStyle = border
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.font = `bold 15px 'FredokaOne', sans-serif`
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, cx, cy + 1)
    ctx.restore()
}

// ─── Section label ────────────────────────────────────────────────────────────
function label(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, size = 13, color = 'rgba(255,255,255,0.50)') {
    ctx.save()
    ctx.font = `bold ${size}px 'FredokaOne', sans-serif`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
    ctx.restore()
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export async function renderBlackjackTable(data: BJRenderData): Promise<Buffer> {
    const canvas = createCanvas(W, H)
    const ctx    = canvas.getContext('2d') as any as CanvasRenderingContext2D

    // ── 1. Background — deep casino green ────────────────────────────────────
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, W * 0.75)
    bgGrad.addColorStop(0,   '#0f7a3a')
    bgGrad.addColorStop(0.6, '#0a5a2a')
    bgGrad.addColorStop(1,   '#063318')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    // Subtle felt texture — horizontal scan lines
    ctx.fillStyle = 'rgba(0,0,0,0.04)'
    for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 2)
    }

    // ── 2. Outer gold frame ───────────────────────────────────────────────────
    shadow(ctx, 'rgba(0,0,0,0.7)', 30, () => {
        roundRect(ctx, 14, 14, W - 28, H - 28, 20)
        ctx.strokeStyle = '#8B6914'
        ctx.lineWidth   = 4
        ctx.stroke()
    })
    roundRect(ctx, 18, 18, W - 36, H - 36, 18)
    ctx.strokeStyle = '#c9a227'
    ctx.lineWidth   = 1.5
    ctx.stroke()

    // ── 3. Top HUD bar ────────────────────────────────────────────────────────
    const hudH = 52
    const hudGrad = ctx.createLinearGradient(0, 0, 0, hudH)
    hudGrad.addColorStop(0, 'rgba(0,0,0,0.82)')
    hudGrad.addColorStop(1, 'rgba(0,0,0,0.60)')
    ctx.fillStyle = hudGrad
    ctx.fillRect(0, 0, W, hudH)

    // Gold bottom border of HUD
    ctx.fillStyle = '#8B6914'
    ctx.fillRect(0, hudH - 2, W, 2)
    ctx.fillStyle = '#c9a227'
    ctx.fillRect(0, hudH - 1, W, 1)

    // Title
    ctx.save()
    ctx.font      = `bold 22px 'FredokaOne', sans-serif`
    ctx.fillStyle = '#f1c40f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,0.8)'
    ctx.shadowBlur  = 6
    ctx.fillText('♠  BLACKJACK  ♠', W / 2, hudH / 2)
    ctx.restore()

    // Balance pill (left)
    const balText = `💰 ${data.balance.toLocaleString()} GOLD`
    ctx.save()
    roundRect(ctx, 28, 12, 200, 28, 14)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fill()
    roundRect(ctx, 28, 12, 200, 28, 14)
    ctx.strokeStyle = '#8B6914'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.font = `bold 13px 'FredokaOne', sans-serif`
    ctx.fillStyle = '#f1c40f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(balText, 128, 26)
    ctx.restore()

    // Bet pill (right)
    const betText = `BET: ${data.bet.toLocaleString()} G`
    ctx.save()
    roundRect(ctx, W - 228, 12, 200, 28, 14)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fill()
    roundRect(ctx, W - 228, 12, 200, 28, 14)
    ctx.strokeStyle = '#8B6914'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.font = `bold 13px 'FredokaOne', sans-serif`
    ctx.fillStyle = data.bet > 0 ? '#2ecc71' : 'rgba(255,255,255,0.4)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(betText, W - 128, 26)
    ctx.restore()

    // ── 4. Divider line ───────────────────────────────────────────────────────
    const divY = H / 2 + 10
    const divGrad = ctx.createLinearGradient(40, 0, W - 40, 0)
    divGrad.addColorStop(0,    'transparent')
    divGrad.addColorStop(0.15, '#8B6914')
    divGrad.addColorStop(0.5,  '#f1c40f')
    divGrad.addColorStop(0.85, '#8B6914')
    divGrad.addColorStop(1,    'transparent')
    ctx.fillStyle = divGrad
    ctx.fillRect(40, divY, W - 80, 2)

    // Diamond ornament center
    ctx.save()
    ctx.translate(W / 2, divY + 1)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = '#f1c40f'
    ctx.fillRect(-7, -7, 14, 14)
    ctx.restore()
    ctx.save()
    ctx.translate(W / 2, divY + 1)
    ctx.rotate(Math.PI / 4)
    ctx.strokeStyle = '#8B6914'
    ctx.lineWidth = 1
    ctx.strokeRect(-7, -7, 14, 14)
    ctx.restore()

    // ── 5. Dealer area ────────────────────────────────────────────────────────
    const dealerCY = hudH + (divY - hudH) / 2
    label(ctx, W / 2, hudH + 22, '— DEALER —')

    if (data.dealerHand.length > 0) {
        drawHand(ctx, data.dealerHand, W / 2, dealerCY - 63 + 10, data.hideDealer)
        const dBust = !data.hideDealer && data.dealerScore > 21
        const showDScore = !data.hideDealer
        if (showDScore) {
            drawScore(ctx, W / 2, dealerCY + 76, data.dealerScore, dBust, false)
        } else {
            // Show only visible card value
            drawScore(ctx, W / 2, dealerCY + 76, data.dealerHand[0].value, false, false)
        }
    }

    // ── 6. Player area ────────────────────────────────────────────────────────
    const playerCY = divY + (H - divY) / 2 - 10
    label(ctx, W / 2, divY + 22, '— YOU —')

    if (data.playerHand.length > 0) {
        drawHand(ctx, data.playerHand, W / 2, playerCY - 63 + 5, false)
        const pBust = data.playerScore > 21
        const pBJ   = data.playerScore === 21 && data.playerHand.length === 2
        drawScore(ctx, W / 2, playerCY + 71, data.playerScore, pBust, pBJ)
    }

    // ── 7. Status bar (bottom) ────────────────────────────────────────────────
    const statusH = 54
    const statusY = H - statusH
    const statusGrad = ctx.createLinearGradient(0, statusY, 0, H)
    statusGrad.addColorStop(0, 'rgba(0,0,0,0.60)')
    statusGrad.addColorStop(1, 'rgba(0,0,0,0.85)')
    ctx.fillStyle = statusGrad
    ctx.fillRect(0, statusY, W, statusH)

    ctx.fillStyle = '#8B6914'
    ctx.fillRect(0, statusY, W, 2)
    ctx.fillStyle = '#c9a227'
    ctx.fillRect(0, statusY + 1, W, 1)

    // Status text
    const statusMap: Record<BJStatus, { text: string; color: string }> = {
        playing:   { text: '🃏  Hit or Stand?',         color: '#ecf0f1' },
        bust:      { text: '💥  BUST! Over 21',          color: '#e74c3c' },
        win:       { text: '🏆  YOU WIN!',               color: '#2ecc71' },
        lose:      { text: '😢  DEALER WINS',            color: '#e74c3c' },
        push:      { text: '🤝  PUSH — Bet Returned',    color: '#3498db' },
        blackjack: { text: '🃏  BLACKJACK! 1.5x Payout', color: '#f1c40f' },
        dealer:    { text: '⏳  Dealer is playing...',   color: '#f39c12' },
    }

    const st = statusMap[data.status]
    const displayText = data.resultMsg ?? st.text

    ctx.save()
    ctx.font = `bold 20px 'FredokaOne', sans-serif`
    ctx.fillStyle = data.resultMsg ? '#f1c40f' : st.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,0.9)'
    ctx.shadowBlur  = 8
    ctx.fillText(displayText, W / 2, statusY + statusH / 2)
    ctx.restore()

    // ── 8. Result overlay ─────────────────────────────────────────────────────
    if (['win','bust','lose','push','blackjack'].includes(data.status) && data.resultMsg) {
        // Dim overlay
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(0, hudH + 2, W, statusY - hudH - 2)

        // Big result banner
        const bannerW = 500, bannerH = 80
        const bx = (W - bannerW) / 2, by = H / 2 - bannerH / 2

        const bannerCol =
            data.status === 'blackjack' ? ['#f39c12','#c47f17'] :
            data.status === 'win'       ? ['#27ae60','#1a7a42'] :
            data.status === 'push'      ? ['#2980b9','#1c5a8a'] :
                                          ['#c0392b','#8c1c14']

        shadow(ctx, 'rgba(0,0,0,0.6)', 20, () => {
            const bannerGrad = ctx.createLinearGradient(bx, by, bx, by + bannerH)
            bannerGrad.addColorStop(0, bannerCol[0])
            bannerGrad.addColorStop(1, bannerCol[1])
            roundRect(ctx, bx, by, bannerW, bannerH, 12)
            ctx.fillStyle = bannerGrad
            ctx.fill()
        })

        roundRect(ctx, bx, by, bannerW, bannerH, 12)
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Shine
        const shine = ctx.createLinearGradient(bx, by, bx, by + bannerH / 2)
        shine.addColorStop(0, 'rgba(255,255,255,0.15)')
        shine.addColorStop(1, 'transparent')
        roundRect(ctx, bx, by, bannerW, bannerH / 2, 12)
        ctx.fillStyle = shine
        ctx.fill()

        ctx.save()
        ctx.font = `bold 34px 'FredokaOne', sans-serif`
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur  = 10
        ctx.fillText(data.resultMsg, W / 2, by + bannerH / 2)
        ctx.restore()
    }

    return canvas.toBuffer('image/jpeg', { quality: 0.93 })
}
