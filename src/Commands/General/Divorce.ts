import { BaseCommand, Command, Message } from '../../Structures'

@Command('divorce', {
    description: 'Break up your marriage 💔',
    aliases: ['breakup'],
    usage: 'divorce',
    cooldown: 30,
    exp: 5,
    category: 'general',
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const userData = await this.client.DB.getUser(M.sender.jid)
        const partner = (userData as any).partner as string

        if (!partner)
            return void M.reply(`💔 You're not married to anyone right now!\nUse \`${this.client.config.prefix}marry @user\` to get married.`)

        const partnerName = `@${partner.split('@')[0]}`

        // Clear both sides
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { partner: '' } })
        await this.client.DB.user.updateOne({ jid: partner }, { $set: { partner: '' } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)
        this.client.DB.cacheInvalidate(`user:${partner}`)

        return void M.reply(
            `💔 *DIVORCE*\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `😢 *@${M.sender.username}* has divorced ${partnerName}.\n\n` +
            `_Sometimes things don't work out... you're single again._\n` +
            `💌 Use \`${this.client.config.prefix}marry @user\` to find love again!`,
            'text', undefined, undefined, undefined, [M.sender.jid, partner]
        )
    }
}
