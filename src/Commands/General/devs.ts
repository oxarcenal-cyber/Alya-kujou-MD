import { Command, BaseCommand, Message } from '../../Structures'

@Command('devs', {
    description: "Displays the bot's info",
    usage: 'devlopers',
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
            `*━━━❰ RIAS GREMORY DEV'S ❱━━━*\n\n👑 *DEVELOPER OF RIAS GREMORY* 👑\n\n♨️ *FOUNDER & OWNER* = RedzeoX\n\n🔗 *GITHUB* = github.com/REDZEOX\n\n⚙️ *BOT VERSION* = v0.1.0\n\n*━━━━━━━━━━━━━━━━━━━━━━*`
                     ))
    }
}
