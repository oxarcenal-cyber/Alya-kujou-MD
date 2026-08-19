import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('ping', {
    description: 'Check the bot response latency',
    usage: 'ping',
    category: 'moderation',
    exp: 5,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, {}: IArgs): Promise<void> => {
        const start = Date.now()
        const sent = await M.reply('🏓 *Pinging...*')
        const latency = Date.now() - start
        const bars = this.getLatencyBars(latency)
        const status = latency < 500 ? '🟢 Excellent' : latency < 900 ? '🟡 Good' : '🔴 High'
        return void M.reply(
            `🏓 *Pong!*\n\n⏱ *Network Latency:* ${latency}ms\n📶 *Status:* ${status}\n${bars}\n\n_Note: This measures WhatsApp delivery time, not bot processing speed._`
        )
    }

    private getLatencyBars = (ms: number): string => {
        if (ms < 300) return '▰▰▰▰▰ Fast'
        if (ms < 500) return '▰▰▰▰▱ Good'
        if (ms < 700) return '▰▰▰▱▱ Average'
        if (ms < 1000) return '▰▰▱▱▱ Slow'
        return '▰▱▱▱▱ Very Slow'
    }
}
