import { IArgs } from '../../Types'
import { Command, BaseCommand, Message } from '../../Structures'
import { getPersonaName, t } from '../../lib'
import type { TPersona } from '../../lib'

const VALID_PERSONAS: TPersona[] = ['rias', 'alya', 'akino', 'hinata', 'zerotwo', 'miku']

@Command('settheme', {
    description: 'Bot ki poori personality/theme switch karo — Rias, Alya, Akino, Hinata, Zero Two ya Miku',
    aliases: ['persona', 'theme'],
    usage: 'settheme <rias|alya|akino|hinata|zerotwo|miku>',
    cooldown: 5,
    exp: 5,
    category: 'dev'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const choice = context.trim().toLowerCase().split(' ')[0] as TPersona

        if (!choice)
            return void M.reply(
                t('settheme_current', lang, {
                    theme: getPersonaName(this.client.config.persona),
                    prefix: this.client.config.prefix
                })
            )

        if (!VALID_PERSONAS.includes(choice))
            return void M.reply(t('settheme_invalid', lang, { prefix: this.client.config.prefix }))

        const persona = choice as TPersona
        if (this.client.config.persona === persona)
            return void M.reply(t('settheme_already', lang, { theme: getPersonaName(persona) }))

        this.client.config.persona = persona
        this.client.config.name = getPersonaName(persona)

        return void M.reply(t('settheme_switched', lang, { theme: getPersonaName(persona) }))
    }
}
