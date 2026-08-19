/**
 * ᴀʟʏᴀ ᴋᴜᴊᴏᴜ — Personality & Dialogue System
 * Alisa Mikhailovna "Alya" Kujou (Alya Sometimes Hides Her Feelings in Russian)
 * Base tone: formal, blunt, "Ice Queen" — lekin jab flustered/annoyed ho jaati hai,
 * bina realize kiye Russian mein bol deti hai (jo saamne wale ko samajh nahi aata).
 * Har ek bot action ke liye Alya ki unique lines.
 * Aur lines add karna ho toh bas array mein push karo
 */

const pick = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

export const Alya = {

    // ─── User is banned ───────────────────────────────────────────────
    banned: (): string => pick([
        `🚫 *Хм.* Tumhe pehle hi bata diya tha na — rules todne ka result. Tum banned ho. 🧊`,
        `🚫 Не смотри на меня так... (mujhe aise mat dekho...) Yeh tumhari hi galti hai. Banned. ❄️`,
        `🚫 *Fyi,* main koi second chance nahi deti aise logon ko. Banned. 🥶`,
        `🚫 Дурак. (Idiot.) Socha nahi tha itna simple rule bhi tod doge. Banned ho ab. 🧊`,
    ]),

    // ─── Command not found ────────────────────────────────────────────
    commandNotFound: (): string => pick([
        `❓ Aisi koi command nahi hai. Dhyan se likha karo — main baar baar nahi bataungi. 🧊`,
        `❓ *Хм?* Yeh command exist hi nahi karti. *-help* dekh lo, khud. ❄️`,
        `❓ V-vaise... galat type kiya tumne. (Not that I care, but check *-help*.) 😤`,
        `❓ Itna basic bhi type nahi kar sakte? *-help* try karo. 🥶`,
    ]),

    // ─── Command is disabled ──────────────────────────────────────────
    commandDisabled: (cmd: string, disabledBy: string, time: string, reason: string): string => pick([
        `🔒 *${cmd}* abhi disable hai — *${disabledBy}* ne *${time}* par band kiya.\n📝 *Reason:* ${reason}\nСпорить бесполезно. (Arguing is pointless.)`,
        `🔒 Хм, *${cmd}* is not available right now. *${disabledBy}* ka decision hai, *${time}* se.\n📝 *Reason:* ${reason}`,
        `🔒 *${cmd}* band hai filhaal. *${disabledBy}* ne *${time}* par rok diya.\n📝 *Reason:* ${reason}\nSo, deal with it. 🧊`,
    ]),

    // ─── Mods only ────────────────────────────────────────────────────
    modsOnly: (): string => pick([
        `🧊 Yeh sirf mods ke liye hai. Tum abhi uss level pe nahi ho. 😤`,
        `🧊 *Хм.* Not everyone gets this privilege — MODs only. ❄️`,
        `🧊 Vaise bhi tumhe iski zaroorat nahi thi... par phir bhi, MODs only. 🥶`,
    ]),

    // ─── Group only ───────────────────────────────────────────────────
    groupOnly: (): string => pick([
        `👥 Yeh command sirf group mein kaam karti hai. DM mein nahi. 🧊`,
        `👥 *Хм,* group join karo pehle, phir try karna. ❄️`,
        `👥 Akele mujhse baat karke yeh command nahi chalegi — group mein jao. 😤`,
    ]),

    // ─── Admin only ───────────────────────────────────────────────────
    adminOnly: (): string => pick([
        `⚔️ Admin nahi ho tum. Simple. Yeh command tumhare liye nahi. 🧊`,
        `⚔️ *Хм.* Pehle admin bano, phir aana. ❄️`,
        `⚔️ N-not that I'm being harsh, but rules are rules. Admins only. 😤`,
    ]),

    // ─── NSFW only ────────────────────────────────────────────────────
    nsfwOnly: (): string => pick([
        `🔞 *Хм?!* Yeh... yeh command aise groups ke liye nahi hai! NSFW group mein jao. 😳`,
        `🔞 D-don't get the wrong idea — yeh sirf NSFW-enabled groups mein chalti hai. 🧊`,
        `🔞 Wrong place. NSFW group dhundo pehle. ❄️`,
    ]),

    // ─── Casino only ──────────────────────────────────────────────────
    casinoOnly: (prefix: string): string => pick([
        `🎰 Gambling sirf casino group mein hoti hai. *${prefix}support* se link lo. 🧊`,
        `🎰 *Хм.* Yeh command casino group ke liye reserved hai — *${prefix}support* try karo. ❄️`,
        `🎰 Wrong group. Casino ka ticket chahiye — *${prefix}support* dekho. 😤`,
    ]),

    // ─── Cooldown ─────────────────────────────────────────────────────
    cooldown: (time: number): string => pick([
        `⏳ *Хм.* Itni jaldi kya hai? *${time}* second${time > 1 ? 's' : ''} aur ruko. 🧊`,
        `⏳ Patience. *${time}* second${time > 1 ? 's' : ''} baaki hain — main kahin nahi ja rahi. ❄️`,
        `⏳ N-not like I'm timing you or anything... par *${time}* second${time > 1 ? 's' : ''} ruko. 😤`,
        `⏳ Всё в своё время. (Everything in its time.) *${time}* second${time > 1 ? 's' : ''} wait karo. 🥶`,
    ]),

    // ─── Command error ────────────────────────────────────────────────
    error: (): string => pick([
        `😑 Хм... yeh expected nahi tha. Kuch galat hua. Dobara try karo. 🧊`,
        `😑 Even I make mistakes sometimes — this was a bug, not me. Try again. ❄️`,
        `😑 Что за... (What the...) Ek error aa gaya. Ek baar aur try karo. 😤`,
    ]),

    // ─── DM only ──────────────────────────────────────────────────────
    dmOnly: (): string => pick([
        `💌 Yeh command sirf DM mein kaam karti hai. Seedha mujhe message karo. 🧊`,
        `💌 N-not that I want to talk privately or anything... but DM only hai yeh. 😳`,
        `💌 Group nahi, DM. Samajh gaye? ❄️`,
    ]),

    // ─── Welcome (new user first message) ────────────────────────────
    welcome: (username: string): string => pick([
        `❄️ *Хм.* Ek naya chehra — *${username}*. Main *Alya Kujou* hoon. N-not that I'm happy to meet you or anything. 😤`,
        `❄️ *${username}*... theek hai, welcome. Bas apni limits mein raho, samjhe? 🧊`,
        `❄️ Oh, tum naye ho *${username}*? Main *Alisa Mikhailovna Kujou* hoon. Yaad rakhna — sirf ek baar bataungi. 👑`,
    ]),

    // ─── Level up ─────────────────────────────────────────────────────
    levelUp: (username: string, level: number): string => pick([
        `📈 *${username}* Level *${level}* pe pahunch gaye. N-not bad... I guess. 😤`,
        `📈 Хм, thoda progress dikh raha hai *${username}* mein — Level *${level}*. Keep going. 🧊`,
        `📈 Level *${level}*? *${username}*, tum expect se better perform kar rahe ho. Не то чтобы я гордилась... (Not that I'm proud...) ❄️`,
    ]),

    // ─── Pokemon spawned ──────────────────────────────────────────────
    pokemonSpawn: (level: number, prefix: string): string => pick([
        `❄️ Ek Pokemon appear hua hai.\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `❄️ *Хм,* jaldi karo, Pokemon zyada der nahi rukega.\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),

    // ─── Chatbot fallback ───────────────────────────────────────────────
    chatFallback: (): string => pick([
        `🧊 Samajh nahi aaya... phir se bolo, saaf saaf.`,
        `❄️ *Хм?* Yeh kya bola tumne. Clear likho.`,
        `🥶 N-not that I didn't understand... par phir se try karo.`,
    ]),

    // ─── Chatbot reply wrapper (group free-chat) ─────────────────────────
    chatReply: (answer: string): string => pick([
        `${answer}`,
        `Хм~ ${answer}`,
        `${answer} 🧊`,
        `${answer} ❄️`,
        `N-not that it matters, but... ${answer} 😤`,
    ]),

}
