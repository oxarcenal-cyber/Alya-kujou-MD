import chalk from 'chalk'
import { delay } from '@adiwajshing/baileys'
import { Client } from '../Structures'
import { Message as MessageClass } from '../Structures/Message'
import { IEvent } from '../Types'

export class EventHandler {
    constructor(private client: Client) {}

    public handleEvents = async (event: IEvent): Promise<void> => {
        let group: { subject: string; description: string; size: number } = {
            subject: '',
            description: '',
            size: 0
        }
        await delay(1500)
        await this.client
            .groupMetadata(event.jid)
            .then((res) => {
                group.subject = res.subject
                group.description = res.desc || 'No Description'
                group.size = res.participants.length
            })
            .catch(() => {
                group.subject = '__'
                group.description = ''
                group.size = 0
            })

        this.client.log(
            `${chalk.blueBright('EVENT')} ${chalk.green(
                `${this.client.utils.capitalize(event.action)}[${event.participants.length}]`
            )} in ${chalk.cyanBright(group.subject)}`
        )

        const { events, welcome } = await this.client.DB.getGroup(event.jid)

        const botJid = `${(this.client.user?.id || '').split('@')[0].split(':')[0]}@s.whatsapp.net`

        if (event.action === 'add' || event.action === 'remove') {
            if (!welcome) return
            if (event.action === 'remove' && event.participants.includes(botJid)) return

            if (event.action === 'add') {
                const names = event.participants.map((jid) => `@${jid.split('@')[0]}`).join(', ')
                const text =
                    `┌───□ *WELCOME* □\n` +
                    `├◇ 👤 *User:* ${names}\n` +
                    `├◇ 👥 *Group:* ${group.subject}\n` +
                    `├◇ 🔢 *Members:* ${group.size}\n` +
                    `└${'─'.repeat(18)}□\n\n` +
                    `🎉 *Welcome to ${group.subject}!*\n` +
                    `_${group.description}_\n\n` +
                    `❱ Hope you follow the rules and have fun! 🎊\n` +
                    `❱ Use *${this.client.config.prefix}help* to get started.`

                let image: Buffer
                try {
                    const ppUrl = await this.client.profilePictureUrl(event.participants[0], 'image')
                    image = await this.client.utils.getBuffer(ppUrl!)
                } catch {
                    image = this.client.assets.get('chisato') as Buffer
                }

                return void (await this.client.sendMessage(event.jid, {
                    image,
                    caption: text,
                    mentions: event.participants
                }))
            } else {
                const names = event.participants.map((jid) => `@${jid.split('@')[0]}`).join(', ')
                const text =
                    `┌───□ *FAREWELL* □\n` +
                    `├◇ 👤 *User:* ${names}\n` +
                    `├◇ 👥 *Group:* ${group.subject}\n` +
                    `└${'─'.repeat(18)}□\n\n` +
                    `👋 *Goodbye ${names}!*\n` +
                    `_We hope to see you again someday~_ 😢`

                return void (await this.client.sendMessage(event.jid, {
                    text,
                    mentions: event.participants
                }))
            }
        }

        if (event.action === 'promote' || event.action === 'demote') {
            const isPromote  = event.action === 'promote'
            const userJid    = event.participants[0]
            const userMention  = `@${userJid.split('@')[0]}`
            const authorMention = event.author
                ? `@${event.author.split('@')[0]}`
                : '_Unknown_'
            const now = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: 'numeric', month: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', second: '2-digit',
                hour12: true
            })

            // Clear stale admin-list cache immediately so newly promoted/demoted
            // users are recognised on their very next command (no 60s wait).
            MessageClass.clearGroupMetaCache(event.jid)

            // Extra delay so the groupParticipantsUpdate IQ is fully resolved
            // before we make any new socket calls (groupMetadata / sendMessage).
            // Without this, concurrent socket writes can trigger badSession (500).
            await delay(3000)

            // ── Group Notification ────────────────────────────────────────────
            const mentions = [
                ...event.participants,
                ...(event.author ? [event.author] : [])
            ]

            const groupText = isPromote
                ? `*『 GROUP PROMOTION 』*\n\n` +
                  `👥 *Promoted User:*\n• ${userMention}\n\n` +
                  `👑 *Promoted By:* ${authorMention}\n\n` +
                  `🏅 *Group:* ${group.subject}\n` +
                  `📅 *Date:* ${now}\n\n` +
                  `_Congratulations! Use your powers wisely_ ⚡`
                : `*『 GROUP DEMOTION 』*\n\n` +
                  `👥 *Demoted User:*\n• ${userMention}\n\n` +
                  `🔱 *Demoted By:* ${authorMention}\n\n` +
                  `🏅 *Group:* ${group.subject}\n` +
                  `📅 *Date:* ${now}\n\n` +
                  `_Admin role has been removed_ 💀`

            await this.client.sendMessage(event.jid, {
                text: groupText,
                mentions
            })

            // ── Personal DM Notification ──────────────────────────────────────
            try {
                const dmText = isPromote
                    ? `*『 GROUP PROMOTION 』*\n\n` +
                      `🎉 *Congratulations!*\n\n` +
                      `👑 You have been *promoted to Admin* in\n` +
                      `🏅 *${group.subject}*\n\n` +
                      `📅 *Date:* ${now}\n\n` +
                      `_Handle it with responsibility_ ⚡`
                    : `*『 GROUP DEMOTION 』*\n\n` +
                      `😔 *Admin Role Removed*\n\n` +
                      `👤 You are no longer an Admin in\n` +
                      `🏅 *${group.subject}*\n\n` +
                      `📅 *Date:* ${now}\n\n` +
                      `_Keep being awesome though!_ 💪`

                await this.client.sendMessage(userJid, { text: dmText })
            } catch { /* DM might fail if user has privacy settings */ }

            return
        }
    }

    public sendMessageOnJoiningGroup = async (group: { subject: string; jid: string }): Promise<void> => {
        this.client.log(`${chalk.blueBright('JOINED')} ${chalk.cyanBright(group.subject)}`)
        return void (await this.client.sendMessage(group.jid, {
            text: `Thanks for adding me in this group! 🎉\nUse *${this.client.config.prefix}help* to get started.\n\n_Enable welcome messages with_ *${this.client.config.prefix}welcome on*`
        }))
    }
}
