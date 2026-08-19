import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('carddecline', {
    description: 'Decline a pending card battle challenge',
    usage: 'carddecline',
    category: 'cards',
    aliases: ['cbdecline'],
    cooldown: 0, exp: 0, dm: false
})
export default class CardDeclineCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        return void await this.client.sendMessage(M.from, {
            text:
                `❌ *Decline a Challenge?*\n\n` +
                `Tap the button below — or type \`${prefix}cardbattle decline\``,
            footer: 'You must have a pending challenge to decline.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '❌ Decline Challenge', id: `${prefix}cardbattle decline` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
