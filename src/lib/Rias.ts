/**
 * ʀɪᴀꜱ ɢʀᴇᴍᴏʀʏ — Personality & Dialogue System
 * Har ek bot action ke liye Rias ki unique lines
 * Aur lines add karna ho toh bas array mein push karo
 */

const pick = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

export const Rias = {

    // ─── User is banned ───────────────────────────────────────────────
    banned: (): string => pick([
        `🚫 *Hmm~* Tum mere peerage se bahar ho. Banned users ko commands nahi milte. 😒`,
        `🚫 *Ara ara~* Lagta hai tumne kuch aisa kiya jo mujhe pasand nahi aaya. Banned ho tum. 😤`,
        `🚫 Main Rias Gremory hoon — aur mera faisla final hai. Tum banned ho. 👑`,
        `🚫 *Yare yare~* Meri taraf se koi maafi nahi. Banned rehna tum. 😌`,
        `🚫 Gremory clan ke rules todte ho? Consequences bhugto. Banned. 🔱`,
    ]),

    // ─── Command not found ────────────────────────────────────────────
    commandNotFound: (): string => pick([
        `❓ *Ara~* Yeh command toh mujhe pata hi nahi. Sahi naam likho Senpai~ 😏`,
        `❓ *Hmm~* Main bohot capable hoon, lekin yeh command exist nahi karti. 😅`,
        `❓ *Yare yare~* Aise command nahi hai mere paas. *-help* try karo~ 🌸`,
        `❓ Gremory clan ki heir bhi yeh command nahi jaanti. Galat likha tumne. 😌`,
        `❓ *Ara ara~* Mere peerage mein aisi koi power nahi. Check karo *-help* se~ 👑`,
    ]),

    // ─── Command is disabled ──────────────────────────────────────────
    commandDisabled: (cmd: string, disabledBy: string, time: string, reason: string): string => pick([
        `🔒 *Ara~* *${cmd}* command abhi mere haath se bahar hai — *${disabledBy}* ne band kiya *${time}* par.\n📝 *Reason:* ${reason}`,
        `🔒 *Hmm~* Main chahke bhi *${cmd}* nahi chala sakti abhi. *${disabledBy}* ne rok diya *${time}* par.\n📝 *Reason:* ${reason}`,
        `🔒 *Yare yare~* *${cmd}* disabled hai filhaal. *${disabledBy}* ka hukum hai *${time}* se.\n📝 *Reason:* ${reason}`,
    ]),

    // ─── Mods only ────────────────────────────────────────────────────
    modsOnly: (): string => pick([
        `🔱 *Ara ara~* Yeh command sirf mere khaas logon ke liye hai — MODs only~ 😏`,
        `🔱 *Hmm~* Itni bhi aukat nahi tumhari abhi. Yeh MODs ka kaam hai. 😤`,
        `🔱 Gremory clan ke sipaahiyon ko hi yeh power milti hai. MODs only. 👑`,
        `🔱 *Yare yare~* Restricted area hai yeh. Sirf MODs aage ja sakte hain~ 😌`,
    ]),

    // ─── Group only ───────────────────────────────────────────────────
    groupOnly: (): string => pick([
        `👥 *Ara~* Yeh command akele nahi chalti — group mein jao Senpai~ 😏`,
        `👥 *Hmm~* Yeh power sirf group mein kaam karti hai. DM mein nahi~ 😌`,
        `👥 Mera peerage saath mein hota hai — yeh command group ke liye hai. 🌸`,
        `👥 *Yare yare~* Group join karo pehle, phir yeh command try karna~ 👑`,
    ]),

    // ─── Admin only ───────────────────────────────────────────────────
    adminOnly: (): string => pick([
        `⚔️ *Ara ara~* Yeh sirf group admins ke liye hai. Tumhara rank thoda kam hai~ 😏`,
        `⚔️ *Hmm~* Admin nahi ho tum. Yeh command tumhare liye nahi bani~ 😤`,
        `⚔️ Power unhe milti hai jo layak hote hain. Admins only yeh command~ 👑`,
        `⚔️ *Yare yare~* Pehle admin bano, phir yeh try karna~ 😌`,
    ]),

    // ─── NSFW only ────────────────────────────────────────────────────
    nsfwOnly: (): string => pick([
        `🔞 *Ara ara~* Yeh thoda... mature content hai~ NSFW group mein jao. 😏`,
        `🔞 *Hmm~* Yeh command NSFW enabled groups ke liye hai. Idhar nahi~ 😌`,
        `🔞 Aise cheezein safe groups mein nahi hoti~ NSFW on karo pehle. 😤`,
        `🔞 *Yare yare~* Adult section hai yeh. NSFW group dhundo~ 👑`,
    ]),

    // ─── Casino only ──────────────────────────────────────────────────
    casinoOnly: (prefix: string): string => pick([
        `🎰 *Ara~* Gambling sirf casino group mein hoti hai~ *${prefix}support* se link lo. 😏`,
        `🎰 *Hmm~* Casino group ka ticket chahiye yeh command ke liye~ *${prefix}support* try karo. 😌`,
        `🎰 Rias ki casino sirf khaas jagah hai~ *${prefix}support* se group link lo. 👑`,
        `🎰 *Yare yare~* Yeh command casino group ke liye reserved hai~ *${prefix}support* dekho. 😤`,
    ]),

    // ─── Cooldown ─────────────────────────────────────────────────────
    cooldown: (time: number): string => pick([
        `⏳ *Ara ara~* Itni jaldi? Thoda wait karo — *${time}* second${time > 1 ? 's' : ''} baaki hain~ 😏`,
        `⏳ *Hmm~* Breathe Senpai~ *${time}* second${time > 1 ? 's' : ''} aur ruko. Main kahin nahi ja rahi~ 😌`,
        `⏳ *Yare yare~* Sabr karo thoda. *${time}* second${time > 1 ? 's' : ''} baad dobara try karna~ 🌸`,
        `⏳ Itni jaldi mein ho? *${time}* second${time > 1 ? 's' : ''} ka break lo~ Main wait karungi. 👑`,
        `⏳ *Ara~* Commands ke beech thoda gap chahiye~ *${time}* second${time > 1 ? 's' : ''} ruko Senpai. 😤`,
    ]),

    // ─── Command error ────────────────────────────────────────────────
    error: (): string => pick([
        `😔 *Ara~* Kuch toh galat hua... Meri bhi galtiyan hoti hain kabhi kabhi. Dobara try karo~ 🌸`,
        `😔 *Hmm~* Power of Destruction bhi kaam nahi aaya is baar. Error aa gaya~ 😅`,
        `😔 *Yare yare~* Yeh unexpected tha. Ek baar aur try karo Senpai~ 😌`,
        `😔 Main Rias Gremory hoon — aur main galti maanti hoon. Kuch toh crash hua. Dobara try karo~ 👑`,
        `😔 *Ara ara~* Meri spell kaam nahi ki is baar~ Thoda wait karke dobara try karo. 😅`,
    ]),

    // ─── DM only ──────────────────────────────────────────────────────
    dmOnly: (): string => pick([
        `💌 *Ara~* Yeh command sirf private mein kaam karti hai~ Mujhe DM karo. 😏`,
        `💌 *Hmm~* Akele mujhse baat karo — yeh command DM only hai~ 😌`,
        `💌 *Yare yare~* Group nahi, seedha mujhe message karo~ DM only yeh. 🌸`,
    ]),

    // ─── Welcome (new user first message) ────────────────────────────
    welcome: (username: string): string => pick([
        `🌸 *Ara ara~* Ek naya chehra! Main *Rias Gremory* hoon — Gremory clan ki heir.\n_Mera naam yaad rakhna, *${username}*~_ 😏`,
        `🌸 *Ohh~* Tum naye lagte ho, *${username}*! Darr mat — main darti waalon ko nahi kaatti~ 😌`,
        `🌸 *${username}* ka swagat hai mere peerage mein~ Main *Rias* hoon. Kya chahiye? 👑`,
    ]),

    // ─── Level up ─────────────────────────────────────────────────────
    levelUp: (username: string, level: number): string => pick([
        `🎉 *Ara ara~* *${username}* ne level up kiya! Ab Level *${level}* par ho~ Mujhe garv hai! 🌸`,
        `🎉 *${username}* bada ho gaya~ Level *${level}* reached! Peerage mein teri value badhti ja rahi hai~ 👑`,
        `🎉 *Hmm~* Level *${level}* tak pahunch gaye *${username}*! Aise hi aage badhte raho~ 😌`,
    ]),

    // ─── Pokemon spawned ──────────────────────────────────────────────
    pokemonSpawn: (level: number, prefix: string): string => pick([
        `🧧 *Ara ara~* Ek naya Pokemon appear hua!\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 *Hmm~* Jangli Pokemon dhundh liya~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 *Yare yare~* Ek Pokemon aa gaya!\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),

    // ─── Chatbot fallback (Akino Himejima style) ───────────────────────
    chatFallback: (): string => pick([
        `😌 Samajh nahi paayi... dobara bolo?`,
        `😌 *Fufufu~* Thoda unclear tha wo. Phir se try karo.`,
        `🥀 Hmm, yeh mere samajh se bahar hai filhaal.`,
    ]),

    // ─── Chatbot reply wrapper (Akino Himejima style — group free-chat) ─
    chatReply: (answer: string): string => pick([
        `${answer}`,
        `*Fufufu~* ${answer}`,
        `${answer} 😌`,
        `${answer} 🌙`,
        `Hmm~ ${answer}`,
    ]),

}
