import { BaseCommand, Command, Message } from '../../Structures'

@Command('daily', {
    category: 'economy',
    description: 'Claim your daily gold reward',
    usage: 'daily',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const pad = (s: number): string => (s < 10 ? '0' : '') + s
        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / (60 * 60))
            const minutes = Math.floor((seconds % (60 * 60)) / 60)
            const secs = Math.floor(seconds % 60)
            return `*${pad(hours)} hour(s), ${pad(minutes)} minute(s), ${pad(secs)} second(s)*`
        }
        const time = 86400000
        const { lastDaily: cd } = await this.client.DB.getUser(M.sender.jid)
        if (time - (Date.now() - cd) > 0) {
            const timeLeft = formatTime((time - (Date.now() - cd)) / 1000)
            return void M.reply(`⏳ You have already claimed your daily 💰 recently.\nClaim again in ${timeLeft}`)
        }
        await this.client.DB.setCrystal(M.sender.jid, 1000)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { lastDaily: Date.now() } })
        const text =
            `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
            `  🌸✿ᰰ  *Daily Reward!*  ✿ᰰ🌸\n` +
            `      𐚁 🎁 𝑫𝒂𝒊𝒍𝒚 𝑪𝒍𝒂𝒊𝒎𝒆𝒅! 𐚁\n\n` +
            `  ‧₊˚ 💎 𝑮𝒐𝒍𝒅  ·❀·  +1,000\n` +
            `  ‧₊˚ 📅 𝑵𝒆𝒙𝒕  ·❀·  24 hrs\n\n` +
            `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
            `  🍃 ⁺. !wallet · !bank .⁺ 🍃\n\n` +
            `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒍𝒂𝒊𝒎𝒆𝒅 𖥻ִֶָ`
        return void (await this.client.sendMessage(M.from, { text }, {
            quoted: M.message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}
