import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('menutest', {
    description: 'Tests all types of interactive CTA buttons',
    usage: 'menutest',
    category: 'dev',
    aliases: ['btntest', 'ctaTest'],
    cooldown: 5,
    exp: 0,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        const body =
            `╭━━━✦ *CTA BUTTON TEST* ✦━━━╮\n` +
            `┃\n` +
            `┃  *3 Types of Buttons:*\n` +
            `┃\n` +
            `┃  1️⃣  *Reply Button* — press karo\n` +
            `┃     toh command chalti hai\n` +
            `┃\n` +
            `┃  2️⃣  *URL Button* — press karo\n` +
            `┃     toh link khulta hai\n` +
            `┃\n` +
            `┃  3️⃣  *Copy Button* — press karo\n` +
            `┃     toh text copy hota hai\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━━━╯`

        // Message 1: Reply button via buttonsFormat:'buttons' — tap sends buttonsResponseMessage.selectedButtonId = command
        await this.client.sendMessage(
            M.from,
            {
                text: body,
                footer: '⚡ RedzeoX — Rias Gremory',
                title: '🧪 Interactive Button Test',
                buttonsFormat: 'buttons',
                buttons: [
                    {
                        text: '🏓 Reply Button (Ping)',
                        id: `${prefix}ping`
                    }
                ]
            } as unknown as AnyMessageContent,
            { quoted: M.message }
        )
        // Message 2: URL + Copy via interactive/nativeFlow — client handles them directly (no bot response)
        await this.client.sendMessage(
            M.from,
            {
                text: '↑ *Button 1* above sends a command.\n↓ *Buttons 2 & 3* below are client-side:',
                footer: '⚡ RedzeoX — Rias Gremory',
                buttons: [
                    {
                        text: '🌐 URL Button (GitHub)',
                        url: 'https://github.com'
                    },
                    {
                        text: '📋 Copy Button (Prefix)',
                        copy: prefix
                    }
                ]
            } as unknown as AnyMessageContent
        )
    }
}
