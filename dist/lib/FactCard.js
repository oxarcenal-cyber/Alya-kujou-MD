"use strict";
/**
 * 💡 FactCard — Sakura Bunny Background + Fredoka One Bubble Font
 * Matches the reference style: bubbly pink text with dark stroke on the left,
 * sakura bunny decoration on the right.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFactCard = buildFactCard;
const canvas_1 = require("canvas");
const path_1 = require("path");
const ROOT = (0, path_1.join)(__dirname, '..', '..');
const BG_PATH = (0, path_1.join)(ROOT, 'assets', 'images', 'fact-sakura-bg.jpg');
const FONT_FREDOKA = (0, path_1.join)(ROOT, 'assets', 'fonts', 'FredokaOne-Regular.ttf');
const FONT_BOLD = (0, path_1.join)(ROOT, 'assets', 'fonts', 'ComicNeue-Bold.ttf');
// Register fonts once at module load
try {
    (0, canvas_1.registerFont)(FONT_FREDOKA, { family: 'FredokaOne' });
}
catch { }
try {
    (0, canvas_1.registerFont)(FONT_BOLD, { family: 'ComicNeue', weight: 'bold' });
}
catch { }
// ── Helpers ───────────────────────────────────────────────────────────────────
function wrapText(ctx, text, maxWidth, font) {
    ctx.font = font;
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(test).width > maxWidth && cur) {
            lines.push(cur);
            cur = w;
        }
        else
            cur = test;
    }
    if (cur)
        lines.push(cur);
    return lines;
}
// ── Main builder ──────────────────────────────────────────────────────────────
async function buildFactCard(factText, _persona) {
    const bg = await (0, canvas_1.loadImage)(BG_PATH);
    // Scale background to output size (1080 wide, maintain aspect ratio)
    const W = 1080;
    const H = Math.round(bg.height / bg.width * W); // ~439 px
    const canvas = (0, canvas_1.createCanvas)(W, H);
    const ctx = canvas.getContext('2d');
    // ── Draw background ───────────────────────────────────────────────────
    ctx.drawImage(bg, 0, 0, W, H);
    // ── Typography settings ───────────────────────────────────────────────
    // Text occupies the LEFT ~62% of the image; right side has the bunny art
    const TEXT_AREA_W = Math.round(W * 0.62);
    const LEFT_PAD = Math.round(W * 0.06); // ~65 px from left edge
    const maxTextW = TEXT_AREA_W - LEFT_PAD * 2;
    // Choose font size dynamically based on text length
    const charCount = factText.length;
    let fontSize;
    if (charCount <= 60)
        fontSize = Math.round(H * 0.16); // ~70 px
    else if (charCount <= 120)
        fontSize = Math.round(H * 0.13); // ~57 px
    else if (charCount <= 200)
        fontSize = Math.round(H * 0.11); // ~48 px
    else
        fontSize = Math.round(H * 0.09); // ~39 px
    const FONT_STR = `${fontSize}px 'FredokaOne', 'ComicNeue', fantasy`;
    // Wrap text
    const lines = wrapText(ctx, factText, maxTextW, FONT_STR);
    const LINE_H = Math.round(fontSize * 1.22);
    // Vertically center the text block
    const blockH = lines.length * LINE_H;
    const startY = Math.round((H - blockH) / 2) + fontSize * 0.85;
    // ── Draw bubble text (stroke + fill like reference) ───────────────────
    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = FONT_STR;
    ctx.lineJoin = 'round';
    // Dark pink/maroon stroke for outline effect
    ctx.strokeStyle = '#9b1a4e';
    ctx.lineWidth = Math.round(fontSize * 0.12);
    ctx.fillStyle = '#e8185c'; // hot pink fill matching reference
    for (let i = 0; i < lines.length; i++) {
        const yPos = startY + i * LINE_H;
        ctx.strokeText(lines[i], LEFT_PAD, yPos);
        ctx.fillText(lines[i], LEFT_PAD, yPos);
    }
    ctx.restore();
    return canvas.toBuffer('image/png');
}
