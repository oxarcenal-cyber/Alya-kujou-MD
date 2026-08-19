import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { checkAndAwardBadges } from '../../lib/BadgeList'

@Command('setbirthday', {
    description: 'Set your birthday to receive wishes 🎂',
    aliases: ['setbday', 'mybirthday'],
    usage: 'setbirthday DD/MM',
    cooldown: 10,
    exp: 10,
    category: 'general'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input = context.trim()

        if (!input)
            return void M.reply(
                `🎂 *SET BIRTHDAY*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📖 *How to use:*\n` +
                `\`${prefix}setbirthday DD/MM\`\n\n` +
                `_Example: ${prefix}setbirthday 25/12 (December 25)_`
            )

        const parts = input.split('/')
        if (parts.length !== 2)
            return void M.reply(`❌ Invalid format! Use *DD/MM*\n_Example: ${prefix}setbirthday 15/08_`)

        const day   = parseInt(parts[0])
        const month = parseInt(parts[1])

        if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12)
            return void M.reply(`❌ Invalid date! Day: 1-31, Month: 1-12`)

        const ddmm = day * 100 + month  // e.g. 1508 = Aug 15

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { birthday: ddmm } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        await checkAndAwardBadges(M.sender.jid, this.client.DB)

        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

        return void M.reply(
            `🎂 *BIRTHDAY SET!*\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `📅 *${M.sender.username}'s birthday:* ${day} ${MONTHS[month - 1]}\n\n` +
            `🎁 You'll receive *+2000 Gold* on your birthday!\n` +
            `🏅 *Birthday Star* badge earned!\n\n` +
            `_Use \`${prefix}birthdays\` to see upcoming birthdays in this group_`
        )
    }
}
