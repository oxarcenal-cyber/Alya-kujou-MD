/**
 * ᴘᴇʀꜱᴏɴᴀ ꜱʜᴏᴡᴄᴀꜱᴇ — Character Grid Image Generator
 * Jab user sirf prefix type kare, yeh sab 6 characters ka
 * ek sundar grid card banata hai with active persona highlighted.
 */

import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas'
import { readFile } from 'fs-extra'
import { join } from 'path'
import type { TPersona } from './Persona'

// ── Character definitions ─────────────────────────────────────────────────────
const CHARACTERS: {
    key: TPersona
    name: string
    anime: string
    file: string
    accent: string
    emoji: string
}[] = [
    { key: 'rias',    name: 'Rias Gremory',   anime: 'High School DxD',          file: 'RG.png',       accent: '#e0317a', emoji: '👑' },
    { key: 'alya',    name: 'Alya Kujou',     anime: 'Alya in Russian',           file: 'Alya.png',     accent: '#38b6f0', emoji: '❄️' },
    { key: 'akino',   name: 'Akino Himejima', anime: 'High School DxD',          file: 'Akino.png',    accent: '#e8a0c0', emoji: '🌸' },
    { key: 'hinata',  name: 'Hinata Hyuga',   anime: 'Naruto',                    file: 'Hinata.png',   accent: '#9b7fd4', emoji: '💜' },
    { key: 'zerotwo', name: 'Zero Two',       anime: 'Darling in the FranXX',    file: 'ZeroTwo.png',  accent: '#e8306a', emoji: '🌺' },
    { key: 'miku',    name: 'Hatsune Miku',   anime: 'Vocaloid',                  file: 'Miku.jpg',     accent: '#39c5bb', emoji: '🎵' },
]

const PUBLIC_PATH = join(__dirname, '..', '..', 'public')

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
): void {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

// ── Main builder ──────────────────────────────────────────────────────────────
export async function buildPersonaShowcase(activePersona: TPersona): Promise<Buffer> {
    // Layout constants
    const COLS = 3
    const ROWS = 2
    const CARD_W = 260
    const CARD_H = 320
    const PAD = 24
    const GAP = 18
    const HEADER_H = 100
    const FOOTER_H = 60

    const W = PAD * 2 + COLS * CARD_W + (COLS - 1) * GAP
    const H = HEADER_H + PAD + ROWS * CARD_H + (ROWS - 1) * GAP + FOOTER_H

    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')

    // Active character data
    const active = CHARACTERS.find(c => c.key === activePersona) || CHARACTERS[0]

    // ── Background gradient ──────────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, W, H)
    bgGrad.addColorStop(0, '#0d0d1a')
    bgGrad.addColorStop(0.5, '#12121f')
    bgGrad.addColorStop(1, '#0a0a16')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    // Subtle glow blob in background (active accent color)
    const blobGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6)
    blobGrad.addColorStop(0, hexToRgba(active.accent, 0.08))
    blobGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = blobGrad
    ctx.fillRect(0, 0, W, H)

    // ── Header ────────────────────────────────────────────────────────────────
    // Title line
    ctx.save()
    ctx.font = 'bold 28px Sans'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('✨ Choose Your Persona ✨', W / 2, PAD + 34)

    // Subtitle
    ctx.font = '15px Sans'
    ctx.fillStyle = hexToRgba(active.accent, 0.9)
    ctx.fillText(`Active: ${active.emoji} ${active.name}`, W / 2, PAD + 58)

    // Thin accent divider
    const divGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0)
    divGrad.addColorStop(0, 'rgba(255,255,255,0)')
    divGrad.addColorStop(0.5, hexToRgba(active.accent, 0.7))
    divGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.strokeStyle = divGrad
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(PAD + 30, HEADER_H - 16)
    ctx.lineTo(W - PAD - 30, HEADER_H - 16)
    ctx.stroke()
    ctx.restore()

    // ── Character cards ───────────────────────────────────────────────────────
    for (let i = 0; i < CHARACTERS.length; i++) {
        const ch = CHARACTERS[i]
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const cx = PAD + col * (CARD_W + GAP)
        const cy = HEADER_H + PAD + row * (CARD_H + GAP)
        const isActive = ch.key === activePersona

        // Card background
        ctx.save()
        roundRect(ctx, cx, cy, CARD_W, CARD_H, 20)
        ctx.clip()

        // Card bg — darker for inactive, slightly glowing for active
        const cardBg = ctx.createLinearGradient(cx, cy, cx, cy + CARD_H)
        if (isActive) {
            cardBg.addColorStop(0, hexToRgba(ch.accent, 0.30))
            cardBg.addColorStop(1, hexToRgba(ch.accent, 0.10))
        } else {
            cardBg.addColorStop(0, 'rgba(255,255,255,0.07)')
            cardBg.addColorStop(1, 'rgba(255,255,255,0.03)')
        }
        ctx.fillStyle = cardBg
        ctx.fillRect(cx, cy, CARD_W, CARD_H)
        ctx.restore()

        // Card border
        ctx.save()
        roundRect(ctx, cx, cy, CARD_W, CARD_H, 20)
        ctx.strokeStyle = isActive ? hexToRgba(ch.accent, 0.85) : 'rgba(255,255,255,0.10)'
        ctx.lineWidth = isActive ? 2.5 : 1
        ctx.stroke()
        ctx.restore()

        // Active glow outer ring
        if (isActive) {
            ctx.save()
            roundRect(ctx, cx - 3, cy - 3, CARD_W + 6, CARD_H + 6, 23)
            ctx.strokeStyle = hexToRgba(ch.accent, 0.25)
            ctx.lineWidth = 6
            ctx.stroke()
            ctx.restore()
        }

        // ── Character image (circle crop) ─────────────────────────────────
        const IMG_R = 72
        const imgCX = cx + CARD_W / 2
        const imgCY = cy + IMG_R + 22

        try {
            const imgBuf = await readFile(join(PUBLIC_PATH, ch.file))
            const img = await loadImage(imgBuf)

            // Circle clip
            ctx.save()
            ctx.beginPath()
            ctx.arc(imgCX, imgCY, IMG_R, 0, Math.PI * 2)
            ctx.clip()
            // Draw image centered+cropped in circle
            const scale = Math.max((IMG_R * 2) / img.width, (IMG_R * 2) / img.height)
            const dw = img.width * scale
            const dh = img.height * scale
            ctx.drawImage(img, imgCX - dw / 2, imgCY - dh / 2, dw, dh)
            ctx.restore()

            // Circle border ring
            ctx.save()
            ctx.beginPath()
            ctx.arc(imgCX, imgCY, IMG_R + 3, 0, Math.PI * 2)
            const ringGrad = ctx.createLinearGradient(imgCX - IMG_R, imgCY - IMG_R, imgCX + IMG_R, imgCY + IMG_R)
            ringGrad.addColorStop(0, ch.accent)
            ringGrad.addColorStop(1, hexToRgba(ch.accent, 0.4))
            ctx.strokeStyle = ringGrad
            ctx.lineWidth = isActive ? 4 : 2
            ctx.stroke()
            ctx.restore()
        } catch {
            // Fallback circle with emoji
            ctx.save()
            ctx.beginPath()
            ctx.arc(imgCX, imgCY, IMG_R, 0, Math.PI * 2)
            ctx.fillStyle = hexToRgba(ch.accent, 0.3)
            ctx.fill()
            ctx.font = `${IMG_R}px Sans`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(ch.emoji, imgCX, imgCY)
            ctx.restore()
        }

        // ── Active badge ─────────────────────────────────────────────────
        if (isActive) {
            const badgeR = 14
            const badgeX = imgCX + IMG_R - 4
            const badgeY = imgCY - IMG_R + 4
            ctx.save()
            ctx.beginPath()
            ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2)
            ctx.fillStyle = ch.accent
            ctx.fill()
            ctx.font = 'bold 13px Sans'
            ctx.fillStyle = '#ffffff'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('✓', badgeX, badgeY)
            ctx.restore()
        }

        // ── Character name ────────────────────────────────────────────────
        const nameY = imgCY + IMG_R + 22
        ctx.save()
        ctx.textAlign = 'center'
        ctx.font = `bold 17px Sans`
        ctx.fillStyle = isActive ? ch.accent : '#e8e8f0'
        ctx.fillText(ch.name, imgCX, nameY)

        // Anime label
        ctx.font = `12px Sans`
        ctx.fillStyle = 'rgba(200,200,220,0.55)'
        ctx.fillText(ch.anime, imgCX, nameY + 22)

        // Emoji + theme key pill
        const pillY = nameY + 50
        const pillW = 110
        const pillH = 28
        const pillX = imgCX - pillW / 2

        roundRect(ctx, pillX, pillY - pillH / 2, pillW, pillH, 14)
        ctx.fillStyle = isActive ? hexToRgba(ch.accent, 0.25) : 'rgba(255,255,255,0.06)'
        ctx.fill()
        roundRect(ctx, pillX, pillY - pillH / 2, pillW, pillH, 14)
        ctx.strokeStyle = isActive ? hexToRgba(ch.accent, 0.6) : 'rgba(255,255,255,0.12)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = `bold 12px Sans`
        ctx.fillStyle = isActive ? ch.accent : 'rgba(200,200,220,0.6)'
        ctx.fillText(`${ch.emoji} ${ch.key}`, imgCX, pillY + 4)
        ctx.restore()
    }

    // ── Footer hint ───────────────────────────────────────────────────────────
    const footerY = HEADER_H + PAD + ROWS * CARD_H + (ROWS - 1) * GAP + 24
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '13px Sans'
    ctx.fillStyle = 'rgba(200,200,220,0.40)'
    ctx.fillText(`Type  -settheme <name>  to switch persona`, W / 2, footerY + 14)
    ctx.restore()

    return canvas.toBuffer('image/png')
}
