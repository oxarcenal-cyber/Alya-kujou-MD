"use strict";
/**
 * ꜰᴏɴᴛ ᴄᴏɴᴠᴇʀᴛᴇʀ — Unicode Stylized Text
 * WhatsApp mein different font styles ke liye Unicode characters use hote hain.
 * Ye utility normal text ko 12 alag styles mein convert karti hai.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewAllFonts = exports.convertFont = exports.FONT_LIST = void 0;
// ─── Character Maps ─────────────────────────────────────────────────────────
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const MAPS = {
    bold: {
        upper: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
        lower: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
        digit: '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
    },
    italic: {
        upper: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
        lower: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
        digit: '0123456789'
    },
    bold_italic: {
        upper: '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
        lower: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛',
        digit: '0123456789'
    },
    cursive: {
        upper: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
        lower: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',
        digit: '0123456789'
    },
    fraktur: {
        upper: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
        lower: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷',
        digit: '0123456789'
    },
    double: {
        upper: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
        lower: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',
        digit: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
    },
    mono: {
        upper: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
        lower: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
        digit: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
    },
    sans: {
        upper: '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹',
        lower: '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓',
        digit: '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫'
    },
    sans_bold: {
        upper: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
        lower: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
        digit: '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
    },
    bubble: {
        upper: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
        lower: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
        digit: '⓪①②③④⑤⑥⑦⑧⑨'
    },
    fullwidth: {
        upper: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
        lower: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
        digit: '０１２３４５６７８９'
    },
    small_caps: {
        upper: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ',
        lower: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ',
        digit: '0123456789'
    }
};
exports.FONT_LIST = [
    { key: 'bold', label: 'Bold', emoji: '𝐁', preview: '𝐇𝐞𝐥𝐥𝐨 𝐖𝐨𝐫𝐥𝐝' },
    { key: 'italic', label: 'Italic', emoji: '𝘐', preview: '𝘏𝘦𝘭𝘭𝘰 𝘞𝘰𝘳𝘭𝘥' },
    { key: 'bold_italic', label: 'Bold Italic', emoji: '𝑩', preview: '𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅' },
    { key: 'cursive', label: 'Cursive', emoji: '𝓒', preview: '𝓗𝓮𝓵𝓵𝓸 𝓦𝓸𝓻𝓵𝓭' },
    { key: 'fraktur', label: 'Fraktur', emoji: '𝔉', preview: '𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡' },
    { key: 'double', label: 'Double', emoji: '𝔻', preview: '𝕳𝖊𝖑𝖑𝖔 𝖂𝖔𝖗𝖑𝖉' },
    { key: 'mono', label: 'Monospace', emoji: '𝙼', preview: '𝙷𝚎𝚕𝚕𝚘 𝚆𝚘𝚛𝚕𝚍' },
    { key: 'sans', label: 'Sans Serif', emoji: '𝖲', preview: '𝖧𝖾𝗅𝗅𝗈 𝖶𝗈𝗋𝗅𝖽' },
    { key: 'sans_bold', label: 'Sans Bold', emoji: '𝗦', preview: '𝗛𝗲𝗹𝗹𝗼 𝗪𝗼𝗿𝗹𝗱' },
    { key: 'bubble', label: 'Bubble', emoji: 'Ⓑ', preview: 'Ⓗⓔⓛⓛⓞ Ⓦⓞⓡⓛⓓ' },
    { key: 'fullwidth', label: 'Full Width', emoji: 'Ｆ', preview: 'Ｈｅｌｌｏ Ｗｏｒｌｄ' },
    { key: 'small_caps', label: 'Small Caps', emoji: 'ꜱ', preview: 'ʜᴇʟʟᴏ ᴡᴏʀʟᴅ' }
];
// ─── Converter ───────────────────────────────────────────────────────────────
/**
 * Normal text ko kisi bhi font style mein convert karo.
 * @param text   - Original text
 * @param style  - Font key (e.g. 'bold', 'cursive')
 * @returns      - Converted Unicode text
 */
const convertFont = (text, style) => {
    const map = MAPS[style];
    if (!map)
        return text;
    const uArr = [...map.upper];
    const lArr = [...map.lower];
    const dArr = [...map.digit];
    return [...text].map((ch) => {
        const ui = UPPER.indexOf(ch);
        if (ui !== -1)
            return uArr[ui] ?? ch;
        const li = LOWER.indexOf(ch);
        if (li !== -1)
            return lArr[li] ?? ch;
        const di = DIGIT.indexOf(ch);
        if (di !== -1)
            return dArr[di] ?? ch;
        return ch;
    }).join('');
};
exports.convertFont = convertFont;
/**
 * Sabhi fonts mein text ka preview banao
 */
const previewAllFonts = (text) => exports.FONT_LIST.map((f, i) => `${String(i + 1).padStart(2, ' ')}. ${f.emoji} *${f.label}*\n    ${(0, exports.convertFont)(text, f.key)}`).join('\n\n');
exports.previewAllFonts = previewAllFonts;
