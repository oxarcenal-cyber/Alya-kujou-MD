import { BaseCommand, Command, Message } from '../../Structures'
import { getStats } from '../../lib'

@Command('profile', {
    description: "Displays user's profile",
    category: 'general',
    aliases: ['p'],
    cooldown: 15,
    exp: 30,
    usage: 'profile [tag/quote users]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 1) users.push(M.sender.jid)
        const user = users[0]
        const username = user === M.sender.jid ? M.sender.username : (this.client.contact.getContact(user)?.username ?? user.split('@')[0])
        let pfpUrl: string | undefined
        try {
            pfpUrl = await this.client.profilePictureUrl(user, 'image')
        } catch {
            pfpUrl = undefined
        }
        const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : (this.client.assets.get('404') as Buffer)
        let bio!: string
        try {
            const statusResult = await this.client.fetchStatus(user)
            bio = (statusResult?.[0]?.['status'] as string) || ''
        } catch (error) {
            bio = ''
        }
        const { banned, experience, level, tag } = await this.client.DB.getUser(user)
        const admin = this.client.utils.capitalize(`${M.groupMetadata?.admins?.includes(user) || false}`)
        const { rank } = getStats(level)
        return void M.reply(
            pfp,
            'image',
            undefined,
            undefined,
            `🏮 *Username:* ${username}#${tag}\n\n🎫 *Bio:* ${bio}\n\n🌟 *Experience:* ${experience}\n\n🥇 *Rank:* ${rank}\n\n🍀 *Level:* ${level}\n\n👑 *Admin:* ${admin}\n\n🟥 *Banned:* ${this.client.utils.capitalize(
                `${banned || false}`
            )}`
        )
    }
}
