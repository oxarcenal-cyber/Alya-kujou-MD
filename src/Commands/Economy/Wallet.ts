import { BaseCommand, Command, Message } from '../../Structures'

@Command('wallet', {
    description: 'Check your wallet balance',
    usage: 'wallet',
    category: 'economy',
    exp: 10,
    cooldown: 10,
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const { wallet, tag } = await this.client.DB.getUser(sender.jid)
        const text =
            `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
            `  🌸✿ᰰ  *${sender.username}*  ✿ᰰ🌸\n` +
            `      𐚁 👛 𝑾𝒂𝒍𝒍𝒆𝒕 𖥻 𐚁\n\n` +
            `  ‧₊˚ 🧧 𝑵𝒂𝒎𝒆  ·❀·  ${sender.username}\n` +
            `  ‧₊˚ ☘️ 𝑻𝒂𝒈   ·❀·  #${tag}\n` +
            `  ‧₊˚ 💎 𝑮𝒐𝒍𝒅  ·❀·  ${(wallet as number).toLocaleString()}\n\n` +
            `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
            `  🍃 ⁺. !bank · !daily .⁺ 🍃\n\n` +
            `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`
        return void (await this.client.sendMessage(from, { text }, {
            quoted: message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}
