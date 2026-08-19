import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

const riddles = [
    { q: 'Main jitna sukhta hoon, utna bheega rehta hoon. Main kya hoon?', a: 'Towel (Tauliya)' },
    { q: 'Woh kaunsi cheez hai jo hamesha aage badhti hai lekin kabhi peeche nahi jaati?', a: 'Time (Samay)' },
    { q: 'Mere paas aankhen hain lekin main dekh nahi sakta. Main kya hoon?', a: 'Potato (Aloo)' },
    { q: 'Jitna zyada tum mujhe nikalte ho, utna bada main hota hoon. Main kya hoon?', a: 'A Hole (Gadha)' },
    { q: 'Mera koi munh nahi, lekin main tumse baat karta hoon. Main kya hoon?', a: 'Echo (Goonj)' },
    { q: 'Jab main jawan hoon toh main lamba hoon, jab main boodha hoon toh main chota hoon. Main kya hoon?', a: 'Candle (Mombatti)' },
    { q: 'Mujhe tod do, main kaam aata hoon. Mujhe mat todo, main kaam nahi aata. Main kya hoon?', a: 'Egg (Anda)' },
    { q: 'Main hamesha samne hoon lekin tum mujhe dekh nahi sakte. Main kya hoon?', a: 'Future (Bhavishya)' },
    { q: 'Mujhe paani se banta hai, lekin paani se dar lagta hai. Main kya hoon?', a: 'Salt (Namak)' },
    { q: 'Sabke paas hai lekin share nahi kiya ja sakta. Main kya hoon?', a: 'Shadow (Parchayi)' },
    { q: 'Main khali hoon lekin bhar sakta hoon. Pura hoon lekin badh sakta hoon. Main kya hoon?', a: 'Bag/Pocket' },
    { q: 'Woh kya hai jo aage bhi padho aur peeche bhi same lage?', a: 'Palindrome (e.g. madam, racecar)' },
    { q: 'Jitna zyada loge, utna zyada chhodoge peeche. Main kya hoon?', a: 'Footsteps (Kadam)' },
    { q: 'Ek baar bolo toh chhota hoon, do baar bolo toh bada. Kya hoon?', a: 'Letter "O" (Oh vs. Ohh)' },
    { q: 'Paani mein rehta hoon lekin geela nahi hota. Main kya hoon?', a: 'Shadow in water (Parchayi)' }
]

const activeRiddles = new Map<string, typeof riddles[0]>()

@Command('riddle', {
    description: 'A tricky riddle to solve! 🧩',
    category: 'games',
    usage: 'riddle || riddle answer',
    aliases: ['paheli'],
    cooldown: 5,
    exp: 20,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const current = activeRiddles.get(M.from)
        const input = context.trim().toLowerCase()

        if (input === 'answer' || input === 'ans' || input === 'jawab') {
            if (!current)
                return void M.reply(
                    `❌ Koi riddle active nahi hai!\n📢 *Pehle shuru karo:* \`${prefix}riddle\``
                )
            activeRiddles.delete(M.from)
            return void await this.client.sendMessage(M.from, {
                text:
                    `💡 *ANSWER* 💡\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `❓ *Riddle:* ${current.q}\n\n` +
                    `✅ *Jawab:* *${current.a}*\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 Naya riddle: \`${prefix}riddle\``,
                footer: '🧩 RedzeoX Riddle',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🧩 New Riddle', id: `${prefix}riddle` }]
            } as any, { quoted: M.message })
        }

        const riddle = riddles[Math.floor(Math.random() * riddles.length)]
        activeRiddles.set(M.from, riddle)
        return void await this.client.sendMessage(
            M.from,
            {
                text:
                    `🧩 *RIDDLE* 🧩\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `❓ ${riddle.q}\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `🤔 Jawab socho aur group mein likho!`,
                footer: '🧩 RedzeoX Riddle',
                buttonsFormat: 'buttons',
                buttons: [{ text: '💡 Show Answer', id: `${prefix}riddle answer` }]
            } as any,
            { quoted: M.message }
        )
    }
}
