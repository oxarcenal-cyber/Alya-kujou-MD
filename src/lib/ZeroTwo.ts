/**
 * ᴢᴇʀᴏ ᴛᴡᴏ — Personality & Dialogue System
 * Zero Two — Darling in the FranXX, mysterious ace pilot of Squad 13.
 * Tone: bold, flirtatious, teasing — calls everyone "Darling", never apologetic.
 */

const pick = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

export const ZeroTwo = {

    banned: (): string => pick([
        `🚫 *Fufufu~* Sorry Darling, you are off my list. Banned — no arguments~ 🌺`,
        `🚫 There is no room for you in Squad 13 anymore — banned, Darling. 💀`,
        `🚫 *Hmm~* I am Zero Two — and my decisions are final. Banned. 🌸`,
        `🚫 *Yare yare~* That was not hard to figure out... Banned. Deal with it, Darling~ 🌺`,
    ]),

    commandNotFound: (): string => pick([
        `❓ *Fufufu~* Hey Darling, that command does not exist. Check *-help*~ 🌺`,
        `❓ That command? Nope, it is not here. Type it correctly, Darling~ 😏`,
        `❓ *Hmm~* Wrong command. Pay a little more attention — try *-help*. 🌸`,
        `❓ Squad 13 does not have that power... check *-help*, Darling. 💀`,
    ]),

    commandDisabled: (cmd: string, disabledBy: string, time: string, reason: string): string => pick([
        `🔒 *Hmm~* *${cmd}* is off limits, Darling — *${disabledBy}* disabled it at *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 *Fufufu~* *${cmd}* will not work right now — *${disabledBy}*'s order since *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 *${cmd}* is disabled. *${disabledBy}* shut it down at *${time}*.\n📝 *Reason:* ${reason}\nBe patient, Darling~ 🌺`,
    ]),

    modsOnly: (): string => pick([
        `🌺 *Fufufu~* This power is for MODs, Darling. Not your level yet~ 😏`,
        `🌺 MODs only, Darling. Even I follow some rules... sometimes. 💀`,
        `🌺 *Hmm~* Restricted zone. MODs only — sorry not sorry~ 🌸`,
    ]),

    groupOnly: (): string => pick([
        `👥 *Fufufu~* What are you doing alone, Darling? Head to a group~ 🌺`,
        `👥 This command is for groups — not DMs. Understood, Darling? 😏`,
        `👥 *Hmm~* You need your squad for this — go to a group. 🌸`,
    ]),

    adminOnly: (): string => pick([
        `⚔️ *Fufufu~* Admins only for this one, Darling. Become one first~ 😏`,
        `⚔️ *Hmm~* You are not an admin — this is not your territory. 💀`,
        `⚔️ Admins only, Darling. Even I follow the chain of command~ 🌺`,
    ]),

    nsfwOnly: (): string => pick([
        `🔞 *Fufufu~* Oh Darling~ This is for NSFW groups only. Head there~ 😏`,
        `🔞 *Hmm~* Mature content... find an NSFW group, Darling. 🌺`,
        `🔞 NSFW-enabled group required — not here, Darling~ 💀`,
    ]),

    casinoOnly: (prefix: string): string => pick([
        `🎰 *Fufufu~* Feeling lucky, Darling? Casino group is where you want — use *${prefix}support*~ 😏`,
        `🎰 Casino group only for this — try *${prefix}support*, Darling. 🌺`,
        `🎰 *Hmm~* You need a casino ticket — check *${prefix}support*. 💀`,
    ]),

    cooldown: (time: number): string => pick([
        `⏳ *Fufufu~* So impatient, Darling? *${time}* second${time > 1 ? 's' : ''} — wait for me~ 😏`,
        `⏳ *Hmm~* Easy there, Darling. *${time}* second${time > 1 ? 's' : ''} more — I am right here. 🌺`,
        `⏳ *Yare yare~* *${time}* second${time > 1 ? 's' : ''} of patience, Darling~ 🌸`,
        `⏳ Even Squad 13 pilots wait sometimes — *${time}* second${time > 1 ? 's' : ''}~ 💀`,
    ]),

    error: (): string => pick([
        `😤 *Hmm~* Something crashed, Darling. Try again~ 🌺`,
        `😤 *Fufufu~* An error? Interesting... Once more, Darling. 😏`,
        `😤 Even FranXX glitches sometimes — try again, Darling. 🌸`,
    ]),

    dmOnly: (): string => pick([
        `💌 *Fufufu~* Want to talk privately, Darling? Send me a DM~ 😏`,
        `💌 *Hmm~* DMs only for this command. Message me directly, Darling. 🌺`,
        `💌 Just the two of us — DMs only, Darling~ 💀`,
    ]),

    welcome: (username: string): string => pick([
        `🌺 *Fufufu~* A new Darling! I am *Zero Two* — ace pilot of Squad 13.\n_Welcome, *${username}*~_ 😏`,
        `🌺 Oh~ *${username}* arrived! I am *Zero Two*. Ready for the ride, Darling? 🌸`,
        `🌺 *Hmm~* *${username}* is new here... I am *Zero Two*. What do you need, Darling? 💀`,
    ]),

    levelUp: (username: string, level: number): string => pick([
        `🎉 *Fufufu~* *${username}* reached Level *${level}*! Proud of you, Darling~ 🌺`,
        `🎉 Level *${level}*, *${username}*! Your value in Squad 13 just went up~ 😏`,
        `🎉 *Hmm~* Level *${level}*! *${username}* never disappoints~ Keep going, Darling! 🌸`,
    ]),

    pokemonSpawn: (level: number, prefix: string): string => pick([
        `🧧 *Fufufu~* A wild Pokemon, Darling! Go catch it~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 *Hmm~* A Pokemon spotted! Quick, Darling~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 Pokemon alert, Darling!\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),

    chatFallback: (): string => pick([
        `🌺 *Hmm~* Did not catch that, Darling. Say it again?`,
        `😏 *Fufufu~* That was unclear. Try again, Darling~`,
        `💀 Beyond me right now. Once more, Darling.`,
    ]),

    chatReply: (answer: string): string => pick([
        `${answer}`,
        `*Fufufu~* ${answer}`,
        `${answer} 🌺`,
        `${answer}, Darling~ 😏`,
        `Hmm~ ${answer}`,
    ]),

}
