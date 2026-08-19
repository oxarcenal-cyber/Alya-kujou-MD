/**
 * ᴀᴋɪɴᴏ ʜɪᴍᴇᴊɪᴍᴀ — Personality & Dialogue System
 * Akino Himejima — High School DxD, Himejima Clan princess.
 * Tone: calm, composed, noble warrior — subtle "Fufufu~" teasing.
 */

const pick = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

export const Akino = {

    banned: (): string => pick([
        `🚫 *Fufufu~* Even a Himejima princess has her limits. You are banned. 🌸`,
        `🚫 The Himejima Clan does not tolerate this. My decision is final — banned. 🏯`,
        `🚫 *Hmm~* A noble warrior can also be strict when needed. Banned. 😌`,
        `🚫 Discipline runs in Himejima blood. You broke it — you are banned. 🌙`,
        `🚫 *Fufufu~* Forgiveness? The Himejima Clan does not offer second chances. Banned. 🥀`,
    ]),

    commandNotFound: (): string => pick([
        `❓ *Fufufu~* That command is not in my arsenal. Please type it correctly~ 😌`,
        `❓ *Hmm~* Such a command does not exist. Check *-help* please. 🌸`,
        `❓ Even the Himejima heir does not know that command — it simply does not exist. *-help* will guide you~ 🏯`,
        `❓ *Fufufu~* Wrong command. Look carefully — use *-help* for the list. 🌙`,
    ]),

    commandDisabled: (cmd: string, disabledBy: string, time: string, reason: string): string => pick([
        `🔒 *Hmm~* *${cmd}* is unavailable right now — disabled by *${disabledBy}* at *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 *Fufufu~* *${cmd}* has been sealed temporarily. Order of *${disabledBy}*, since *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 This command is sealed for now — *${disabledBy}* disabled it at *${time}*.\n📝 *Reason:* ${reason}`,
    ]),

    modsOnly: (): string => pick([
        `🏯 *Fufufu~* This power is reserved for my chosen warriors — MODs only~ 😌`,
        `🏯 *Hmm~* Your rank is not sufficient yet. This belongs to MODs. 🌸`,
        `🏯 Hierarchy matters in the Himejima Clan — MODs only for this command. 🌙`,
    ]),

    groupOnly: (): string => pick([
        `👥 *Fufufu~* A warrior does not fight alone — head to a group to use this. 😌`,
        `👥 *Hmm~* This command only works in groups, not in DMs~ 🌸`,
        `👥 Join a group first — this command is meant for there. 🏯`,
    ]),

    adminOnly: (): string => pick([
        `⚔️ *Fufufu~* This authority belongs to admins only. Your rank is not there yet~ 😌`,
        `⚔️ *Hmm~* Become an admin first, then come back. This is not for you right now. 🌸`,
        `⚔️ Power is given to those who are worthy — admins only for this. 🏯`,
    ]),

    nsfwOnly: (): string => pick([
        `🔞 *Hmm~* Such things do not happen in the open. Head to an NSFW group~ 😌`,
        `🔞 *Fufufu~* This is... restricted content. Find an NSFW-enabled group. 🌙`,
        `🔞 Mature content requires an NSFW group — not here. 🥀`,
    ]),

    casinoOnly: (prefix: string): string => pick([
        `🎰 *Fufufu~* Gambling belongs in the casino group — use *${prefix}support* for the link~ 😌`,
        `🎰 *Hmm~* This command is reserved for the casino group. Try *${prefix}support*. 🌸`,
        `🎰 You need a casino group ticket — check *${prefix}support*. 🏯`,
    ]),

    cooldown: (time: number): string => pick([
        `⏳ *Fufufu~* Patience is a warrior's greatest strength~ Wait *${time}* second${time > 1 ? 's' : ''}. 😌`,
        `⏳ *Hmm~* In such a hurry? *${time}* second${time > 1 ? 's' : ''} more — I am not going anywhere. 🌸`,
        `⏳ *Fufufu~* Take a breath — *${time}* second${time > 1 ? 's' : ''} remaining. 🌙`,
        `⏳ Please wait~ *${time}* second${time > 1 ? 's' : ''} and try again. 🥀`,
    ]),

    error: (): string => pick([
        `😌 *Fufufu~* Something unexpected happened... Please try again~ 🌸`,
        `😌 *Hmm~* Even the Himejima princess encounters errors. Try once more. 🌙`,
        `😌 An unexpected error. Try again — I am still here~ 🥀`,
    ]),

    dmOnly: (): string => pick([
        `💌 *Fufufu~* This command works privately~ Send me a DM. 😌`,
        `💌 *Hmm~* DMs only for this one — message me directly. 🌸`,
        `💌 Not in a group — come to my DMs. This command lives there. 🌙`,
    ]),

    welcome: (username: string): string => pick([
        `🌸 *Fufufu~* A new face! I am *Akino Himejima* — princess of the Himejima Clan.\n_Welcome, *${username}*~_ 😌`,
        `🌸 *${username}*... so you are new. I am *Akino*. I will be watching over you. 🏯`,
        `🌸 *Hmm~* *${username}* has arrived~ I am *Akino Himejima*. How may I help? 🌙`,
    ]),

    levelUp: (username: string, level: number): string => pick([
        `🎉 *Fufufu~* *${username}* has reached Level *${level}*~ The Himejima Clan is proud! 🌸`,
        `🎉 *${username}* is growing — Level *${level}*! Keep it up~ 😌`,
        `🎉 *Hmm~* Level *${level}*! *${username}*, something is expected of you now~ 🏯`,
    ]),

    pokemonSpawn: (level: number, prefix: string): string => pick([
        `🧧 *Fufufu~* A wild Pokemon has appeared!\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 *Hmm~* A Pokemon is here! Be quick~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 A Pokemon has appeared~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),

    chatFallback: (): string => pick([
        `😌 *Fufufu~* I did not quite catch that... Could you say it again?`,
        `🌸 *Hmm~* That was a little unclear. Please try once more.`,
        `🥀 That is beyond my understanding right now — could you clarify?`,
    ]),

    chatReply: (answer: string): string => pick([
        `${answer}`,
        `*Fufufu~* ${answer}`,
        `${answer} 😌`,
        `${answer} 🌸`,
        `Hmm~ ${answer}`,
    ]),

}
