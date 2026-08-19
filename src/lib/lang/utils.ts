/**
 * LANG — Utils category (font converter, etc.)
 */

export const utils = {
    en: {
        font_usage:      '✍️ *Font Converter*\n\nUsage:\n  `{p}font <style> <text>`\n  `{p}font list` → see all styles\n  `{p}font all <text>` → preview all',
        font_not_found:  '❌ Font style not found. Use `{p}font list` to see all.',

        // calc
        calc_usage:
            `🧮 *CALCULATOR*\n\n` +
            `Calculate any math expression!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}calc 2+2\`\n` +
            `  \`{p}calc (10*5)/2\`\n` +
            `  \`{p}calc 2**10\` → 2^10\n` +
            `  \`{p}calc 100-45+32\`\n\n` +
            `*Operators:* + − × / ** % ()`,
        calc_too_long:   '❌ Expression is too long! Keep it under 100 characters.\n📢 Example: `{p}calc 2+2`',
        calc_invalid:    '❌ Invalid expression!\n📢 Example: `{p}calc 2+2`',
        calc_bad_ops:    '❌ Invalid expression! Too many consecutive operators.\n📢 Example: `{p}calc (10*5)/2`',
        calc_bad_result: '❌ Invalid result! Division by zero or malformed expression.\n📢 Example: `{p}calc 2+2`',
        calc_error:      '❌ Invalid expression!\n📢 Example: `{p}calc 2+2`',

        // define
        define_usage:
            `📖 *DICTIONARY*\n\n` +
            `Look up the meaning and definition of any English word!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}define love\`\n` +
            `  \`{p}define ephemeral\`\n` +
            `  \`{p}define serendipity\``,
        define_not_found: '❌ *"{word}"* definition not found!\n📢 Please provide an English word',
        define_error:     '❌ *"{word}"* was not found in the dictionary!\n📢 Example: `{p}define beautiful`',

        // font (execute-level strings)
        font_all_no_text:    '❌ Provide some text!\nExample: `{p}font all Hello World`',
        font_all_footer:     '📢 Like a style? Use: `{p}font <style> {text}`',
        font_style_invalid:  '❌ *Font style not found:* `{style}`\n\n📢 Use a valid style name or number.\nFor the list: `{p}font list`',
        font_style_no_text:  '❌ Provide some text!\nExample: `{p}font {key} Hello World`',
        font_style_footer:   '📢 More styles: `{p}font list`',

        // qr
        qr_usage:
            `🔲 *QR CODE GENERATOR*\n\n` +
            `Generate a QR code for any text or link!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}qr Hello World\`\n` +
            `  \`{p}qr https://youtube.com\`\n` +
            `  \`{p}qr My number: 9876543210\``,
        qr_error: '❌ Failed to generate QR code. Try again!\n📢 Example: `{p}qr Hello World`',

        // translate
        translate_usage:
            `🌐 *TRANSLATE*\n\n` +
            `Translate to any language!\n\n` +
            `📢 *How to use:* \`{p}translate <lang> <text>\`\n\n` +
            `*Examples:*\n` +
            `  \`{p}translate hi Hello how are you\`\n` +
            `  \`{p}translate es Good morning\`\n` +
            `  \`{p}translate ja I love anime\`\n\n` +
            `*Lang codes:* hi ur es fr de ja ko zh ar pt ru it tr bn ta te mr gu pa`,
        translate_no_text:    '❌ Please provide the text as well!\n📢 Example: `{p}translate hi Hello`',
        translate_failed:     '❌ Translation failed. Is the lang code correct?\n📢 Example: `{p}translate hi Hello`',
        translate_error:      '❌ Translation failed. Try again!\n📢 Example: `{p}translate hi Hello`',

        // weather
        weather_usage:
            `🌤️ *WEATHER*\n\n` +
            `Check live weather for any city!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}weather Mumbai\`\n` +
            `  \`{p}weather Delhi\`\n` +
            `  \`{p}weather London\``,
        weather_not_found: '❌ Weather for "{city}" not found. Check the city name!',
        weather_error:     '❌ Failed to fetch weather for "{city}". Try again!',
    },
    hi: {
        font_usage:      '✍️ *Font Converter*\n\nUse karo:\n  `{p}font <style> <text>`\n  `{p}font list` → sabhi styles dekho\n  `{p}font all <text>` → sabhi mein preview',
        font_not_found:  '❌ Font style nahi mili. `{p}font list` se sabhi dekho.',

        // calc
        calc_usage:
            `🧮 *CALCULATOR*\n\n` +
            `Koi bhi math expression calculate karo!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}calc 2+2\`\n` +
            `  \`{p}calc (10*5)/2\`\n` +
            `  \`{p}calc 2**10\` → 2^10\n` +
            `  \`{p}calc 100-45+32\`\n\n` +
            `*Operators:* + − × / ** % ()`,
        calc_too_long:   '❌ Expression bahut lamba hai! 100 characters se kam rakho.\n📢 Example: `{p}calc 2+2`',
        calc_invalid:    '❌ Invalid expression!\n📢 Example: `{p}calc 2+2`',
        calc_bad_ops:    '❌ Expression galat hai!\n📢 Example: `{p}calc (10*5)/2`',
        calc_bad_result: '❌ Invalid result! Division by zero ya galat expression.\n📢 Example: `{p}calc 2+2`',
        calc_error:      '❌ Expression galat hai!\n📢 Example: `{p}calc 2+2`',

        // define
        define_usage:
            `📖 *DICTIONARY*\n\n` +
            `Kisi bhi English word ka meaning aur definition dekho!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}define love\`\n` +
            `  \`{p}define ephemeral\`\n` +
            `  \`{p}define serendipity\``,
        define_not_found: '❌ *"{word}"* ka definition nahi mila!\n📢 English word likhna hai',
        define_error:     '❌ *"{word}"* dictionary mein nahi mila!\n📢 Example: `{p}define beautiful`',

        // font (execute-level strings)
        font_all_no_text:    '❌ Text do!\nExample: `{p}font all Hello World`',
        font_all_footer:     '📢 Koi style pasand aaye toh: `{p}font <style> {text}`',
        font_style_invalid:  '❌ *Font style nahi mili:* `{style}`\n\n📢 Sahi style name likho ya number use karo.\nList ke liye: `{p}font list`',
        font_style_no_text:  '❌ Text do!\nExample: `{p}font {key} Hello World`',
        font_style_footer:   '📢 Aur styles: `{p}font list`',

        // qr
        qr_usage:
            `🔲 *QR CODE GENERATOR*\n\n` +
            `Kisi bhi text ya link ka QR code banao!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}qr Hello World\`\n` +
            `  \`{p}qr https://youtube.com\`\n` +
            `  \`{p}qr Mera number: 9876543210\``,
        qr_error: '❌ QR code nahi bana. Try again!\n📢 Example: `{p}qr Hello World`',

        // translate
        translate_usage:
            `🌐 *TRANSLATE*\n\n` +
            `Kisi bhi bhasha mein translate karo!\n\n` +
            `📢 *How to use:* \`{p}translate <lang> <text>\`\n\n` +
            `*Examples:*\n` +
            `  \`{p}translate hi Hello how are you\`\n` +
            `  \`{p}translate es Good morning\`\n` +
            `  \`{p}translate ja I love anime\`\n\n` +
            `*Lang codes:* hi ur es fr de ja ko zh ar pt ru it tr bn ta te mr gu pa`,
        translate_no_text:    '❌ Text bhi likho!\n📢 Example: `{p}translate hi Hello`',
        translate_failed:     '❌ Translation nahi hui. Lang code sahi hai?\n📢 Example: `{p}translate hi Hello`',
        translate_error:      '❌ Translation fail hua. Try again!\n📢 Example: `{p}translate hi Hello`',

        // weather
        weather_usage:
            `🌤️ *WEATHER*\n\n` +
            `Kisi bhi city ka live weather dekho!\n\n` +
            `📢 *How to use:*\n` +
            `  \`{p}weather Mumbai\`\n` +
            `  \`{p}weather Delhi\`\n` +
            `  \`{p}weather London\``,
        weather_not_found: '❌ "{city}" ka weather nahi mila. City ka naam sahi likho!',
        weather_error:     '❌ Weather fetch nahi hua "{city}" ke liye. Try again!',
    }
}
