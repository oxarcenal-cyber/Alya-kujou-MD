import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('removeall', {
    description: 'Remove all regular members from the group (with confirmation) 🚫',
    category: 'moderation',
    usage: 'removeall [confirm]',
    aliases: ['kickall', 'clearall'],
    cooldown: 60,
    exp: 20,
    adminRequired: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const isAdmin = M.sender.isAdmin
        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!isAdmin && !isMod)
            return void M.reply(
                `❌ *Sirf admins use kar sakte hain!*\n\n` +
                `📢 *How to use:* \`${prefix}removeall\` → preview\n` +
                `✅ Confirm karne ke liye: \`${prefix}removeall confirm\``
            )

        const participants = M.groupMetadata.participants || []
        const normalize = (jid: string): string => this.client.correctJid(jid)
        const botJid = this.client.user?.id || ''
        const senderJid = M.sender.jid
        const ownerJid = M.groupMetadata.owner || ''

        // Admins, group owner, bot, and the command sender are never candidates.
        // Checking both raw and normalized JIDs keeps this safe with WhatsApp LID IDs.
        const isProtected = (jid: string, isParticipantAdmin: boolean): boolean => {
            if (isParticipantAdmin) return true
            const ids = [jid, normalize(jid)]
            return [ownerJid, botJid, senderJid].some(
                (protectedJid) =>
                    protectedJid !== '' &&
                    (ids.includes(protectedJid) || ids.includes(normalize(protectedJid)))
            )
        }

        const candidates = participants
            .filter((participant) => !isProtected(participant.id, participant.admin !== null && participant.admin !== undefined))
            .map((participant) => participant.id)

        if (!candidates.length)
            return void M.reply(
                `✅ *Group already clean hai!*\n\n` +
                `Admins, owner aur bot ko remove nahi kiya jaata.`
            )

        const confirmed = context.trim().toLowerCase() === 'confirm'
        if (!confirmed)
            return void M.reply(
                `⚠️ *REMOVE ALL PREVIEW*\n${'─'.repeat(25)}\n\n` +
                `👥 *Regular members:* ${candidates.length}\n` +
                `🛡️ *Protected:* admins, group owner aur bot\n\n` +
                `⚠️ Ye ${candidates.length} members ko group se remove karega.\n` +
                `Agar pakka ho to likho: \`${prefix}removeall confirm\``
            )

        let removed = 0
        let failed = 0
        // Keep requests sequential so WhatsApp does not rate-limit a large group cleanup.
        for (const jid of candidates) {
            try {
                await this.client.groupParticipantsUpdate(M.from, [jid], 'remove')
                removed++
            } catch {
                failed++
            }
        }

        return void M.reply(
            `🚫 *REMOVE ALL RESULTS* 🚫\n${'─'.repeat(25)}\n\n` +
                `✅ Removed: *${removed}*\n` +
                `❌ Failed: *${failed}*\n` +
                `🛡️ Protected members ko skip kiya gaya.`
        )
    }
}