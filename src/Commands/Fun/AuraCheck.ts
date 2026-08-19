import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const AURA_TYPES = [
    { name: 'Dark Overlord',   emoji: '🖤', color: 'Black',  desc: 'Pure darkness — sab darte hain tujhse' },
    { name: 'Golden Emperor',  emoji: '👑', color: 'Gold',   desc: 'Supreme power — born to rule' },
    { name: 'Crimson Warrior', emoji: '🔴', color: 'Red',    desc: 'Battle-hardened — unstoppable force' },
    { name: 'Cosmic Entity',   emoji: '🌌', color: 'Cosmic', desc: 'Beyond universe — reality bender' },
    { name: 'Celestial Angel', emoji: '✨', color: 'White',  desc: 'Pure divine light — protector of all' },
    { name: 'Shadow Demon',    emoji: '👾', color: 'Purple', desc: 'Chaos incarnate — unpredictable power' },
    { name: 'Phoenix Reborn',  emoji: '🔥', color: 'Orange', desc: 'Never dies — rises stronger every time' },
    { name: 'Frost Dragon',    emoji: '❄️', color: 'Ice',    desc: 'Cold and calculated — deadly precision' },
    { name: 'Thunder God',     emoji: '⚡', color: 'Yellow', desc: 'Lightning speed — unstoppable charge' },
    { name: 'Nature Spirit',   emoji: '🌿', color: 'Green',  desc: 'Ancient wisdom — at peace with everything' },
    { name: 'Void Walker',     emoji: '🌀', color: 'Void',   desc: 'Exists between dimensions — unknowable' },
    { name: 'Cursed Soul',     emoji: '💀', color: 'Bone',   desc: 'Haunted by fate — power through pain' },
]

const SCAN_FRAMES = [
    `💰 Scanning aura...\n\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ 0%`,
    `💰 Scanning aura...\n\n🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛ 10%`,
    `💰 Analyzing energy...\n\n🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛ 30%`,
    `💰 Detecting patterns...\n\n🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛ 50%`,
    `💰 Calibrating result...\n\n🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛ 70%`,
    `💰 Finalizing...\n\n🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛ 90%`,
    `💰 Complete!\n\n🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100%`,
]

const POWER_TIERS = [
    { min: 0,  max: 20,  tier: 'F',  label: 'Noob 💤'      },
    { min: 21, max: 40,  tier: 'D',  label: 'Average 😐'   },
    { min: 41, max: 60,  tier: 'C',  label: 'Decent 😤'    },
    { min: 61, max: 75,  tier: 'B',  label: 'Strong 💪'    },
    { min: 76, max: 88,  tier: 'A',  label: 'Elite ⚡'     },
    { min: 89, max: 96,  tier: 'S',  label: 'Legendary 🔥' },
    { min: 97, max: 100, tier: 'SS', label: 'GOD TIER 👑'  },
]

function getTier(pct: number) {
    return POWER_TIERS.find(t => pct >= t.min && pct <= t.max) ?? POWER_TIERS[0]
}

@Command('aura', {
    description: 'Apni ya kisi ki aura check karo! 💰',
    category: 'fun',
    usage: 'aura | aura @user',
    aliases: ['auracheck', 'asc'],
    cooldown: 10,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, _args: IArgs): Promise<void> => {
        // Target: mentioned user or self
        const targetJid  = M.mentioned[0]
            ? this.client.correctJid(M.mentioned[0])
            : this.client.correctJid(M.sender.jid)
        const targetName = M.mentioned[0]
            ? (this.client.contact.getContact(targetJid).username || 'Fighter')
            : (M.sender.username || 'You')

        // Deterministic but random per user per day
        const seed   = (targetJid.charCodeAt(0) + new Date().getDate() * 31 + new Date().getMonth() * 17) % 100
        const pct    = ((seed * 7919 + 1234) % 100) + 1
        const aura   = AURA_TYPES[Math.floor(seed * AURA_TYPES.length / 100)]
        const tier   = getTier(pct)

        // Animate scan
        const sent = await this.client.sendMessage(
            M.from,
            { text: `💰 ═══ *AURA SCANNER* ═══ 💰\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n👤 Target: *${targetName}*\n\n${SCAN_FRAMES[0]}` },
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
        if (!sent?.key) return

        const edit = (text: string) => this.client.sendMessage(M.from, { text, edit: sent.key } as any)

        for (let i = 1; i < SCAN_FRAMES.length; i++) {
            await sleep(700)
            await edit(`💰 ═══ *AURA SCANNER* ═══ 💰\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n👤 Target: *${targetName}*\n\n${SCAN_FRAMES[i]}`)
        }

        await sleep(900)
        await edit(
            `💰 ═══ *AURA SCANNER* ═══ 💰\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 *${targetName}*\n\n` +
            `${aura.emoji} *${aura.name}*\n` +
            `🎨 Color: *${aura.color} Aura*\n` +
            `⚡ Power: *${pct}%*\n` +
            `🏅 Tier: *${tier.tier} — ${tier.label}*\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💬 _${aura.desc}_`
        )
    }
}
