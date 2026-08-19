import { Command, BaseCommand, Message } from '../../Structures'

@Command('info', {
    description: "Displays the bot's info",
    usage: 'info',
    category: 'general',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const groups = await this.client.DB.group.find({})
        const users = await this.client.DB.user.find({})
        const pad = (s: number): string => (s < 10 ? '0' : '') + s
        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / (60 * 60))
            const minutes = Math.floor((seconds % (60 * 60)) / 60)
            const secs = Math.floor(seconds % 60)
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
        }
        const uptime = formatTime(process.uptime())
        return void (await reply(
            `*━━━❰ CELESTIC ❱━━━*\n\n🔗 *Commands:* ${
                Array.from(this.handler.commands, ([command, data]) => ({
                    command,
                    data
                })).length
            }\n\n💰 *Groups:* ${groups.length}\n\n🎐 *Users:* ${users.length}\n\n🚦 *Uptime:* ${uptime.
  length}\n\n♨️ *sessions:* 26\n\n🟣 *mods:* 7\n\n💎 *disable comamnds:* 0\n\n🔢 *banned users:* 0\n\n🔑 *Co-mods:* 3\n\n📛 *version:* 9\n\nuse support commands to reach our groups`      
   
                     ))
    }
}
