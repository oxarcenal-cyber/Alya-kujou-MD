/**
 * PokemonCardGen — Modern Pokemon TCG-style card image generator
 * Produces a 480×670px card matching the new full-art TCG aesthetic
 */

import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas'
import { join } from 'path'

const ROOT = join(__dirname, '..', '..')
try { registerFont(join(ROOT, 'assets', 'fonts', 'FredokaOne-Regular.ttf'), { family: 'FredokaOne' }) } catch {}
try { registerFont(join(ROOT, 'assets', 'fonts', 'ComicNeue-Bold.ttf'),    { family: 'ComicNeue', weight: 'bold' }) } catch {}
try { registerFont(join(ROOT, 'assets', 'fonts', 'ComicNeue-Regular.ttf'), { family: 'ComicNeue' }) } catch {}

// ─── Type Config ──────────────────────────────────────────────────────────────
interface TypeConfig {
    bg1: string; bg2: string       // background gradient
    glow: string                   // inner glow color
    circle: string                 // type circle color
    letter: string                 // single-letter symbol
    weakness: string               // weakness label
    weakColor: string              // weakness letter color
}

const TYPE_MAP: Record<string, TypeConfig> = {
    fire:     { bg1:'#FF6B35', bg2:'#CC2200', glow:'#FF4400', circle:'#FF5500', letter:'R', weakness:'W', weakColor:'#3399FF' },
    water:    { bg1:'#4BA3D9', bg2:'#1A5FA8', glow:'#2277CC', circle:'#2288EE', letter:'W', weakness:'L', weakColor:'#FFCC00' },
    electric: { bg1:'#FFD93D', bg2:'#E8A500', glow:'#FFBB00', circle:'#FFB800', letter:'L', weakness:'F', weakColor:'#AA5500' },
    grass:    { bg1:'#4CAF50', bg2:'#1B6B1B', glow:'#339933', circle:'#33AA33', letter:'G', weakness:'R', weakColor:'#FF5500' },
    psychic:  { bg1:'#FF80AB', bg2:'#C2185B', glow:'#FF1493', circle:'#EE1188', letter:'P', weakness:'D', weakColor:'#442266' },
    fighting: { bg1:'#C97B3A', bg2:'#7B3C0A', glow:'#AA5500', circle:'#BB4400', letter:'C', weakness:'P', weakColor:'#FF1493' },
    poison:   { bg1:'#AB47BC', bg2:'#6A1B9A', glow:'#9C27B0', circle:'#8822AA', letter:'X', weakness:'G', weakColor:'#33AA33' },
    ground:   { bg1:'#D4A843', bg2:'#8B6914', glow:'#C49A00', circle:'#BB8800', letter:'E', weakness:'W', weakColor:'#3399FF' },
    rock:     { bg1:'#B8A878', bg2:'#7A6A48', glow:'#A09060', circle:'#908050', letter:'K', weakness:'G', weakColor:'#33AA33' },
    ice:      { bg1:'#81D4FA', bg2:'#29B6F6', glow:'#4FC3F7', circle:'#29B6F6', letter:'I', weakness:'M', weakColor:'#FF5500' },
    bug:      { bg1:'#8BC34A', bg2:'#558B2F', glow:'#7CB342', circle:'#689F38', letter:'B', weakness:'R', weakColor:'#FF5500' },
    ghost:    { bg1:'#7E57C2', bg2:'#311B92', glow:'#673AB7', circle:'#5E35B1', letter:'H', weakness:'D', weakColor:'#442266' },
    dragon:   { bg1:'#7B1FA2', bg2:'#1A237E', glow:'#512DA8', circle:'#4527A0', letter:'N', weakness:'N', weakColor:'#7B1FA2' },
    dark:     { bg1:'#546E7A', bg2:'#1C313A', glow:'#37474F', circle:'#455A64', letter:'D', weakness:'C', weakColor:'#C97B3A' },
    steel:    { bg1:'#90A4AE', bg2:'#546E7A', glow:'#78909C', circle:'#607D8B', letter:'M', weakness:'R', weakColor:'#FF5500' },
    fairy:    { bg1:'#F48FB1', bg2:'#E91E8C', glow:'#F06292', circle:'#EC407A', letter:'Y', weakness:'M', weakColor:'#78909C' },
    flying:   { bg1:'#90CAF9', bg2:'#1565C0', glow:'#64B5F6', circle:'#42A5F5', letter:'A', weakness:'L', weakColor:'#FFCC00' },
    normal:   { bg1:'#BDBDBD', bg2:'#757575', glow:'#9E9E9E', circle:'#9E9E9E', letter:'N', weakness:'C', weakColor:'#C97B3A' },
}
const DEFAULT_TYPE: TypeConfig = TYPE_MAP.normal

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface PokemonCardData {
    displayName: string
    type: string
    hp: number
    artUrl: string
    attack1: { name: string; cost: number; damage: number }
    attack2?: { name: string; cost: number; damage: number }
    weakness: string
    retreat: number
    pokedexNum: number
    isEx: boolean
    isShiny?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawTypeCircle(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, r: number,
    color: string, letter: string
) {
    // Glow
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
    // White border
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
    // Letter
    ctx.save()
    ctx.font = `bold ${Math.round(r * 1.1)}px 'FredokaOne', fantasy`
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, x, y + 1)
    ctx.restore()
}

function drawCostDots(ctx: CanvasRenderingContext2D, x: number, y: number, count: number, color: string, letter: string) {
    for (let i = 0; i < Math.min(count, 4); i++) {
        drawTypeCircle(ctx, x + i * 22, y, 9, color, letter)
    }
}

// ─── Main card builder ────────────────────────────────────────────────────────
export async function buildPokemonCard(data: PokemonCardData): Promise<Buffer> {
    const W = 480, H = 670, R = 22
    const tc = TYPE_MAP[data.type.toLowerCase()] ?? DEFAULT_TYPE

    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')

    // ── 1. Clip to card shape ───────────────────────────────────────────────
    roundRect(ctx, 0, 0, W, H, R)
    ctx.clip()

    // ── 2. Background gradient ──────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.6, H)
    bgGrad.addColorStop(0,   tc.bg1 + 'EE')
    bgGrad.addColorStop(0.5, tc.bg2 + 'CC')
    bgGrad.addColorStop(1,   '#0a0a0a')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    // Diagonal shimmer overlay (metallic feel)
    const shimmer = ctx.createLinearGradient(0, 0, W, H)
    shimmer.addColorStop(0,   'rgba(255,255,255,0.12)')
    shimmer.addColorStop(0.4, 'rgba(255,255,255,0.04)')
    shimmer.addColorStop(0.6, 'rgba(255,255,255,0.08)')
    shimmer.addColorStop(1,   'rgba(255,255,255,0.02)')
    ctx.fillStyle = shimmer
    ctx.fillRect(0, 0, W, H)

    // ── 3. Pokemon artwork ──────────────────────────────────────────────────
    try {
        const art = await loadImage(data.artUrl)
        // Scale to fill most of the card, centered, slightly above middle
        const targetH = H * 0.70
        const scale = Math.min(W / art.width, targetH / art.height) * 1.05
        const aw = art.width  * scale
        const ah = art.height * scale
        const ax = (W - aw) / 2
        const ay = 70 + (targetH - ah) / 2 - 10

        // Soft drop shadow under art
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur  = 30
        ctx.shadowOffsetY = 12
        ctx.globalAlpha = 0.95
        ctx.drawImage(art, ax, ay, aw, ah)
        ctx.restore()
    } catch {}

    // ── 4. Header frosted bar ───────────────────────────────────────────────
    const HDR_H = 90
    ctx.save()
    const hdrGrad = ctx.createLinearGradient(0, 0, 0, HDR_H)
    hdrGrad.addColorStop(0, 'rgba(255,255,255,0.88)')
    hdrGrad.addColorStop(1, 'rgba(255,255,255,0.60)')
    ctx.fillStyle = hdrGrad
    ctx.fillRect(0, 0, W, HDR_H)

    // Bottom edge of header — type-colored line
    const hdrLine = ctx.createLinearGradient(0, 0, W, 0)
    hdrLine.addColorStop(0,   tc.bg2)
    hdrLine.addColorStop(0.5, tc.bg1)
    hdrLine.addColorStop(1,   tc.bg2)
    ctx.fillStyle = hdrLine
    ctx.fillRect(0, HDR_H - 4, W, 4)
    ctx.restore()

    // ── BASIC badge ──────────────────────────────────────────────────────────
    ctx.save()
    const badgeGrad = ctx.createLinearGradient(10, 10, 10, 34)
    badgeGrad.addColorStop(0, '#EEEEEE')
    badgeGrad.addColorStop(1, '#CCCCCC')
    ctx.fillStyle = badgeGrad
    ctx.strokeStyle = '#AAAAAA'
    ctx.lineWidth = 1
    roundRect(ctx, 10, 10, 54, 22, 6)
    ctx.fill(); ctx.stroke()
    ctx.font = "bold 11px 'ComicNeue', sans-serif"
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('BASIC', 37, 21)
    ctx.restore()

    // ── Pokemon name ─────────────────────────────────────────────────────────
    ctx.save()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    const exSuffix = data.isEx ? ' ex' : ''
    const shinyTag = data.isShiny ? ' ✦' : ''
    const fullName = data.displayName + shinyTag

    ctx.font = `bold 30px 'FredokaOne', fantasy`
    ctx.fillStyle = '#111'
    // Subtle text shadow
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur  = 4
    ctx.fillText(fullName, 12, 68)

    // "ex" in smaller italic style if isEx
    if (data.isEx) {
        const nameW = ctx.measureText(fullName).width
        ctx.font = `italic bold 22px 'FredokaOne', fantasy`
        ctx.fillStyle = tc.circle
        ctx.fillText('ex', 14 + nameW + 4, 68)
    }
    ctx.restore()

    // ── HP + type circle ─────────────────────────────────────────────────────
    ctx.save()
    // "HP" label
    ctx.font = "bold 13px 'ComicNeue', sans-serif"
    ctx.fillStyle = '#555'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('HP', W - 48, 40)
    // HP number
    ctx.font = `bold 38px 'FredokaOne', fantasy`
    ctx.fillStyle = '#CC2200'
    ctx.shadowColor = 'rgba(200,0,0,0.2)'
    ctx.shadowBlur = 6
    ctx.fillText(String(data.hp), W - 30, 72)
    ctx.restore()
    // Type circle
    drawTypeCircle(ctx, W - 16, 52, 15, tc.circle, tc.letter)

    // ── 5. Bottom dark overlay (attack + stats) ──────────────────────────────
    const BOT_H   = 185
    const BOT_Y   = H - BOT_H

    ctx.save()
    // Gradient from transparent to dark
    const botGrad = ctx.createLinearGradient(0, BOT_Y - 30, 0, H)
    botGrad.addColorStop(0,   'rgba(10,10,20,0)')
    botGrad.addColorStop(0.2, 'rgba(10,10,20,0.72)')
    botGrad.addColorStop(1,   'rgba(10,10,20,0.92)')
    ctx.fillStyle = botGrad
    ctx.fillRect(0, BOT_Y - 30, W, BOT_H + 30)
    ctx.restore()

    // ── Attack 1 ─────────────────────────────────────────────────────────────
    const ATK1_Y = BOT_Y + 28
    drawCostDots(ctx, 16, ATK1_Y - 8, data.attack1.cost, tc.circle, tc.letter)

    ctx.save()
    ctx.font = `bold 24px 'FredokaOne', fantasy`
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 4
    ctx.fillText(data.attack1.name, 16 + data.attack1.cost * 22 + 8, ATK1_Y - 6)

    ctx.font = `bold 30px 'FredokaOne', fantasy`
    ctx.fillStyle = '#FFD700'
    ctx.textAlign = 'right'
    ctx.shadowColor = 'rgba(200,150,0,0.5)'
    ctx.fillText(String(data.attack1.damage), W - 14, ATK1_Y - 6)
    ctx.restore()

    // ── Attack 2 (if exists) ──────────────────────────────────────────────────
    if (data.attack2) {
        const ATK2_Y = ATK1_Y + 38
        drawCostDots(ctx, 16, ATK2_Y - 8, data.attack2.cost, tc.circle, tc.letter)

        ctx.save()
        ctx.font = `20px 'FredokaOne', fantasy`
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(data.attack2.name, 16 + data.attack2.cost * 22 + 8, ATK2_Y - 6)

        ctx.font = `bold 22px 'FredokaOne', fantasy`
        ctx.fillStyle = '#FFD700'
        ctx.textAlign = 'right'
        ctx.fillText(String(data.attack2.damage), W - 14, ATK2_Y - 6)
        ctx.restore()
    }

    // ── Divider ───────────────────────────────────────────────────────────────
    const DIV_Y = BOT_Y + (data.attack2 ? 78 : 54)
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(14, DIV_Y); ctx.lineTo(W - 14, DIV_Y); ctx.stroke()
    ctx.restore()

    // ── Weakness / Resistance / Retreat ───────────────────────────────────────
    const STAT_Y = DIV_Y + 28
    const COL1 = 14, COL2 = W / 3, COL3 = (W * 2) / 3

    // Weakness
    ctx.save()
    ctx.font = "10px 'ComicNeue', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('weakness', COL1, STAT_Y - 10)
    drawTypeCircle(ctx, COL1 + 9, STAT_Y + 6, 9, TYPE_MAP[getTypeFromLetter(data.weakness)]?.circle ?? '#999', data.weakness)
    ctx.font = "bold 13px 'ComicNeue', sans-serif"
    ctx.fillStyle = '#FF7755'
    ctx.textAlign = 'left'
    ctx.fillText('×2', COL1 + 22, STAT_Y + 11)
    ctx.restore()

    // Resistance
    ctx.save()
    ctx.font = "10px 'ComicNeue', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.textAlign = 'center'
    ctx.fillText('resistance', COL2 + 30, STAT_Y - 10)
    ctx.font = "bold 16px 'ComicNeue', sans-serif"
    ctx.fillStyle = '#AAAAAA'
    ctx.fillText('—', COL2 + 30, STAT_Y + 12)
    ctx.restore()

    // Retreat
    ctx.save()
    ctx.font = "10px 'ComicNeue', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.textAlign = 'left'
    ctx.fillText('retreat', COL3, STAT_Y - 10)
    for (let i = 0; i < Math.min(data.retreat, 4); i++) {
        ctx.beginPath()
        ctx.arc(COL3 + 10 + i * 22, STAT_Y + 6, 9, 0, Math.PI * 2)
        ctx.fillStyle = '#DDDDDD'
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.font = "bold 10px 'ComicNeue', sans-serif"
        ctx.fillStyle = '#555'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('C', COL3 + 10 + i * 22, STAT_Y + 7)
    }
    if (data.retreat === 0) {
        ctx.font = "bold 13px 'ComicNeue', sans-serif"
        ctx.fillStyle = '#AAAAAA'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText('Free', COL3, STAT_Y + 12)
    }
    ctx.restore()

    // ── Card number ────────────────────────────────────────────────────────────
    ctx.save()
    ctx.font = "10px 'ComicNeue', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`${String(data.pokedexNum).padStart(3,'0')}/898`, W / 2, H - 10)
    if (data.isEx) {
        ctx.fillStyle = 'rgba(255,220,100,0.5)'
        ctx.fillText('Pokémon ex Rule • When knocked out, opponent takes 2 Prize Cards', W / 2, H - 22)
    }
    ctx.restore()

    // ── 6. Silver outer border ─────────────────────────────────────────────────
    ctx.save()
    const borderGrad = ctx.createLinearGradient(0, 0, W, H)
    borderGrad.addColorStop(0,    '#E0E0E0')
    borderGrad.addColorStop(0.2,  '#FFFFFF')
    borderGrad.addColorStop(0.5,  '#C8C8C8')
    borderGrad.addColorStop(0.8,  '#FFFFFF')
    borderGrad.addColorStop(1,    '#E0E0E0')
    ctx.strokeStyle = borderGrad
    ctx.lineWidth = 7
    roundRect(ctx, 3.5, 3.5, W - 7, H - 7, R - 2)
    ctx.stroke()
    ctx.restore()

    // ── 7. Inner type glow border ──────────────────────────────────────────────
    ctx.save()
    ctx.strokeStyle = tc.glow + '60'
    ctx.lineWidth = 3
    roundRect(ctx, 10, 10, W - 20, H - 20, R - 6)
    ctx.stroke()
    ctx.restore()

    // ── 8. Shiny sparkle overlay ───────────────────────────────────────────────
    if (data.isShiny) {
        ctx.save()
        for (let i = 0; i < 18; i++) {
            const sx = Math.random() * W
            const sy = Math.random() * (H * 0.65) + 40
            const sr = Math.random() * 3 + 1
            ctx.beginPath()
            ctx.arc(sx, sy, sr, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,200,${Math.random() * 0.7 + 0.3})`
            ctx.fill()
        }
        ctx.restore()
    }

    return canvas.toBuffer('image/jpeg', { quality: 0.96 })
}

// Helper: map weakness letter back to a type name for circle color
function getTypeFromLetter(letter: string): string {
    const inv: Record<string,string> = {
        'R':'fire','W':'water','L':'electric','G':'grass','P':'psychic',
        'C':'fighting','X':'poison','E':'ground','K':'rock','I':'ice',
        'B':'bug','H':'ghost','N':'dragon','D':'dark','M':'steel',
        'Y':'fairy','A':'flying'
    }
    return inv[letter] || 'normal'
}

// ─── Derive card data from PokeAPI response ────────────────────────────────────
export interface RawPokeData {
    id: number
    name: string
    types: { type: { name: string } }[]
    stats: { stat: { name: string }; base_stat: number }[]
    moves: { move: { name: string } }[]
    weight: number
    sprites: { other: { 'official-artwork': { front_default: string | null } } }
}

const WEAKNESS_MAP: Record<string, string> = {
    fire:'W', water:'L', electric:'F', grass:'R', psychic:'D',
    fighting:'P', dark:'C', steel:'R', dragon:'N', fairy:'M',
    poison:'G', ground:'W', rock:'G', ice:'M', bug:'R',
    ghost:'H', flying:'L', normal:'C'
}

const ATTACK_POOL: Record<string, string[]> = {
    fire:     ['Flamethrower','Ember','Fire Blast','Heat Wave','Overheat'],
    water:    ['Surf','Hydro Pump','Water Gun','Aqua Jet','Scald'],
    electric: ['Thunderbolt','Thunder','Spark','Volt Tackle','Discharge'],
    grass:    ['Leaf Blade','Solar Beam','Vine Whip','Petal Dance','Energy Ball'],
    psychic:  ['Psychic','Future Sight','Psybeam','Confusion','Stored Power'],
    fighting: ['Close Combat','Dynamic Punch','Mach Punch','Low Kick','Superpower'],
    poison:   ['Sludge Bomb','Toxic','Venoshock','Acid','Poison Jab'],
    ground:   ['Earthquake','Dig','Mud Bomb','Bulldoze','Sand Tomb'],
    rock:     ['Rock Blast','Stone Edge','Rock Slide','Ancient Power','Power Gem'],
    ice:      ['Blizzard','Ice Beam','Freeze-Dry','Icicle Crash','Ice Shard'],
    bug:      ['Bug Buzz','X-Scissor','Signal Beam','Pin Missile','Leech Life'],
    ghost:    ['Shadow Ball','Shadow Claw','Hex','Night Shade','Phantom Force'],
    dragon:   ['Draco Meteor','Dragon Pulse','Outrage','Dragon Claw','Twister'],
    dark:     ['Dark Pulse','Crunch','Night Slash','Sucker Punch','Bite'],
    steel:    ['Iron Tail','Flash Cannon','Metal Claw','Bullet Punch','Gyro Ball'],
    fairy:    ['Moonblast','Dazzling Gleam','Play Rough','Disarming Voice','Draining Kiss'],
    flying:   ['Air Slash','Aerial Ace','Hurricane','Sky Attack','Brave Bird'],
    normal:   ['Hyper Beam','Body Slam','Swift','Tackle','Quick Attack'],
}

function pickAttackName(type: string, movesFromApi: { move: { name: string } }[]): string {
    const pool = ATTACK_POOL[type] ?? ATTACK_POOL.normal
    // Try to use API moves first — clean up hyphenated names
    const apiNames = movesFromApi
        .slice(0, 20)
        .map(m => m.move.name.split('-').map((w: string) => w[0].toUpperCase() + w.slice(1)).join(' '))
        .filter(n => n.length >= 4 && n.length <= 22)
    // Pick randomly from API names, fallback to pool
    const candidates = apiNames.length > 3 ? apiNames : pool
    return candidates[Math.floor(Math.random() * Math.min(candidates.length, 5))]
}

export function derivePokemonCardData(raw: RawPokeData, isEx = false): PokemonCardData {
    const type = raw.types[0].type.name

    const basHp  = raw.stats.find(s => s.stat.name === 'hp')?.base_stat  ?? 45
    const basAtk = raw.stats.find(s => s.stat.name === 'attack')?.base_stat ?? 50
    const basSpA = raw.stats.find(s => s.stat.name === 'special-attack')?.base_stat ?? 50

    // TCG-style HP: roughly 2× base stat, rounded to nearest 10
    const rawHp  = isEx
        ? Math.round((basHp * 2.8) / 10) * 10
        : Math.round((basHp * 2.0) / 10) * 10
    const hp = Math.max(30, Math.min(340, rawHp))

    // Attack damage from offensive stats
    const atkStat = Math.max(basAtk, basSpA)
    const dmg1 = Math.round((atkStat * 0.9 + Math.random() * 20) / 10) * 10
    const dmg2 = Math.round((atkStat * 0.5 + Math.random() * 15) / 10) * 10

    const atk1Name = pickAttackName(type, raw.moves)
    const atk2Name = pickAttackName(type, raw.moves.slice(5))

    // Retreat cost from weight (hectograms → 0-4)
    const retreat = Math.min(4, Math.max(0, Math.floor(raw.weight / 150)))

    const weakness = WEAKNESS_MAP[type] ?? 'C'

    const artUrl = raw.sprites.other['official-artwork'].front_default ?? ''

    const displayName = raw.name.split('-')
        .map((w: string) => w[0].toUpperCase() + w.slice(1))
        .join(' ')

    return {
        displayName,
        type,
        hp,
        artUrl,
        attack1: { name: atk1Name, cost: Math.min(4, Math.ceil(atkStat / 50)), damage: dmg1 },
        attack2: dmg2 > 0 ? { name: atk2Name, cost: Math.max(1, Math.floor(atkStat / 80)), damage: dmg2 } : undefined,
        weakness,
        retreat,
        pokedexNum: raw.id,
        isEx,
    }
}
