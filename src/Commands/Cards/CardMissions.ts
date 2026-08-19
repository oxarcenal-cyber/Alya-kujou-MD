import { BaseCommand, Command, Message } from '../../Structures'
import { normalize } from '../../lib/CardBattleState'

// ─── Mission definitions ───────────────────────────────────────────────────────
interface MissionDef {
    id: string
    label: string
    target: number
    reward: { gold: number; xp: number }
}

export const DAILY_MISSIONS: MissionDef[] = [
    { id: 'play_battles',   label: 'Play 2 card battles',         target: 2, reward: { gold: 300,  xp: 50  } },
    { id: 'win_battles',    label: 'Win 1 card battle',           target: 1, reward: { gold: 600,  xp: 80  } },
    { id: 'use_special',    label: 'Use Special skill 3 times',   target: 3, reward: { gold: 500,  xp: 60  } },
    { id: 'defend_success', label: 'Defend successfully 5 times', target: 5, reward: { gold: 400,  xp: 70  } },
    { id: 'win_ranked',     label: 'Win 1 Ranked battle',         target: 1, reward: { gold: 1000, xp: 120 } },
    { id: 'win_card_mode',  label: 'Win a Card-mode battle',      target: 1, reward: { gold: 800,  xp: 100 } },
    { id: 'win_streak',     label: 'Win 2 battles in a row',      target: 2, reward: { gold: 1200, xp: 150 } },
]

const TODAY = (): string => new Date().toISOString().slice(0, 10)

function pickDailyMissions(): MissionDef[] {
    const seed = TODAY().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const picked: MissionDef[] = []
    const pool = [...DAILY_MISSIONS]
    let s = seed
    while (picked.length < 3 && pool.length > 0) {
        const idx = s % pool.length
        picked.push(pool.splice(idx, 1)[0])
        s = (s * 1103515245 + 12345) & 0x7fffffff
    }
    return picked
}

interface MissionProgress {
    date: string
    missions: { id: string; progress: number; claimed: boolean }[]
}

function getMissions(user: any): MissionProgress {
    const today = TODAY()
    const raw: MissionProgress | undefined = user.cardMissions
    if (!raw || raw.date !== today) {
        return { date: today, missions: pickDailyMissions().map(d => ({ id: d.id, progress: 0, claimed: false })) }
    }
    const defs = pickDailyMissions()
    return {
        date: raw.date,
        missions: defs.map(d => raw.missions.find(m => m.id === d.id) ?? { id: d.id, progress: 0, claimed: false })
    }
}

export async function incrementMission(db: any, jid: string, type: string, amount = 1): Promise<void> {
    try {
        const user = await db.getUser(jid)
        const mp = getMissions(user)
        const m = mp.missions.find(x => x.id === type)
        if (!m || m.claimed) return
        const def = DAILY_MISSIONS.find(d => d.id === type)
        if (!def) return
        m.progress = Math.min(m.progress + amount, def.target)
        await db.updateUser(jid, 'cardMissions', 'set', mp as any)
    } catch { /* silent */ }
}

function progressBar(current: number, max: number): string {
    const len = 8
    const filled = Math.min(len, Math.round((current / max) * len))
    return `[${'█'.repeat(filled)}${'░'.repeat(len - filled)}]`
}

const RANK_TIERS = [
    { label: '🥉 Bronze',   min: 0    },
    { label: '🥈 Silver',   min: 1100 },
    { label: '🥇 Gold',     min: 1300 },
    { label: '💎 Platinum', min: 1500 },
    { label: '💠 Diamond',  min: 1700 },
    { label: '👑 Champion', min: 2000 },
]
function rankTier(rating: number): string {
    let tier = RANK_TIERS[0].label
    for (const t of RANK_TIERS) { if (rating >= t.min) tier = t.label }
    return tier
}

@Command('cardmissions', {
    description: 'View and claim your daily card battle missions',
    usage: 'cardmissions [claim <1|2|3>]',
    category: 'cards',
    aliases: ['cmissions', 'cardgoals'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardMissionsCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: { context: string }): Promise<void> => {
        const prefix = this.client.config.prefix
        const jid = normalize(M.sender.jid)
        const user = await this.client.DB.getUser(jid)
        const mp = getMissions(user)
        const defs = pickDailyMissions()

        // ── claim subcommand ──────────────────────────────────────────────────
        if (context.startsWith('claim')) {
            const idx = parseInt(context.split(/\s+/)[1] ?? '') - 1
            if (isNaN(idx) || idx < 0 || idx >= mp.missions.length)
                return void M.reply(`❌ Use: \`${prefix}cardmissions claim 1\`, \`claim 2\`, or \`claim 3\`.`)
            const mission = mp.missions[idx]
            const def = defs[idx]
            if (!def) return void M.reply(`❌ Mission not found.`)
            if (mission.claimed) return void M.reply(`✅ Already claimed.`)
            if (mission.progress < def.target)
                return void M.reply(`⏳ Not done yet (${mission.progress}/${def.target}). Keep going!`)
            mission.claimed = true
            await this.client.DB.updateUser(jid, 'cardMissions', 'set', mp as any)
            await this.client.DB.setCrystal(jid, def.reward.gold)
            await this.client.DB.setExp(jid, def.reward.xp)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🎉 *MISSION COMPLETE!*\n\n` +
                    `📋 ${def.label}\n` +
                    `Reward: *+${def.reward.gold.toLocaleString()} gold* · *+${def.reward.xp} XP*`,
                footer: 'Keep battling to complete more missions!',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎯 All Missions', id: `${prefix}cardmissions` },
                    { text: '⚔️ Start Battle',  id: `${prefix}cardbattle help` }
                ]
            } as any, { quoted: M.message as any })
        }

        // ── show missions ─────────────────────────────────────────────────────
        const claimableRows: any[] = []
        const lines = defs.map((def, i) => {
            const m = mp.missions[i]
            const done = m.progress >= def.target
            const icon = m.claimed ? '✅' : done ? '🟡' : '⭕'
            const bar = progressBar(m.progress, def.target)
            if (done && !m.claimed) {
                claimableRows.push({
                    title: `🟡 Claim: ${def.label}`,
                    description: `+${def.reward.gold.toLocaleString()} gold · +${def.reward.xp} XP`,
                    id: `${prefix}cardmissions claim ${i + 1}`
                })
            }
            return (
                `${icon} *${i + 1}. ${def.label}*\n` +
                `   ${bar} ${m.progress}/${def.target}\n` +
                `   💰 ${def.reward.gold.toLocaleString()} gold · ✨ ${def.reward.xp} XP`
            )
        })

        const stats = user.cardBattle ?? {}
        const rating = stats.rating ?? 1000

        const text =
            `🎯 *DAILY CARD MISSIONS*\n` +
            `Resets at midnight · ${TODAY()}\n\n` +
            lines.join('\n\n') +
            `\n\n─────────────────\n` +
            `🏅 Rank: ${rankTier(rating)} (${rating} rating)`

        if (claimableRows.length > 0) {
            // Has claimable missions — show claim menu
            return void await this.client.sendMessage(M.from, {
                text,
                footer: 'Tap Open Menu to claim your rewards!',
                title: '🎯 Daily Missions',
                buttons: [{
                    text: '🎁 Claim Rewards',
                    sections: [{ title: 'Ready to Claim', rows: claimableRows }]
                }]
            } as any, { quoted: M.message as any })
        }

        // No claimable missions — show battle shortcut
        return void await this.client.sendMessage(M.from, {
            text,
            footer: 'Complete missions to earn gold & XP.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '⚔️ Start Battle', id: `${prefix}cardbattle help` },
                { text: '📊 My Stats',     id: `${prefix}cardstats` }
            ]
        } as any, { quoted: M.message as any })
    }
}
