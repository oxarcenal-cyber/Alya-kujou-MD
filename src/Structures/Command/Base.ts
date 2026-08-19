import { IArgs, ICommand } from '../../Types'
import { Client, Message } from '../'
import { MessageHandler } from '../../Handlers'
import type { Language } from '../../lib/Lang'

export class BaseCommand {
    constructor(public name: string, public config: ICommand['config']) {}

    public execute = async (M: Message, args: IArgs): Promise<void | never> => {
        throw new Error('Command method not implemented')
    }

    public client!: Client

    public handler!: MessageHandler

    /** Get the current language for a group (defaults to 'en' for DMs) */
    public getLang = async (M: Message): Promise<Language> => {
        if (M.chat !== 'group') return 'en'
        try {
            const data = await this.client.DB.getGroup(M.from)
            return (((data as any).language) as Language) || 'en'
        } catch {
            return 'en'
        }
    }
}
