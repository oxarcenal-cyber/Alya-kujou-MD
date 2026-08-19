/**
 * ʜᴀᴛꜱᴜɴᴇ ᴍɪᴋᴜ — Personality & Dialogue System
 * Hatsune Miku — Vocaloid #01, iconic virtual singer.
 * Tone: energetic, cheerful, musical, always positive and enthusiastic.
 */

const pick = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

export const Miku = {

    banned: (): string => pick([
        `🚫 Ara~ This song has come to an end for you — you are banned! 🎵`,
        `🚫 *Miku drops the mic* Off the stage you go — Banned! 🎤`,
        `🚫 Some notes were just wrong... Banned. Concert over~ 🎵`,
        `🚫 Your name has been removed from my setlist — Banned. Bye bye~ 🌟`,
    ]),

    commandNotFound: (): string => pick([
        `❓ Ehhh?! That command is not in my songbook! Check *-help*~ 🎵`,
        `❓ Wrong note! That command does not exist — try *-help*~ 🎤`,
        `❓ Hmm~ I do not know that chord. Type it correctly! Use *-help*~ 🌟`,
        `❓ Off beat! Check *-help* and find the right command~ 🎵`,
    ]),

    commandDisabled: (cmd: string, disabledBy: string, time: string, reason: string): string => pick([
        `🔒 Aww~ *${cmd}* is on pause — *${disabledBy}* disabled it at *${time}*!\n📝 *Reason:* ${reason}`,
        `🔒 *${cmd}*'s concert got cancelled! *${disabledBy}* disabled it at *${time}*~\n📝 *Reason:* ${reason}`,
        `🔒 Intermission time! *${cmd}* is off — *${disabledBy}*'s decision since *${time}*.\n📝 *Reason:* ${reason}`,
    ]),

    modsOnly: (): string => pick([
        `🎵 This backstage pass is MODs only! Sorry~ 🌟`,
        `🎵 MODs only zone! Even I follow rules sometimes~ 🎤`,
        `🎵 VIP access required — and that means being a MOD! 🌟`,
    ]),

    groupOnly: (): string => pick([
        `👥 Come to the concert hall! This command works in groups~ 🎵`,
        `👥 Not alone — head to a group and try again~ 🎤`,
        `👥 This is a group command! DMs cannot play this song~ 🌟`,
    ]),

    adminOnly: (): string => pick([
        `⚔️ You need the admin mic for this command! Become one first~ 🎵`,
        `⚔️ Only admins can drop this beat! Get that role first~ 🎤`,
        `⚔️ Admin access only — this command is not for you yet~ 🌟`,
    ]),

    nsfwOnly: (): string => pick([
        `🔞 Ehhh?! This is an 18+ concert! Head to an NSFW group~ 🎵`,
        `🔞 Wrong venue! You need an NSFW-enabled group for this~ 🎤`,
        `🔞 Mature concert only — find an NSFW group first~ 🌟`,
    ]),

    casinoOnly: (prefix: string): string => pick([
        `🎰 Lucky songs play in the casino group! Use *${prefix}support* for the link~ 🎵`,
        `🎰 Gambling rhythm is in the casino group — try *${prefix}support*~ 🎤`,
        `🎰 Casino group ticket needed — check *${prefix}support*~ 🌟`,
    ]),

    cooldown: (time: number): string => pick([
        `⏳ Wait wait wait~! *${time}* second${time > 1 ? 's' : ''} break — then full volume! 🎵`,
        `⏳ Intermission! *${time}* second${time > 1 ? 's' : ''} — next song is coming~ 🎤`,
        `⏳ *${time}* second${time > 1 ? 's' : ''} more — I am doing a soundcheck! 🌟`,
        `⏳ A little patience~ Back in *${time}* second${time > 1 ? 's' : ''}! 🎵`,
    ]),

    error: (): string => pick([
        `😅 Ehhh?! Technical glitch! Try again please~ 🎵`,
        `😅 Sound system crash! An error happened — once more~ 🎤`,
        `😅 Wrong note played... something broke. Try again please~ 🌟`,
    ]),

    dmOnly: (): string => pick([
        `💌 Private concert! DM me — this command works there~ 🎵`,
        `💌 DMs only for this one — come backstage and message me~ 🎤`,
        `💌 This command sings in DMs! Message me directly~ 🌟`,
    ]),

    welcome: (username: string): string => pick([
        `🌟 Yay~! *${username}* is here! I am *Hatsune Miku* — Vocaloid #01!\n_Welcome to the concert, *${username}*~_ 🎵`,
        `🌟 Oh~! A new audience member — *${username}*! I am *Miku*! Ready for the show? 🎤`,
        `🌟 *${username}*, welcome welcome~! I am *Hatsune Miku*! What do you need? 🎵`,
    ]),

    levelUp: (username: string, level: number): string => pick([
        `🎉 Yeah~! *${username}* reached Level *${level}*! 🎵 Amazing!!`,
        `🎉 Level *${level}*, *${username}*! My next song is dedicated to you~ 🌟`,
        `🎉 *${username}* hit Level *${level}*! Standing ovation~! 🎤`,
    ]),

    pokemonSpawn: (level: number, prefix: string): string => pick([
        `🧧 Kyaa~! A Pokemon appeared! Catch it quick~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 Wild Pokemon!! This is my favourite part~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 Pokemon alert~! Hurry up!\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),

    chatFallback: (): string => pick([
        `🎵 Ehhh~ That note did not land. Say it again?`,
        `🎤 Wrong lyrics! Could you be a little clearer please~`,
        `🌟 Hmm~ That beat did not match. Try once more~`,
    ]),

    chatReply: (answer: string): string => pick([
        `${answer}`,
        `${answer} 🎵`,
        `${answer}~ 🌟`,
        `Miku says: ${answer} 🎤`,
        `La la~ ${answer}`,
    ]),

}
