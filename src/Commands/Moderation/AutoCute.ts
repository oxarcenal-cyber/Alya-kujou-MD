import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('autocute', {
    description: 'Randomly send cute mochi-cat stickers in the group — toggle on/off',
    aliases: ['mochi', 'cutesticker', 'cs'],
    usage: 'autocute on | autocute off | autocute',
    cooldown: 5,
    exp: 10,
    category: 'moderation'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        if (M.chat !== 'group' || !M.groupMetadata)
            return void M.reply(`❌ This command only works in groups!`)

        const isMod = this.client.config.mods.some(
            (mod) => this.client.correctJid(mod) === this.client.correctJid(M.sender.jid)
        )
        if (!M.sender.isAdmin && !isMod)
            return void M.reply(
                `❌ Only *group admins* can use this!\n\n` +
                `📢 Use: \`${prefix}autocute on/off\``
            )

        const data = await this.client.DB.getGroup(M.from)
        const current = (data as any).autoCute as boolean ?? false
        const input = context.trim().toLowerCase()

        // ── No input → status ───────────────────────────────────────────────
        if (!input) {
            return void M.reply(
                `🐾 *AUTO CUTE STICKERS*\n` +
                `${'─'.repeat(30)}\n\n` +
                `📌 *Status:* ${current ? '🟢 ON' : '🔴 OFF'}\n` +
                `🎲 *Trigger:* ~12% chance per message\n` +
                `🖼️ *Style:* Mochi-cat anime stickers\n\n` +
                `${'─'.repeat(30)}\n` +
                `📢 *Commands:*\n` +
                `  \`${prefix}autocute on\`  → Enable\n` +
                `  \`${prefix}autocute off\` → Disable`
            )
        }

        if (input !== 'on' && input !== 'off')
            return void M.reply(
                `❌ Type \`on\` or \`off\`!\n\n` +
                `📢 Example: \`${prefix}autocute on\``
            )

        const newValue = input === 'on'

        if (newValue === current)
            return void M.reply(`🟨 Auto Cute is already *${input.toUpperCase()}*!`)

        await this.client.DB.updateGroup(M.from, 'autoCute' as any, newValue)

        return void M.reply(
            newValue
                ? `🐾 *AUTO CUTE ON!* 💗\n\n` +
                  `Cute mochi-cat stickers will randomly appear in this group~\n\n` +
                  `🎲 *Chance:* ~12% per message\n` +
                  `📢 Off karne ke liye: \`${prefix}autocute off\``
                : `😿 *AUTO CUTE OFF!*\n\n` +
                  `No more random stickers in this group.\n\n` +
                  `📢 On karne ke liye: \`${prefix}autocute on\``
        )
    }
}
