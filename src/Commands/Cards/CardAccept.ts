import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { normalize } from '../../lib/CardBattleState'

@Command('cardaccept', {
    description: 'Accept a pending card battle challenge',
    usage: 'cardaccept',
    category: 'cards',
    aliases: ['cbaccept'],
    cooldown: 0, exp: 5, dm: false
})
export default class CardAcceptCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        return void await this.client.sendMessage(M.from, {
            text:
                `✅ *Accept a Challenge?*\n\n` +
                `Tap the button below — or type \`${prefix}cardbattle accept\``,
            footer: 'You must have a pending challenge to accept.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '✅ Accept Challenge', id: `${prefix}cardbattle accept` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
