import { Command, BaseCommand, Message } from '../../Structures'
import { t, langName } from '../../lib'

type CategoryStat = {
    name: string
    emoji: string
    done: number
    total: number
}

const STATS: CategoryStat[] = [
    { name: 'Cards',       emoji: '🃏', done: 14, total: 14 },
    { name: 'Characters',  emoji: '🎭', done: 4,  total: 4  },
    { name: 'Media',       emoji: '🎵', done: 3,  total: 3  },
    { name: 'NSFW',        emoji: '🔞', done: 2,  total: 2  },
    { name: 'Weeb',        emoji: '🎌', done: 6,  total: 6  },
    { name: 'Utils',       emoji: '🔧', done: 6,  total: 16 },
    { name: 'Dev',         emoji: '⚙️', done: 2,  total: 14 },
    { name: 'Fun',         emoji: '🎉', done: 3,  total: 21 },
    { name: 'General',     emoji: '🌐', done: 3,  total: 16 },
    { name: 'Moderation',  emoji: '🛡️', done: 3,  total: 24 },
    { name: 'Economy',     emoji: '💰', done: 0,  total: 19 },
    { name: 'Games',       emoji: '🎮', done: 0,  total: 15 },
    { name: 'Pokemon',     emoji: '🐾', done: 0,  total: 18 },
]

function bar(done: number, total: number): string {
    const pct = Math.round((done / total) * 10)
    const filled = '█'.repeat(pct)
    const empty  = '░'.repeat(10 - pct)
    return `${filled}${empty}`
}

function status(done: number, total: number): string {
    if (done === total) return '✅'
    if (done === 0)     return '❌'
    return '⚠️'
}

@Command('langstats', {
    description: 'Show Hindi translation coverage for every command category',
    category: 'moderation',
    usage: 'langstats',
    aliases: ['coverage', 'langcoverage'],
    exp: 5,
    cooldown: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        const p = this.client.config.prefix

        const totalDone  = STATS.reduce((s, c) => s + c.done, 0)
        const totalCmds  = STATS.reduce((s, c) => s + c.total, 0)
        const totalPct   = Math.round((totalDone / totalCmds) * 100)

        const line = '━'.repeat(28)

        let text = `📊 *HINDI TRANSLATION COVERAGE*\n${line}\n\n`
        text += `🌐 *Current Language:* ${langName(lang)}\n\n`
        text += `📦 *Overall:* ${totalDone}/${totalCmds} commands *(${totalPct}%)*\n`
        text += `${bar(totalDone, totalCmds)} ${totalPct}%\n\n`
        text += `${line}\n\n`

        for (const cat of STATS) {
            const pct  = Math.round((cat.done / cat.total) * 100)
            const icon = status(cat.done, cat.total)
            text += `${icon} ${cat.emoji} *${cat.name}*  ${cat.done}/${cat.total}\n`
            text += `  \`${bar(cat.done, cat.total)}\` ${pct}%\n\n`
        }

        text += `${line}\n`
        text += `✅ = fully done  ⚠️ = partial  ❌ = not started\n\n`
        text += `_Commands without Hindi will still reply in English as fallback._\n`
        text += `\n📢 Switch: \`${p}lang hi\` → Hindi  |  \`${p}lang en\` → English`

        return void M.reply(text)
    }
}
