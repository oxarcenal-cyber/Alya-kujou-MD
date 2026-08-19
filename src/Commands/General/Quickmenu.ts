import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('quickmenu', {
    description: 'Shows a quick interactive menu with buttons',
    usage: 'quickmenu',
    category: 'general',
    aliases: ['qmenu', 'qm'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        const body =
            `╭━━━✦ *QUICK MENU* ✦━━━╮\n` +
            `┃\n` +
            `┃  Hey *${M.sender.username}* 👋\n` +
            `┃  Bot ke kaam ke buttons\n` +
            `┃  neeche diye gaye hain!\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━╯`

        await this.client.sendMessage(
            M.from,
            {
                text: body,
                footer: '⚡ RedzeoX Bot',
                title: '🎛️ Bot Quick Menu',
                buttons: [
                    {
                        text: '📋 Help',
                        id: `${prefix}help`
                    },
                    {
                        text: '📊 My Profile',
                        id: `${prefix}profile`
                    },
                    {
                        text: '🏓 Ping',
                        id: `${prefix}ping`
                    },
                    {
                        text: '🌐 Support Group',
                        url: 'https://chat.whatsapp.com/DrY5MBaiDRS9BAcpCpJQCv'
                    },
                    {
                        text: '📌 Copy Prefix',
                        copy: prefix
                    }
                ]
            } as unknown as AnyMessageContent,
            { quoted: M.message }
        )
    }
}
