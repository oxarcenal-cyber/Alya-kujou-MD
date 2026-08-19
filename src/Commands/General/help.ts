import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { getPersonaName, tOrDefault, getRandomIntroVideo } from '../../lib'
import os from 'os'

const PERSONA_ASSET: Record<string, { name: string; type: 'image' | 'video'; gif?: boolean }> = {
    rias:    { name: 'rias-help',    type: 'image' },
    alya:    { name: 'alya-help',   type: 'video', gif: true },
    akino:   { name: 'akino-help',  type: 'image' },
    hinata:  { name: 'hinata-help', type: 'image' },
    zerotwo: { name: 'zerotwo-help',type: 'image' },
    miku:    { name: 'miku-help',   type: 'image' },
}

const categoryIcons: Record<string, string> = {
    general: '🌐',
    games: '🎮',
    economy: '💰',
    fun: '🎭',
    moderation: '🛡️',
    media: '🎵',
    utils: '🔧',
    weeb: '🌸',
    pokemon: '⚡',
    chara: '🎴',
    characters: '🎴',
    study: '📚',
    nsfw: '🔞',
    dev: '⚙️'
}

const formatUptime = (ms: number): string => {
    const s = Math.floor(ms / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}h ${m}m ${sec}s`
}

const formatRam = (): string => {
    const used = process.memoryUsage().rss / 1024 / 1024 / 1024
    const total = os.totalmem() / 1024 / 1024 / 1024
    return `${used.toFixed(2)} / ${total.toFixed(2)} GB`
}

const getTime = (): string => {
    const now = new Date()
    return now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })
}

@Command('help', {
    description: "Displays the bot's usable commands",
    aliases: ['h', 'menu'],
    cooldown: 10,
    exp: 20,
    usage: 'help || help <command_name>',
    category: 'general',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        if (!context) {
            let commands = Array.from(this.handler.commands, ([, data]) => data)
                .filter((cmd) => cmd.config.category !== 'dev')

            const { nsfw } = M.chat === 'group'
                ? await this.client.DB.getGroup(M.from)
                : { nsfw: false }
            if (!nsfw) commands = commands.filter((cmd) => cmd.config.category !== 'nsfw')

            const introVideo = getRandomIntroVideo()
            const pa = PERSONA_ASSET[this.client.config.persona] ?? PERSONA_ASSET['rias']
            const buffer = (introVideo?.buffer ?? this.client.assets.get(pa.name) ?? this.client.assets.get('chisato')) as Buffer
            const introBuf = introVideo?.buffer ?? null

            const categoryMap = new Map<string, string[]>()
            for (const cmd of commands) {
                const cat = cmd.config.category
                if (!categoryMap.has(cat)) categoryMap.set(cat, [])
                categoryMap.get(cat)!.push(cmd.name)
            }

            const uptime = formatUptime(Date.now() - this.client.startTime)
            const ram = formatRam()
            const time = getTime()
            const username = M.sender.jid.split('@')[0]
            const modsCount = this.client.config.mods.length

            let text = `───  ×-♡ *${this.client.config.name}* ♡🤍❤️\n`
            text += `| 🌸 *RUN*    : ${uptime}\n`
            text += `| ⚙️ *MODE*   : PUBLIC ❤️\n`
            text += `| 👁️ *PREFIX* : ${prefix}\n`
            text += `| 🖥️ *RAM*    : ${ram}\n`
            text += `| 🕐 *TIME*   : ${time}\n`
            text += `| 😊 *USER*   : @${username}\n`
            text += `| 🛡️ *OWNER*  : RedzeoX\n`
            text += `| 👑 *MODS*   : ${modsCount} M\n`
            text += `\n♡ •────── *${getPersonaName(this.client.config.persona)}* 🔱 ──────• ♡\n\n`

            for (const [cat, cmds] of categoryMap) {
                const label = cat.toUpperCase()
                text += `┌───□ *${label}* □\n`
                if (cat === 'nsfw') {
                    // Don't show individual NSFW command names — show a safe reference instead
                    const nsfwMeta = cmds.filter(c => ['nhentai', 'danbooru', 'lewd', 'loli', 'nsfwlist', 'nsfwtoggle', 'nsfwon', 'nsfwoff'].includes(c))
                    for (const cmd of nsfwMeta) {
                        text += `├◇ ${cmd}\n`
                    }
                    text += `├◇ 🔞 Use \`${prefix}nsfwlist\` for all categories\n`
                } else {
                    for (const cmd of cmds) {
                        text += `├◇ ${cmd}\n`
                    }
                }
                text += `└${'─'.repeat(18)}□\n\n`
            }

            text += `💡 *${prefix}help <command>* for details\n`
            text += `🔱 _Powered by RedzeoX_`

            const mediaType = introBuf ? 'video' : pa.type
            const mediaGif = introBuf ? true : pa.gif
            return void await this.client.sendMessage(
                M.from,
                {
                    [mediaType]: buffer,
                    gifPlayback: mediaGif,
                    caption: text,
                    mentions: [M.sender.jid],
                    footer: '⚡ RedzeoX',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: 'Surprise 🫢', id: `${prefix}surprise` }]
                } as any,
                { quoted: M.message }
            )
        }

        const cmd = context.trim().toLowerCase()
        const command = this.handler.commands.get(cmd) || this.handler.aliases.get(cmd)
        if (!command) {
            return void M.reply(
                `❌ *Command not found*\n\n` +
                `No command named *"${context.trim()}"* exists.\n` +
                `Use *${prefix}help* to see all commands.`
            )
        }

        const lang = await this.getLang(M)
        const description = tOrDefault(`cmd_${command.name}_desc`, lang, command.config.description)
        const usageText = tOrDefault(`cmd_${command.name}_usage`, lang, command.config.usage)

        const icon = categoryIcons[command.config.category] ?? '📌'
        const aliases = command.config.aliases?.length
            ? command.config.aliases.map((a) => `\`${a}\``).join('  ')
            : '_none_'
        const usages = usageText
            .split('||')
            .map((u) => `  \`${prefix}${u.trim()}\``)
            .join('\n')

        return void M.reply(
            `*『 ${icon} ${this.client.utils.capitalize(command.name)} 』*\n` +
            `*━━━━━━━━━━━━━━━━━━━━━*\n\n` +
            `📖 *Description*\n${description}\n\n` +
            `*⟦ 🗂️ ᴅᴇᴛᴀɪʟꜱ ⟧*\n` +
            `❱ 🏷️ *Category:* ${this.client.utils.capitalize(command.config.category)}\n` +
            `❱ 🔀 *Aliases:* ${aliases}\n` +
            `❱ ⏱️ *Cooldown:* ${command.config.cooldown ?? 3}s\n\n` +
            `*⟦ 💻 ᴜꜱᴀɢᴇ ⟧*\n` +
            `${usages}\n\n` +
            `*━━━━━━━━━━━━━━━━━━━━━*\n` +
            `🔱 _Powered by RedzeoX_`
        )
    }
}
