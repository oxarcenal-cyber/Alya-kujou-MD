import { BaseCommand, Command, Message } from '../../Structures'
import { getRandomIntroVideo } from '../../lib'

@Command('repo', {
    description: 'Bot info & source details',
    category: 'general',
    aliases: ['script', 'botinfo', 'source'],
    usage: 'repo',
    cooldown: 10,
    exp: 50
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const { prefix, name } = this.client.config

        const caption =
            `🌸 *${name}* 🌸\n\n` +

            `👑 *Owner:* REDZEOX\n` +
            `🔑 *Prefix:* \`${prefix}\`\n` +
            `💬 *Commands:* 200+\n\n` +

            `🎮 *Games*\n` +
            `▸ 🃏 Blackjack, Poker, Slots\n` +
            `▸ 🎰 Casino & Economy\n` +
            `▸ 🐾 Pokémon Catch & Battle\n` +
            `▸ 🃏 Pokémon TCG Cards\n` +
            `▸ 🧩 Quiz, Wordle & more\n\n` +

            `⚠️ *Private bot — no public repo*\n` +
            `❌ Do not share or redistribute.\n\n` +

            `🎬 *Pro Tip:* _Type just_ \`${prefix}\` _for a surprise intro video!_ 🎥\n\n` +

            `© REDZEOX 2024–2026`

        // Send as ONE message — random intro video + caption (same as prefix-only trigger)
        const introVideo = getRandomIntroVideo()
        if (introVideo) {
            return void (await M.reply(introVideo.buffer, 'video', true, undefined, caption))
        }

        // Fallback: image with caption if video asset missing
        const banner = this.client.assets.get('chisato')
        if (banner) {
            return void (await M.reply(banner, 'image', undefined, undefined, caption))
        }

        // Final fallback: text only
        return void M.reply(caption)
    }
}
