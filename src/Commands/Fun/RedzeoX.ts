import { Command, BaseCommand, Message } from '../../Structures'
import { buildFactCard } from '../../lib'

@Command('fact', {
    description: 'Sends a random fact as a beautiful image card 💡',
    category: 'fun',
    usage: 'fact',
    aliases: ['randomfact', 'rf'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        try {
            const data = await this.client.utils.fetch<{ text: string }>(
                'https://uselessfacts.jsph.pl/api/v2/facts/random'
            )
            if (!data?.text) return void M.reply('❌ Fact nahi mila. Try again!')

            const buffer = await buildFactCard(data.text, this.client.config.persona)
            return void (await M.reply(buffer, 'image'))
        } catch (e) {
            this.client.log(`[Fact] Error: ${(e as Error).message}`, true)
            return void M.reply('❌ Fact fetch nahi hua. Try again later!')
        }
    }
}
