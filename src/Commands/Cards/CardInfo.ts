import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { ALL_CARDS, TIER_EMOJI, TIER_NAME } from '../../lib/CardData'
import { t } from '../../lib'

@Command('cardinfo', {
    description: 'View image and info for any card',
    usage: 'cardinfo <card name>',
    category: 'cards',
    aliases: ['acard', 'aboutcard', 'cinfo'],
    cooldown: 5,
    dm: true,
    exp: 0
})
export default class CardInfoCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)

        if (!context.trim()) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*ℹ️ CARD INFO*\n\n` +
                    `*Usage:* \`${prefix}cardinfo <name>\`\n` +
                    `*Example:* \`${prefix}cardinfo Asuna Yuuki\`\n` +
                    `_Filter by tier: \`${prefix}cardinfo Asuna Yuuki-4\`_`,
                footer: 'Tap Open Menu to browse cards.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Quick Links',
                        rows: [
                            { title: '🛒 Card Shop', description: 'Buy card packs', id: `${prefix}cardshop` },
                            { title: '📦 My Deck', description: 'View your deck', id: `${prefix}deck` },
                            { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const input    = context.trim()
        const lastDash = input.lastIndexOf('-')
        let title      = input
        let tierFilter = ''

        if (lastDash > 0) {
            const possibleTier = input.substring(lastDash + 1)
            if (['1', '2', '3', '4', '5', '6', 'S'].includes(possibleTier)) {
                title      = input.substring(0, lastDash)
                tierFilter = possibleTier
            }
        }

        const titleLower = title.toLowerCase()
        let card = tierFilter
            ? ALL_CARDS.find(c => c.title.toLowerCase() === titleLower && c.tier === tierFilter)
            : ALL_CARDS.find(c => c.title.toLowerCase() === titleLower)

        if (!card)
            card = ALL_CARDS.find(c => c.title.toLowerCase().includes(titleLower))

        if (!card) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_not_found_input', lang, { input, p: prefix }),
                footer: 'Try a different card name.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🛒 Card Shop', id: `${prefix}cardshop` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const te      = (TIER_EMOJI as any)[card.tier] ?? '🃏'
        const tn      = (TIER_NAME as any)[card.tier] ?? card.tier
        const caption =
            `${te} *${card.title}*\n` +
            `🏷️ Tier: ${card.tier} — ${tn}\n` +
            `🔗 Type: ${card.url.endsWith('.gif') ? 'Animated GIF ✨' : 'Image'}`

        try {
            if (card.url.toLowerCase().endsWith('.gif')) {
                const gifBuf = await this.client.utils.getBuffer(card.url)
                const mp4Buf = await this.client.utils.gifToMp4(gifBuf)
                return void await this.client.sendMessage(M.from, {
                    video: mp4Buf,
                    caption,
                    gifPlayback: true,
                    mimetype: 'video/mp4'
                } as any)
            } else {
                const buffer = await this.client.utils.getBuffer(card.url)
                return void await M.reply(buffer, 'image', undefined, undefined, caption)
            }
        } catch {
            return void await this.client.sendMessage(M.from, {
                text: caption + `\n\n${t('card_image_failed', lang)}\n🔗 ${card.url}`,
                footer: 'Tap Open Menu to continue.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🛒 Card Shop', id: `${prefix}cardshop` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }
    }
}
