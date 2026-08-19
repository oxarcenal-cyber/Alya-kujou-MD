"use strict";
/**
 * PixelDexGen — Retro pixel art style Pokédex card generator
 * Produces Game Boy Color / GBA aesthetic Pokédex cards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixelSpriteUrl = pixelSpriteUrl;
exports.buildDexOverviewCard = buildDexOverviewCard;
exports.buildDexDetailCard = buildDexDetailCard;
const canvas_1 = require("canvas");
const path_1 = require("path");
const ROOT = (0, path_1.join)(__dirname, '..', '..');
try {
    (0, canvas_1.registerFont)((0, path_1.join)(ROOT, 'assets', 'fonts', 'FredokaOne-Regular.ttf'), { family: 'FredokaOne' });
}
catch { }
try {
    (0, canvas_1.registerFont)((0, path_1.join)(ROOT, 'assets', 'fonts', 'ComicNeue-Bold.ttf'), { family: 'ComicNeue', weight: 'bold' });
}
catch { }
try {
    (0, canvas_1.registerFont)((0, path_1.join)(ROOT, 'assets', 'fonts', 'ComicNeue-Regular.ttf'), { family: 'ComicNeue' });
}
catch { }
// ─── Pixel Art Color Palette (GBC style) ──────────────────────────────────────
const COLORS = {
    bg: '#0a0e1a',
    bgMid: '#0d1526',
    border: '#00ff41',
    borderDim: '#00aa2a',
    header: '#001a0a',
    headerText: '#00ff41',
    dimText: '#00aa2a',
    slotBg: '#0d1f0d',
    slotBorder: '#1a4d1a',
    slotHover: '#0f2a0f',
    white: '#e8ffe8',
    gold: '#ffd700',
    scanline: 'rgba(0,0,0,0.18)',
    glow: 'rgba(0,255,65,0.15)',
    // Type colours for type badges
    type: {
        fire: '#FF4400', water: '#1188FF', electric: '#FFCC00',
        grass: '#22BB22', psychic: '#FF1493', fighting: '#CC6600',
        poison: '#AA22CC', ground: '#CC9900', rock: '#AA9966',
        ice: '#66CCFF', bug: '#88AA00', ghost: '#6644AA',
        dragon: '#5511AA', dark: '#445566', steel: '#8899AA',
        fairy: '#EE66AA', flying: '#6699FF', normal: '#888888',
    },
    // Rarity colours
    rarity: {
        common: '#aaaaaa',
        uncommon: '#44bb44',
        rare: '#4488ff',
        epic: '#aa44ff',
        legendary: '#ffaa00',
    },
};
// ─── Helpers ──────────────────────────────────────────────────────────────────
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
/** Draw pixel-style rounded rect (sharp corners for retro feel) */
function pixelRect(ctx, x, y, w, h, color, radius = 3) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
/** Draw glowing border rect */
function glowRect(ctx, x, y, w, h, color, lineW = 2, glowSize = 8) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}
/** Draw CRT scanlines over entire canvas */
function drawScanlines(ctx, W, H) {
    ctx.save();
    for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = COLORS.scanline;
        ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();
}
/** Pixel-style stat bar (retro segmented) */
function drawStatBar(ctx, x, y, w, h, value, max, color) {
    const segments = 12;
    const segW = Math.floor((w - segments) / segments);
    const filled = Math.round((value / max) * segments);
    for (let i = 0; i < segments; i++) {
        const sx = x + i * (segW + 1);
        ctx.fillStyle = i < filled ? color : '#1a2a1a';
        ctx.fillRect(sx, y, segW, h);
        // pixel shine on filled
        if (i < filled) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(sx, y, segW, Math.ceil(h / 3));
        }
    }
}
/** Type color badge pill */
function drawTypeBadge(ctx, x, y, typeName) {
    const color = COLORS.type[typeName.toLowerCase()] ?? '#888888';
    const label = typeName.toUpperCase().slice(0, 6);
    ctx.save();
    ctx.font = 'bold 9px "FredokaOne", monospace';
    const tw = ctx.measureText(label).width;
    const bw = tw + 10, bh = 14;
    pixelRect(ctx, x, y - bh + 2, bw, bh, color, 2);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 5, y - bh / 2 + 2);
    ctx.restore();
    return bw + 4;
}
/** Rarity dot + label */
function rarityColor(rarity) {
    return COLORS.rarity[rarity?.toLowerCase()] ?? COLORS.rarity.common;
}
// ─── Pixel sprite URL ──────────────────────────────────────────────────────────
function pixelSpriteUrl(id, shiny = false) {
    const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    return shiny ? `${base}/shiny/${id}.png` : `${base}/${id}.png`;
}
async function buildDexOverviewCard(params) {
    const { username, tag, party, pc } = params;
    const allPokes = [...party, ...pc];
    const showCount = Math.min(allPokes.length, 18); // max 18 in grid
    const COLS = 3;
    const ROWS = Math.max(2, Math.ceil(showCount / COLS));
    const SLOT_W = 154, SLOT_H = 100;
    const PAD = 10;
    const HEADER_H = 62;
    const FOOTER_H = 38;
    const W = COLS * SLOT_W + (COLS + 1) * PAD;
    const H = HEADER_H + ROWS * SLOT_H + (ROWS + 1) * PAD + FOOTER_H;
    const canvas = (0, canvas_1.createCanvas)(W, H);
    const ctx = canvas.getContext('2d');
    // ── Background ──────────────────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0a1a0a');
    bgGrad.addColorStop(0.5, '#0a0e1a');
    bgGrad.addColorStop(1, '#050a05');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    // Subtle green glow center
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    glow.addColorStop(0, 'rgba(0,255,65,0.06)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    // ── Outer glow border ───────────────────────────────────────────────────
    ctx.save();
    ctx.shadowColor = COLORS.border;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, W - 8, H - 8);
    ctx.restore();
    // Inner dim border
    ctx.save();
    ctx.strokeStyle = COLORS.borderDim;
    ctx.lineWidth = 1;
    ctx.strokeRect(7, 7, W - 14, H - 14);
    ctx.restore();
    // ── Header ──────────────────────────────────────────────────────────────
    pixelRect(ctx, 9, 9, W - 18, HEADER_H - 4, '#001a0a', 3);
    glowRect(ctx, 9, 9, W - 18, HEADER_H - 4, COLORS.borderDim, 1, 4);
    // Pokedex logo (red circle like a pokeball top)
    ctx.save();
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(30, 9 + (HEADER_H - 4) / 2, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#cc0000';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    // Pokeball line
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(14, 9 + (HEADER_H - 4) / 2);
    ctx.lineTo(46, 9 + (HEADER_H - 4) / 2);
    ctx.stroke();
    // Center button
    ctx.beginPath();
    ctx.arc(30, 9 + (HEADER_H - 4) / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
    // Header text
    ctx.save();
    ctx.font = 'bold 18px "FredokaOne", monospace';
    ctx.fillStyle = COLORS.headerText;
    ctx.shadowColor = COLORS.border;
    ctx.shadowBlur = 6;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('POKÉDEX', 54, 9 + (HEADER_H - 4) / 2 - 8);
    ctx.restore();
    ctx.save();
    ctx.font = '11px "ComicNeue", monospace';
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${username}  #${tag}`, 54, 9 + (HEADER_H - 4) / 2 + 10);
    ctx.restore();
    // Party label top right
    ctx.save();
    ctx.font = 'bold 10px "FredokaOne", monospace';
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`PARTY: ${party.length}/6  PC: ${pc.length}`, W - 14, 9 + (HEADER_H - 4) / 2 - 8);
    ctx.fillText(`TOTAL: ${allPokes.length} POKÉMON`, W - 14, 9 + (HEADER_H - 4) / 2 + 10);
    ctx.restore();
    // ── Pokemon Grid ─────────────────────────────────────────────────────────
    for (let i = 0; i < showCount; i++) {
        const poke = allPokes[i];
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const sx = PAD + col * (SLOT_W + PAD);
        const sy = HEADER_H + PAD + row * (SLOT_H + PAD);
        const inParty = i < party.length;
        // Slot background
        const slotBg = inParty ? '#0d200d' : '#0a0f18';
        pixelRect(ctx, sx, sy, SLOT_W, SLOT_H, slotBg, 4);
        // Slot border — green for party, blue for PC
        ctx.save();
        ctx.strokeStyle = inParty ? COLORS.slotBorder : '#1a1a4d';
        ctx.shadowColor = inParty ? COLORS.borderDim : '#2222aa';
        ctx.shadowBlur = 5;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx + 0.5, sy + 0.5, SLOT_W - 1, SLOT_H - 1);
        ctx.restore();
        // Party / PC badge top-left corner
        ctx.save();
        ctx.font = 'bold 7px "FredokaOne", monospace';
        ctx.fillStyle = inParty ? '#00ff41' : '#4488ff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(inParty ? '● PARTY' : '● PC', sx + 5, sy + 4);
        ctx.restore();
        // Pokemon sprite (pixel art from PokeAPI)
        const spriteUrl = pixelSpriteUrl(poke.id);
        try {
            const sprite = await (0, canvas_1.loadImage)(spriteUrl);
            // Draw sprite with pixelated scaling (no smoothing = true retro look)
            const SPRITE_SIZE = 72;
            ctx.save();
            ctx.imageSmoothingEnabled = false; // KEY: keeps pixels sharp!
            ctx.drawImage(sprite, sx + 5, sy + 16, SPRITE_SIZE, SPRITE_SIZE);
            ctx.restore();
        }
        catch {
            // Fallback: draw a pixel "?" box
            ctx.save();
            ctx.strokeStyle = COLORS.dimText;
            ctx.lineWidth = 1;
            ctx.strokeRect(sx + 5, sy + 16, 72, 72);
            ctx.font = 'bold 24px "FredokaOne", monospace';
            ctx.fillStyle = COLORS.dimText;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', sx + 5 + 36, sy + 16 + 36);
            ctx.restore();
        }
        // Name + number
        ctx.save();
        ctx.font = 'bold 11px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.white;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const dispName = cap(poke.name).length > 10 ? cap(poke.name).slice(0, 9) + '.' : cap(poke.name);
        ctx.fillText(dispName, sx + 82, sy + 18);
        ctx.restore();
        ctx.save();
        ctx.font = '9px "ComicNeue", monospace';
        ctx.fillStyle = COLORS.dimText;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`#${String(poke.id).padStart(3, '0')}`, sx + 82, sy + 32);
        ctx.restore();
        // Level
        ctx.save();
        ctx.font = 'bold 12px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.gold;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Lv.${poke.level}`, sx + 82, sy + 46);
        ctx.restore();
        // Rarity dot
        const rc = rarityColor(poke.rarity);
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx + 82 + 3, sy + 67, 4, 0, Math.PI * 2);
        ctx.fillStyle = rc;
        ctx.shadowColor = rc;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.font = '8px "ComicNeue", monospace';
        ctx.fillStyle = rc;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(cap(poke.rarity ?? 'common'), sx + 92, sy + 67);
        ctx.restore();
        // Types (if available)
        if (poke.types && poke.types.length > 0) {
            let tx = sx + 82;
            for (const t of poke.types.slice(0, 2)) {
                const color = COLORS.type[t.toLowerCase()] ?? '#888888';
                const label = t.toUpperCase().slice(0, 4);
                ctx.save();
                ctx.font = 'bold 7px "FredokaOne", monospace';
                const tw = ctx.measureText(label).width;
                const bw = tw + 6, bh = 11;
                pixelRect(ctx, tx, sy + SLOT_H - 14, bw, bh, color, 2);
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, tx + 3, sy + SLOT_H - 8);
                ctx.restore();
                tx += bw + 3;
            }
        }
    }
    // ── Footer ───────────────────────────────────────────────────────────────
    const fy = H - FOOTER_H;
    pixelRect(ctx, 9, fy, W - 18, FOOTER_H - 9, '#001a0a', 3);
    ctx.save();
    ctx.font = '10px "ComicNeue", monospace';
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shown = Math.min(showCount, allPokes.length);
    const more = allPokes.length - shown;
    const footerText = more > 0
        ? `Showing ${shown} of ${allPokes.length} Pokémon  ·  +${more} more`
        : `Registered: ${allPokes.length} Pokémon  ·  CELESTIC POKÉDEX`;
    ctx.fillText(footerText, W / 2, fy + (FOOTER_H - 9) / 2);
    ctx.restore();
    // Scanlines on top of everything for CRT effect
    drawScanlines(ctx, W, H);
    // Final outer glow again on top
    ctx.save();
    ctx.shadowColor = COLORS.border;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = COLORS.border + '55';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, W - 4, H - 4);
    ctx.restore();
    return canvas.toBuffer('image/jpeg', { quality: 0.93 });
}
async function buildDexDetailCard(data) {
    const W = 540, H = 320;
    const canvas = (0, canvas_1.createCanvas)(W, H);
    const ctx = canvas.getContext('2d');
    const primaryType = data.types[0] ?? 'normal';
    const typeColor = COLORS.type[primaryType.toLowerCase()] ?? '#888888';
    // ── Background ──────────────────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#060d06');
    bgGrad.addColorStop(0.5, '#0a0e1a');
    bgGrad.addColorStop(1, '#060d06');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    // Subtle type color glow top-left
    const typeGlow = ctx.createRadialGradient(140, 160, 0, 140, 160, 220);
    typeGlow.addColorStop(0, typeColor + '18');
    typeGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = typeGlow;
    ctx.fillRect(0, 0, W, H);
    // ── Borders ─────────────────────────────────────────────────────────────
    ctx.save();
    ctx.shadowColor = COLORS.border;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, W - 8, H - 8);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = COLORS.borderDim;
    ctx.lineWidth = 1;
    ctx.strokeRect(7, 7, W - 14, H - 14);
    ctx.restore();
    // ── Left panel: sprite area ──────────────────────────────────────────────
    const leftW = 210;
    pixelRect(ctx, 10, 10, leftW - 5, H - 20, '#0d200d', 4);
    glowRect(ctx, 10, 10, leftW - 5, H - 20, typeColor + '66', 1, 6);
    // Dex # at top left
    ctx.save();
    ctx.font = 'bold 11px "FredokaOne", monospace';
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`#${String(data.id).padStart(3, '0')}`, 18, 16);
    ctx.restore();
    // "OWNED" badge if user has it
    if (data.isOwned) {
        pixelRect(ctx, leftW - 60, 12, 52, 16, COLORS.border, 3);
        ctx.save();
        ctx.font = 'bold 9px "FredokaOne", monospace';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓ OWNED', leftW - 60 + 26, 12 + 8);
        ctx.restore();
    }
    // Pixel sprite (large, centered in left panel)
    const spriteUrl = pixelSpriteUrl(data.id);
    try {
        const sprite = await (0, canvas_1.loadImage)(spriteUrl);
        ctx.save();
        ctx.imageSmoothingEnabled = false; // pixelated!
        const SPRITE_SIZE = 150;
        const sx = 10 + (leftW - 5 - SPRITE_SIZE) / 2;
        const sy = (H - SPRITE_SIZE) / 2 - 10;
        // Shadow below sprite
        ctx.shadowColor = typeColor;
        ctx.shadowBlur = 20;
        ctx.drawImage(sprite, sx, sy, SPRITE_SIZE, SPRITE_SIZE);
        ctx.restore();
    }
    catch {
        ctx.save();
        ctx.strokeStyle = COLORS.dimText;
        ctx.lineWidth = 1;
        ctx.strokeRect(35, 80, 140, 140);
        ctx.font = 'bold 36px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.dimText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 105, 150);
        ctx.restore();
    }
    // User level (if owned)
    if (data.level) {
        ctx.save();
        ctx.font = 'bold 14px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.gold;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`Lv. ${data.level}`, 10 + (leftW - 5) / 2, H - 14);
        ctx.restore();
    }
    // Type badges bottom of left panel
    let typeBadgeX = 15;
    for (const t of data.types) {
        const color = COLORS.type[t.toLowerCase()] ?? '#888888';
        const label = t.toUpperCase().slice(0, 6);
        ctx.save();
        ctx.font = 'bold 9px "FredokaOne", monospace';
        const tw = ctx.measureText(label).width;
        const bw = tw + 10, bh = 15;
        const by = H - 35;
        pixelRect(ctx, typeBadgeX, by, bw, bh, color, 2);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, typeBadgeX + 5, by + bh / 2);
        ctx.restore();
        typeBadgeX += bw + 5;
    }
    // ── Right panel: info ─────────────────────────────────────────────────────
    const rx = leftW + 8;
    const rw = W - rx - 12;
    // Name
    ctx.save();
    ctx.font = `bold 24px "FredokaOne", monospace`;
    ctx.fillStyle = COLORS.white;
    ctx.shadowColor = typeColor;
    ctx.shadowBlur = 8;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(cap(data.name).toUpperCase(), rx, 18);
    ctx.restore();
    // Height / Weight
    ctx.save();
    ctx.font = '10px "ComicNeue", monospace';
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const heightM = (data.height / 10).toFixed(1);
    const weightKg = (data.weight / 10).toFixed(1);
    ctx.fillText(`HT ${heightM}m  WT ${weightKg}kg`, rx, 48);
    ctx.restore();
    // Rarity badge
    if (data.rarity) {
        const rc = rarityColor(data.rarity);
        pixelRect(ctx, rx, 62, 60, 14, '#0a0a0a', 2);
        ctx.save();
        ctx.beginPath();
        ctx.arc(rx + 8, 62 + 7, 4, 0, Math.PI * 2);
        ctx.fillStyle = rc;
        ctx.shadowColor = rc;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.font = '8px "ComicNeue", monospace';
        ctx.fillStyle = rc;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(cap(data.rarity), rx + 16, 62 + 7);
        ctx.restore();
    }
    // Separator line
    ctx.save();
    ctx.strokeStyle = COLORS.borderDim;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(rx, 82);
    ctx.lineTo(rx + rw, 82);
    ctx.stroke();
    ctx.restore();
    // ── Stats ─────────────────────────────────────────────────────────────────
    const statEntries = [
        ['HP', data.stats.hp, 255, '#ff4444'],
        ['ATK', data.stats.attack, 190, '#ff8800'],
        ['DEF', data.stats.defense, 190, '#4488ff'],
        ['SpA', data.stats.spAtk, 190, '#aa44ff'],
        ['SpD', data.stats.spDef, 190, '#44bbbb'],
        ['SPD', data.stats.speed, 180, '#44ff88'],
    ];
    const statY0 = 90;
    const statGap = 34;
    const labelW = 32;
    const numW = 26;
    const barW = rw - labelW - numW - 8;
    for (let i = 0; i < statEntries.length; i++) {
        const [label, value, max, color] = statEntries[i];
        const sy = statY0 + i * statGap;
        // Label
        ctx.save();
        ctx.font = 'bold 10px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.dimText;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, rx, sy + 5);
        ctx.restore();
        // Value
        ctx.save();
        ctx.font = 'bold 10px "FredokaOne", monospace';
        ctx.fillStyle = COLORS.white;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(value), rx + labelW + numW - 2, sy + 5);
        ctx.restore();
        // Bar background
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(rx + labelW + numW, sy, barW, 10);
        // Bar fill (segmented pixel style)
        drawStatBar(ctx, rx + labelW + numW, sy, barW, 10, value, max, color);
    }
    // ── Description ───────────────────────────────────────────────────────────
    if (data.description) {
        const descY = statY0 + statEntries.length * statGap + 4;
        ctx.save();
        ctx.font = '9px "ComicNeue", monospace';
        ctx.fillStyle = COLORS.dimText;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // Word wrap
        const words = data.description.split(' ');
        let line = '';
        let lineY = descY;
        for (const word of words) {
            const test = line + (line ? ' ' : '') + word;
            if (ctx.measureText(test).width > rw && line) {
                ctx.fillText(line, rx, lineY);
                line = word;
                lineY += 13;
                if (lineY > H - 16)
                    break;
            }
            else {
                line = test;
            }
        }
        if (line && lineY <= H - 16)
            ctx.fillText(line, rx, lineY);
        ctx.restore();
    }
    // ── Scanlines ────────────────────────────────────────────────────────────
    drawScanlines(ctx, W, H);
    // Final glow border
    ctx.save();
    ctx.shadowColor = COLORS.border;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = COLORS.border + '44';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, W - 4, H - 4);
    ctx.restore();
    return canvas.toBuffer('image/jpeg', { quality: 0.93 });
}
