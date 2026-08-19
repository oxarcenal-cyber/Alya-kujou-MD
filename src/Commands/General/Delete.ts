import { BaseCommand, Command, Message } from '../../Structures'

@Command('delete', {
    description: 'Deletes the quoted message',
    category: 'general',
    usage: 'delete [quote_message]',
    exp: 10,
    cooldown: 15,
    aliases: ['del']
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.quoted) return void M.reply('Please quote the message you want to delete!')

        // Bot's own message — always deletable, no admin check needed
        if (M.quoted.key.fromMe) {
            return void (await this.client.sendMessage(M.from, { delete: M.quoted.key }))
        }

        // Deleting someone else's message — user must be admin
        // Same double-safety pattern as NSFWToggle (M.sender.isAdmin + manual JID check)
        const senderJid = this.client.correctJid(M.sender.jid)
        const adminJids = (M.groupMetadata?.admins || []).map((j: string) => this.client.correctJid(j))
        const isUserAdmin = M.sender.isAdmin || adminJids.includes(senderJid)

        if (!isUserAdmin)
            return void M.reply("Only admins can delete other members' messages!")

        // NOTE: The bot can only delete others' messages when it is a group admin.
        // If the bot is removed from admin, this will fail silently on WhatsApp's side.
        // We attempt the delete and catch any rejection — no JID comparison needed.
        // To restore delete functionality: promote the bot to admin again in group settings.
        try {
            await this.client.sendMessage(M.from, { delete: M.quoted.key })
        } catch {
            return void M.reply("Make me an admin first so I can delete others' messages!")
        }
    }
}
