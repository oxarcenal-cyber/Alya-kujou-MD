import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('studyaimode', {
    description: 'Enable or disable group-wide Study AI (Roxy) mode 🤖',
    category: 'study',
    usage: 'studyaimode',
    aliases: ['groupai', 'saim', 'studyai'],
    cooldown: 5,
    exp: 0,
    dm: false
})
export default class StudyAIModeCommand extends BaseCommand {
    override execute = async (M: Message, _args: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        if (!M.sender.isAdmin && !M.sender.isMod)
            return void M.reply(`❌ *Admin only!*\n\nOnly group admins can change Study AI mode.`)

        const groupData = await this.client.DB.getGroup(M.from).catch(() => null)
        if (!groupData) return void M.reply(`❌ Could not fetch group data.`)

        const currentOn   = (groupData as any).studyAi as boolean || false
        const currentMode = (groupData as any).studyAiMode as string || 'all'

        const statusText =
            !currentOn
                ? `🔴 *Currently:* OFF`
                : currentMode === 'mention'
                ? `🟡 *Currently:* ON — Mention Only`
                : `🟢 *Currently:* ON — All Messages`

        const rows = [
            {
                title:       '🟢 Study AI — ON (All Messages)',
                description: 'Roxy replies to EVERY group message automatically',
                id:          `studyai:all`
            },
            {
                title:       '📣 Study AI — ON (Mention Only)',
                description: 'Roxy replies only when someone @mentions the bot',
                id:          `studyai:mention`
            },
            {
                title:       '🔴 Study AI — OFF',
                description: 'Disable group Study AI completely',
                id:          `studyai:off`
            }
        ]

        return void await this.client.sendMessage(M.from, {
            text:
                `🤖 *STUDY AI MODE — Group Settings*\n` +
                `${'━'.repeat(28)}\n\n` +
                `${statusText}\n\n` +
                `📢 *What is Study AI?*\n` +
                `Roxy — your AI study assistant — can be enabled for this group so members can ask questions naturally, without any prefix!\n\n` +
                `  🟢 *All Messages* — Roxy replies to every message\n` +
                `  📣 *Mention Only* — Roxy replies when @mentioned\n` +
                `  🔴 *OFF* — Disable Study AI\n\n` +
                `${'━'.repeat(28)}\n` +
                `👇 _Select a mode below_ *(Admin only)*`,
            footer: 'Group Study AI Settings',
            buttons: [{
                text: '⚙️ Set Study AI Mode',
                sections: [{ title: '🤖 Study AI Options', rows }]
            }]
        } as any, { quoted: M.message as any })
    }
}
