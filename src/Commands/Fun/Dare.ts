import { Command, BaseCommand, Message } from '../../Structures'
import { t } from '../../lib'
import { askGroq } from '../../lib/GroqFun'

// ─── Fallback Dares (agar Groq unavailable ho) ────────────────────────────────
const FALLBACK_DARES = [
    'Group mein apni ek embarrassing photo send karo!',
    'Next 5 messages mein sirf "moo" likhna hai.',
    'Apna favorite song ka pehla line gao (voice note mein!).',
    'Group mein apna most cringe status update karo.',
    '3 logon ko unsolicited compliment do abhi.',
    'Next 10 minutes tak sirf caps lock mein likhna hai.',
    'Apni profile picture change karo kisi funny meme se — 1 ghante ke liye.',
    'Last photo roll ki photo share karo bina dekhe.',
    'Apna full name backwards type karo.',
    'Har message ke baad "owo" likhna hai — agli 5 messages mein.',
    'Apne aap ko emoji se describe karo — sirf emojis mein.',
    'Group mein apni favorite movie ka dialogue likho.',
    'Bina copy-paste ke 10 se lekar 100 tak 10 ke multiples likho.',
    'Apni aankhe band karke ek selfie lo aur share karo.',
    'Kisi group member ki tarif karo 3 different lines mein.',
    'Next message mein apni zindagi ka summary 1 line mein do.',
    'Koi riddle pucho group mein.',
    '30 seconds mein jitne emojis type kar sako karo — GO!',
    'Kisi bhi member ko "best member" ka title do aur reason batao.',
    'Apna favorite food emoji se represent karo — bina naam likhe.'
]

@Command('dare', {
    description: 'Get a random AI dare for Truth or Dare 😈',
    category: 'fun',
    usage: 'dare',
    aliases: ['himmat'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang = await this.getLang(M)

        // Groq se fresh AI dare lene ki koshish karo
        const aiDare = await askGroq(
            `Generate ONE creative, fun, and safe dare challenge for a WhatsApp group Truth or Dare game. ` +
            `The dare should be doable in a text/chat setting (no physical danger). ` +
            `Hinglish (Hindi+English mix) mein likho. ` +
            `Sirf dare ka text do — koi prefix, numbering ya explanation mat lagao. 1-2 lines max.`
        )

        const dare = aiDare ?? FALLBACK_DARES[Math.floor(Math.random() * FALLBACK_DARES.length)]

        return void M.reply(
            `😈 *DARE* 😈\n` +
            `${'─'.repeat(25)}\n\n` +
            `🎯 ${dare}\n\n` +
            `${'─'.repeat(25)}\n` +
            t('fun_dare_footer', lang, { prefix })
        )
    }
}
