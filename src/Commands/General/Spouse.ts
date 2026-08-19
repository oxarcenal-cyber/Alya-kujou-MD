import { BaseCommand, Command, Message } from '../../Structures'

@Command('spouse', {
    description: 'View your current partner info 💑',
    aliases: ['partner', 'mywife', 'myhusband'],
    usage: 'spouse',
    cooldown: 5,
    exp: 3,
    category: 'general'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const userData = await this.client.DB.getUser(M.sender.jid)
        const partnerJid = (userData as any).partner as string

        if (!partnerJid)
            return void M.reply(
                `💔 *You are currently single!*\n\n` +
                `💍 Use \`${this.client.config.prefix}marry @user\` to find your partner~ 🌹`
            )

        const partnerData = await this.client.DB.getUser(partnerJid)
        const partnerName = (partnerData.username as any)?.name || `@${partnerJid.split('@')[0]}`

        return void M.reply(
            `💑 *YOUR PARTNER*\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `👤 *Name:* ${partnerName}\n` +
            `📱 *Number:* +${partnerJid.split('@')[0]}\n` +
            `⭐ *Level:* ${partnerData.level}\n` +
            `💰 *Wallet:* ${partnerData.wallet.toLocaleString()} Gold\n` +
            `🎖️ *Badges:* ${(partnerData.badges || []).length > 0 ? (partnerData.badges || []).join(' ') : '_None yet_'}\n\n` +
            `❤️ _You and @${partnerJid.split('@')[0]} are married!_\n` +
            `_Use \`${this.client.config.prefix}divorce\` to end the marriage_`,
            'text', undefined, undefined, undefined, [partnerJid]
        )
    }
}
