import chalk from 'chalk'
import { Client } from '../Structures'

export class CallHandler {
    constructor(private client: Client) {}

    public handleCall = async (call: { from: string }): Promise<void> => {
        const caller = call.from
        const { username } = this.client.contact.getContact(caller)
        this.client.log(`${chalk.cyanBright('Call')} from ${chalk.blueBright(username)}`)

        // Newer WhatsApp accounts can send calls with an internal LID instead
        // of a phone-number JID. Baileys can only block a LID when its
        // LID→phone mapping is already available; otherwise updateBlockStatus
        // throws "Unable to resolve PN JID for LID". A call event must never be
        // allowed to become an unhandled socket-level failure.
        if (caller.endsWith('@lid')) {
            this.client.log(`Call ignored — no phone mapping available for LID ${caller}`, true)
            return
        }

        try {
            await this.client.sendMessage(caller, { text: 'You are now banned' })
        } catch (error) {
            this.client.log(`Call warning — could not send ban notice: ${(error as Error).message}`, true)
        }

        try {
            await this.client.DB.updateBanStatus(caller)
        } catch (error) {
            this.client.log(`Call warning — could not save ban: ${(error as Error).message}`, true)
        }

        try {
            await this.client.updateBlockStatus(caller, 'block')
        } catch (error) {
            this.client.log(`Call warning — could not block caller: ${(error as Error).message}`, true)
        }
    }
}
