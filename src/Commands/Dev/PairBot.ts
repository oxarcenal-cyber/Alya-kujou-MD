import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { getRandomIntroVideo } from '../../lib'
import Baileys, { Browsers, DisconnectReason, fetchLatestBaileysVersion } from '@adiwajshing/baileys'
import P from 'pino'
import { AuthenticationFromDatabase, Database } from '../../Structures'
import { Boom } from '@hapi/boom'

/** Temporary session ID used while pairing is in progress. */
const PAIR_SESSION_ID = '__pairbot_temp__'

@Command('pairbot', {
    description: 'Generate a pairing code to link the bot with a new WhatsApp number (Mods only)',
    category: 'dev',
    cooldown: 60,
    usage: 'pairbot [phone with country code]',
    exp: 0
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const phone = context.trim().replace(/[^0-9]/g, '')
        const prefix = this.client.config.prefix
        const { name } = this.client.config

        if (!phone || phone.length < 7) {
            const caption =
                `🔗 *PairBot — Link a New Number*\n\n` +
                `Send your phone number with country code to generate a pairing code.\n\n` +
                `*Usage:*\n` +
                `\`${prefix}pairbot 919XXXXXXXXX\`\n\n` +
                `_Country code required (e.g. 91 for India, 1 for USA)_`
            const v = getRandomIntroVideo()
            return void (v ? await M.reply(v.buffer, 'video', true, undefined, caption) : M.reply(caption))
        }

        const waitCaption =
            `⏳ *Generating Pairing Code...*\n\n` +
            `📱 *Number:* +${phone}\n\n` +
            `_Please wait up to 30 seconds..._`
        const waitV = getRandomIntroVideo()
        waitV ? await M.reply(waitV.buffer, 'video', true, undefined, waitCaption) : await M.reply(waitCaption)

        try {
            const code = await this._getPairingCode(phone, M)
            const raw = String(code).replace(/[^A-Z0-9]/gi, '').toUpperCase()
            const display = raw.length >= 8 ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}` : raw

            const successCaption =
                `🔑 *Pairing Code Ready!*\n\n` +
                `╔═══════════════╗\n` +
                `║   ${display.padEnd(13)}║\n` +
                `╚═══════════════╝\n\n` +
                `📱 *Number:* +${phone}\n` +
                `🤖 *Bot:* ${name}\n\n` +
                `*Steps to link:*\n` +
                `1️⃣ Open WhatsApp on the target phone\n` +
                `2️⃣ Go to *Settings → Linked Devices*\n` +
                `3️⃣ Tap *"Link a Device"*\n` +
                `4️⃣ Tap *"Link with phone number instead"*\n` +
                `5️⃣ Enter the code shown above\n\n` +
                `⏰ _Code expires in ~60 seconds._\n` +
                `_Bot will restart automatically once linked._`

            const v = getRandomIntroVideo()
            return void (v ? await M.reply(v.buffer, 'video', true, undefined, successCaption) : M.reply(successCaption))

        } catch (e: any) {
            try { await new Database().removeSession(PAIR_SESSION_ID) } catch {}
            const errorCaption =
                `❌ *Failed to Generate Pairing Code*\n\n` +
                `Error: ${e?.message || 'Unknown error'}\n\n` +
                `_Try again with the correct phone number._`
            const v = getRandomIntroVideo()
            return void (v ? await M.reply(v.buffer, 'video', true, undefined, errorCaption) : M.reply(errorCaption))
        }
    }

    /**
     * Full pairing flow:
     *
     *  Phase 1 — Get code
     *    • Fresh temp socket with empty creds
     *    • On first QR → call requestPairingCode(phone) → resolve Promise with code
     *    • Socket stays alive (user has 2 min to enter code)
     *
     *  Phase 2 — Post-pair reconnect  (this is what was missing before)
     *    • After user enters code, WA processes it and sends pair-success
     *    • Baileys closes the socket with restartRequired (515) asking for reconnect
     *    • We create a NEW socket using the now-populated temp session creds
     *    • That reconnect reaches connection === 'open' (auth complete)
     *
     *  Phase 3 — Session swap & restart
     *    • Copy temp session JSON → main session in DB (raw document copy)
     *    • Delete temp session
     *    • Notify on the old number, then process.exit(0)
     */
    private _getPairingCode = (phone: string, M: Message): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            let codeSettled = false
            let entryTimeout: ReturnType<typeof setTimeout> | null = null
            const db = new Database()

            // Always start with a clean temp session
            try { await db.removeSession(PAIR_SESSION_ID) } catch {}

            // ── 30-second timeout to receive the initial QR challenge ─────────
            const connectTimeout = setTimeout(() => {
                if (!codeSettled) {
                    codeSettled = true
                    reject(new Error('Timeout — WhatsApp did not respond within 30 seconds'))
                }
            }, 30_000)

            /** Creates one Baileys socket using the current temp session creds.
             *  Call again (with reconnect=true) after pair-success to complete auth. */
            const spawnSocket = async (reconnect = false) => {
                const tempAuth = new AuthenticationFromDatabase(PAIR_SESSION_ID)
                const { saveState, state } = await tempAuth.useDatabaseAuth()
                const { version } = await fetchLatestBaileysVersion()

                const sock = Baileys({
                    version,
                    printQRInTerminal: false,
                    auth: state,
                    logger: P({ level: 'silent' }),
                    browser: Browsers.ubuntu('Chrome'),
                    getMessage: async () => ({ conversation: '' })
                })

                // Save every credential update to the temp session in DB
                sock.ev.on('creds.update', saveState)

                sock.ev.on('connection.update', async (update) => {
                    const { connection, lastDisconnect, qr } = update

                    // ── Phase 1: QR arrived → request pairing code ────────────
                    if (qr && !codeSettled && !reconnect) {
                        try {
                            const code = await (sock as any).requestPairingCode(phone)
                            clearTimeout(connectTimeout)
                            codeSettled = true
                            resolve(code)

                            // Give user 2 minutes to enter the code
                            entryTimeout = setTimeout(() => {
                                try { sock.end?.(new Error('entry timeout')) } catch {}
                            }, 120_000)
                        } catch (e) {
                            clearTimeout(connectTimeout)
                            if (!codeSettled) { codeSettled = true; reject(e) }
                            try { sock.end?.(new Error('requestPairingCode failed')) } catch {}
                        }
                    }

                    // ── Phase 2/3: Connection fully open (post-reconnect) ─────
                    if (connection === 'open') {
                        if (entryTimeout) clearTimeout(entryTimeout)
                        this.client.log(`PairBot: auth complete for +${phone} — saving session...`)

                        // Notify on the old number before swapping session
                        try {
                            await M.reply(
                                `✅ *Device Successfully Paired!*\n\n` +
                                `📱 *New Number:* +${phone}\n\n` +
                                `The bot has been successfully paired with a new WhatsApp number.\n` +
                                `Saving session and restarting now...\n\n` +
                                `_This number will go offline shortly._`
                            )
                        } catch { /* old socket may already be closing */ }

                        try {
                            // Wait for all creds.update flushes
                            await new Promise(r => setTimeout(r, 1500))

                            // Raw DB-level copy: temp session → main session
                            const tempDoc = await db.getSession(PAIR_SESSION_ID)
                            if (tempDoc?.session) {
                                const mainId = this.client.config.session
                                await db.removeSession(mainId)
                                await db.saveNewSession(mainId)
                                await db.updateSession(mainId, tempDoc.session)
                                this.client.log(`PairBot: session saved to '${mainId}' ✓`)
                            } else {
                                this.client.log('PairBot: WARNING — temp session empty after pairing', true)
                            }
                            await db.removeSession(PAIR_SESSION_ID)
                        } catch (err) {
                            this.client.log(`PairBot: session copy error — ${(err as Error).message}`, true)
                        }

                        try { sock.end?.(new Error('pairing complete')) } catch {}
                        setTimeout(() => process.exit(0), 1000)
                    }

                    // ── Connection closed ─────────────────────────────────────
                    if (connection === 'close') {
                        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode

                        // restartRequired (515) = pair-success handshake done, need reconnect
                        if (statusCode === DisconnectReason.restartRequired) {
                            this.client.log('PairBot: pair-success received — reconnecting to complete auth...')
                            if (entryTimeout) { clearTimeout(entryTimeout); entryTimeout = null }
                            // Phase 2: spawn a new socket with the now-populated creds
                            setTimeout(() => spawnSocket(true), 1000)
                            return
                        }

                        // loggedOut or connectionReplaced = unrecoverable
                        if (
                            statusCode === DisconnectReason.loggedOut ||
                            statusCode === DisconnectReason.connectionReplaced
                        ) {
                            if (!codeSettled) { codeSettled = true; reject(new Error(`Disconnected (code ${statusCode})`)) }
                            return
                        }

                        // Any other close before the code was generated = error
                        if (!codeSettled) {
                            clearTimeout(connectTimeout)
                            codeSettled = true
                            reject(new Error('Connection closed before pairing code could be generated'))
                        }
                    }
                })
            }

            await spawnSocket(false)
        })
    }
}
