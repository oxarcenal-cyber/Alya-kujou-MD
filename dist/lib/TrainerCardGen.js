"use strict";
/**
 * TrainerCardGen — Pixel-accurate Pokémon DS Trainer's Card
 * Recreates the classic Diamond/Pearl/Platinum Trainer's Card style
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTrainerCard = buildTrainerCard;
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
// ─── Exact DS-style color palette ─────────────────────────────────────────────
const C = {
    // Warm sandy-orange main background (signature Pokémon DS trainer card color)
    bgTop: '#C89A72',
    bgBot: '#A87848',
    // Blue-gray header bar
    hdrTop: '#7090BC',
    hdrBot: '#4A6898',
    // "Trainer's Card" label box (slightly lighter blue)
    labelBg: '#8AAAD0',
    labelBorder: '#C8DFF0',
    labelText: '#FFFFFF',
    // Trainer name box (cream white)
    nameBg: '#EEE8D8',
    nameBorder: '#CCBBAA',
    nameText: '#2A2010',
    // Pokémon slot grid
    slotBorder: '#E8E0D0', // cream-white border lines
    slotBg: 'rgba(255,255,255,0.12)',
    slotDivider: '#D0C8B8',
    // Dark footer
    footerBg: '#1A1820',
    footerTop: '#28243A',
    // "LEAGUE BADGE" label
    badgeLabel: '#F0C840',
    // Website credit
    credit: '#4A5068',
};
// ─── Badge gem color map ───────────────────────────────────────────────────────
const BADGE_GEM = {
    fire: ['#FF6622', '#FF9944'],
    water: ['#2288FF', '#66AAFF'],
    electric: ['#FFDD00', '#FFEE66'],
    grass: ['#22BB44', '#66DD88'],
    psychic: ['#FF44AA', '#FF88CC'],
    dragon: ['#6633CC', '#9966FF'],
    ice: ['#66DDFF', '#AAEEFF'],
    rock: ['#AA8844', '#CCAA66'],
    dark: ['#446688', '#7799AA'],
    ghost: ['#8844AA', '#BB88CC'],
    steel: ['#8899BB', '#BBCCDD'],
    poison: ['#8844BB', '#BB77DD'],
    fighting: ['#CC6622', '#EE9944'],
    ground: ['#BBAA44', '#DDCC77'],
    normal: ['#888888', '#AAAAAA'],
    flying: ['#88AAFF', '#AACCFF'],
    bug: ['#88BB22', '#AADD55'],
    fairy: ['#FF88CC', '#FFBBEE'],
};
function gemColor(badge) {
    const k = badge.toLowerCase();
    for (const [type, colors] of Object.entries(BADGE_GEM)) {
        if (k.includes(type))
            return colors;
    }
    // cycle through colors for unknown badges
    const cycle = [
        ['#FF6622', '#FF9944'], ['#22BB44', '#66DD88'], ['#FF44AA', '#FF88CC'],
        ['#2288FF', '#66AAFF'], ['#FFDD00', '#FFEE66'], ['#8844BB', '#BB77DD'],
        ['#66DDFF', '#AAEEFF'], ['#AA8844', '#CCAA66'],
    ];
    let h = 0;
    for (const c of k)
        h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return cycle[Math.abs(h) % cycle.length];
}
// ─── Draw a gem badge circle ───────────────────────────────────────────────────
function drawGem(ctx, cx, cy, r, colors) {
    const [center, ring] = colors;
    // Outer ring glow
    ctx.save();
    const outerGrad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r + 2);
    outerGrad.addColorStop(0, ring + 'AA');
    outerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Chrome ring border
    ctx.save();
    const borderGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    borderGrad.addColorStop(0, '#EEEEEE');
    borderGrad.addColorStop(0.4, '#AAAAAA');
    borderGrad.addColorStop(0.6, '#888888');
    borderGrad.addColorStop(1, '#CCCCCC');
    ctx.fillStyle = borderGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Main gem body
    ctx.save();
    const gemGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r * 0.88);
    gemGrad.addColorStop(0, lighten(center, 70));
    gemGrad.addColorStop(0.4, center);
    gemGrad.addColorStop(0.75, darken(center, 30));
    gemGrad.addColorStop(1, darken(center, 55));
    ctx.fillStyle = gemGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Star/facet lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.8;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7);
        ctx.stroke();
    }
    ctx.restore();
    // Shine highlight
    ctx.save();
    const shineGrad = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.32, 0, cx - r * 0.2, cy - r * 0.2, r * 0.55);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.75)');
    shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shineGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
// ─── Draw empty badge slot ─────────────────────────────────────────────────────
function drawEmptyBadge(ctx, cx, cy, r) {
    ctx.save();
    ctx.fillStyle = '#2A2838';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3A3848';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Subtle grey gem outline inside
    ctx.strokeStyle = '#444455';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}
// ─── Color helpers ─────────────────────────────────────────────────────────────
function lighten(hex, amt) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgb(${Math.min(255, (n >> 16) + amt)},${Math.min(255, ((n >> 8) & 0xff) + amt)},${Math.min(255, (n & 0xff) + amt)})`;
}
function darken(hex, amt) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgb(${Math.max(0, (n >> 16) - amt)},${Math.max(0, ((n >> 8) & 0xff) - amt)},${Math.max(0, (n & 0xff) - amt)})`;
}
// ─── Rounded rect path ────────────────────────────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}
async function buildTrainerCard(params) {
    const { trainerName, trainerSprite, party, gymBadges } = params;
    // ── Canvas + layout constants ─────────────────────────────────────────────
    const W = 520, H = 340;
    const HEADER_H = 32;
    const FOOTER_H = 58;
    const CONTENT_Y = HEADER_H;
    const CONTENT_H = H - HEADER_H - FOOTER_H; // 250
    const LEFT_W = 150; // trainer sprite panel
    const RIGHT_X = LEFT_W;
    const RIGHT_W = W - LEFT_W; // 370
    const COLS = 3, ROWS = 2;
    const SLOT_W = Math.floor(RIGHT_W / COLS); // 123
    const SLOT_H = Math.floor(CONTENT_H / ROWS); // 125
    const FOOTER_Y = CONTENT_Y + CONTENT_H;
    const canvas = (0, canvas_1.createCanvas)(W, H);
    const ctx = canvas.getContext('2d');
    // ── 1. WARM ORANGE BACKGROUND (full card) ─────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, CONTENT_Y, 0, FOOTER_Y);
    bgGrad.addColorStop(0, C.bgTop);
    bgGrad.addColorStop(1, C.bgBot);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, CONTENT_Y, W, CONTENT_H);
    // Subtle noise texture on bg
    ctx.save();
    for (let i = 0; i < 600; i++) {
        ctx.fillStyle = Math.random() > 0.5
            ? 'rgba(255,220,160,0.06)'
            : 'rgba(100,50,0,0.04)';
        ctx.fillRect(Math.random() * W, CONTENT_Y + Math.random() * CONTENT_H, 2, 2);
    }
    ctx.restore();
    // ── 2. HEADER BAR ─────────────────────────────────────────────────────────
    const hdrGrad = ctx.createLinearGradient(0, 0, 0, HEADER_H);
    hdrGrad.addColorStop(0, C.hdrTop);
    hdrGrad.addColorStop(1, C.hdrBot);
    ctx.fillStyle = hdrGrad;
    ctx.fillRect(0, 0, W, HEADER_H);
    // Header bottom edge shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, HEADER_H - 2, W, 2);
    // ── 3. "Trainer's Card" LABEL (left side of header) ──────────────────────
    const LABEL_X = 6, LABEL_Y = 5, LABEL_W = 148, LABEL_H = HEADER_H - 10;
    // Label box background
    const labelGrad = ctx.createLinearGradient(LABEL_X, LABEL_Y, LABEL_X, LABEL_Y + LABEL_H);
    labelGrad.addColorStop(0, C.labelBg);
    labelGrad.addColorStop(1, '#6A8CBE');
    ctx.save();
    rrect(ctx, LABEL_X, LABEL_Y, LABEL_W, LABEL_H, 3);
    ctx.fillStyle = labelGrad;
    ctx.fill();
    // Label highlight border (top & left)
    ctx.strokeStyle = C.labelBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
    // Inner shadow on label (bottom & right)
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    rrect(ctx, LABEL_X + 1, LABEL_Y + 1, LABEL_W - 2, LABEL_H - 2, 2);
    ctx.stroke();
    ctx.restore();
    // "Trainer's Card" text
    ctx.save();
    ctx.font = 'bold 13px "FredokaOne", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,60,0.6)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Trainer's Card", LABEL_X + LABEL_W / 2, LABEL_Y + LABEL_H / 2 + 0.5);
    ctx.restore();
    // ── 4. TRAINER NAME BOX (right side of header) ────────────────────────────
    const NAME_W = 130, NAME_H = LABEL_H;
    const NAME_X = W - NAME_W - 6, NAME_Y = LABEL_Y;
    // Name box background (cream)
    ctx.save();
    rrect(ctx, NAME_X, NAME_Y, NAME_W, NAME_H, 3);
    ctx.fillStyle = C.nameBg;
    ctx.fill();
    ctx.strokeStyle = C.nameBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
    // Subtle inner bevel on name box
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 0.8;
    rrect(ctx, NAME_X + 1, NAME_Y + 1, NAME_W - 2, NAME_H - 2, 2);
    ctx.stroke();
    ctx.restore();
    // Name text
    ctx.save();
    ctx.font = 'bold 14px "FredokaOne", sans-serif';
    ctx.fillStyle = C.nameText;
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const nameDisplay = trainerName.length > 12 ? trainerName.slice(0, 12) : trainerName;
    ctx.fillText(nameDisplay, NAME_X + NAME_W / 2, NAME_Y + NAME_H / 2 + 0.5);
    ctx.restore();
    // ── 5. TRAINER SPRITE (left panel) ────────────────────────────────────────
    // No background difference — same orange as main card
    try {
        const sprite = await (0, canvas_1.loadImage)(trainerSprite);
        // Scale to fit in panel (keep pixel art sharpness)
        const maxH = CONTENT_H - 10;
        const scale = maxH / sprite.height;
        const sw = Math.round(sprite.width * scale);
        const sh = Math.round(sprite.height * scale);
        const sx = Math.round((LEFT_W - sw) / 2);
        const sy = CONTENT_Y + Math.round((CONTENT_H - sh) / 2);
        ctx.save();
        ctx.imageSmoothingEnabled = false; // pixel-perfect upscale
        // Subtle drop shadow under sprite
        ctx.shadowColor = 'rgba(0,0,0,0.30)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(sprite, sx, sy, sw, sh);
        ctx.restore();
    }
    catch {
        // Fallback — draw a trainer silhouette placeholder
        ctx.save();
        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧍', LEFT_W / 2, CONTENT_Y + CONTENT_H / 2);
        ctx.restore();
    }
    // ── 6. POKÉMON SLOTS (2×3 grid on the right) ─────────────────────────────
    // Outer frame around the entire grid
    ctx.save();
    ctx.strokeStyle = C.slotBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(RIGHT_X, CONTENT_Y, RIGHT_W, CONTENT_H);
    ctx.restore();
    // Inner slot backgrounds and Pokémon artwork
    for (let i = 0; i < 6; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const sx = RIGHT_X + col * SLOT_W;
        const sy = CONTENT_Y + row * SLOT_H;
        // Clip each slot for artwork
        ctx.save();
        ctx.rect(sx + 1, sy + 1, SLOT_W - 2, SLOT_H - 2);
        ctx.clip();
        // Slot background — very slight lighter overlay
        ctx.fillStyle = 'rgba(255,240,210,0.08)';
        ctx.fillRect(sx + 1, sy + 1, SLOT_W - 2, SLOT_H - 2);
        const poke = party[i];
        if (poke) {
            // Load official artwork (larger, higher quality than sprites)
            const artUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;
            try {
                const art = await (0, canvas_1.loadImage)(artUrl);
                // Scale artwork to fill slot, leaving a small padding
                const pad = 6;
                const maxS = Math.min(SLOT_W - pad * 2, SLOT_H - pad * 2);
                const scale = maxS / Math.max(art.width, art.height);
                const aw = Math.round(art.width * scale);
                const ah = Math.round(art.height * scale);
                const ax = sx + Math.round((SLOT_W - aw) / 2);
                const ay = sy + Math.round((SLOT_H - ah) / 2);
                ctx.save();
                ctx.imageSmoothingEnabled = true;
                // Subtle shadow under Pokémon art
                ctx.shadowColor = 'rgba(0,0,0,0.25)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetY = 2;
                ctx.drawImage(art, ax, ay, aw, ah);
                ctx.restore();
            }
            catch {
                // Fallback: name text
                ctx.save();
                ctx.font = 'bold 10px "FredokaOne", sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(poke.name.charAt(0).toUpperCase() + poke.name.slice(1), sx + SLOT_W / 2, sy + SLOT_H / 2);
                ctx.restore();
            }
        }
        else {
            // Empty slot — dark transparent overlay
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(sx + 1, sy + 1, SLOT_W - 2, SLOT_H - 2);
        }
        ctx.restore(); // end clip
        // Slot border lines (draws on top of artwork)
        ctx.save();
        ctx.strokeStyle = C.slotBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, SLOT_W, SLOT_H);
        ctx.restore();
    }
    // ── 7. DARK FOOTER BAR ────────────────────────────────────────────────────
    const footerGrad = ctx.createLinearGradient(0, FOOTER_Y, 0, H);
    footerGrad.addColorStop(0, C.footerTop);
    footerGrad.addColorStop(0.3, C.footerBg);
    footerGrad.addColorStop(1, '#0E0C16');
    ctx.fillStyle = footerGrad;
    ctx.fillRect(0, FOOTER_Y, W, FOOTER_H);
    // Footer top highlight line
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, FOOTER_Y, W, 1);
    // ── 8. "LEAGUE BADGE" LABEL ───────────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 9px "FredokaOne", sans-serif';
    ctx.fillStyle = C.badgeLabel;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    ctx.fillText('LEAGUE BADGE', 10, FOOTER_Y + 6);
    ctx.restore();
    // ── 9. BADGE ICONS ────────────────────────────────────────────────────────
    const MAX_BADGES = 8;
    const GEM_R = 16;
    const GEM_GAP = 6;
    const totalBadgeW = MAX_BADGES * (GEM_R * 2 + GEM_GAP) - GEM_GAP;
    const badgeStartX = (W - totalBadgeW) / 2 + GEM_R;
    const badgeCY = FOOTER_Y + FOOTER_H - GEM_R - 8;
    for (let i = 0; i < MAX_BADGES; i++) {
        const cx = badgeStartX + i * (GEM_R * 2 + GEM_GAP);
        if (i < gymBadges.length) {
            drawGem(ctx, cx, badgeCY, GEM_R, gemColor(gymBadges[i]));
        }
        else {
            drawEmptyBadge(ctx, cx, badgeCY, GEM_R);
        }
    }
    // ── 10. CREDIT TEXT ───────────────────────────────────────────────────────
    ctx.save();
    ctx.font = '7px "ComicNeue", sans-serif';
    ctx.fillStyle = C.credit;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('MAKE YOUR OWN: POKÉMON ADVENTURE BOT', W / 2, FOOTER_Y + 6);
    ctx.restore();
    // ── 11. OUTER CARD BORDER ─────────────────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = '#8A6840';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    // Inner light edge
    ctx.strokeStyle = 'rgba(255,220,150,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, W - 6, H - 6);
    ctx.restore();
    return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}
