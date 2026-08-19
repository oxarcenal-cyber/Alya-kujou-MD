import chalk from 'chalk'
import { config as Config } from 'dotenv'
import EventEmitter from 'events'
import botConfig from '../config'
import TypedEventEmitter from 'typed-emitter'
import Baileys, { Browsers, DisconnectReason, fetchLatestBaileysVersion, AnyMessageContent, ParticipantAction, proto } from '@adiwajshing/baileys'
import P from 'pino'
import { connect, set } from 'mongoose'
import { Boom } from '@hapi/boom'
import qr from 'qr-image'
import qrTerm from 'qrcode-terminal'
import { Utils } from '../lib'
import { Database, Contact, Message, AuthenticationFromDatabase, Server } from '.'
import { Pokemon } from '../Database'
import { IConfig, client, IEvent, ICall } from '../Types'

export class Client extends (EventEmitter as new () => TypedEventEmitter<Events>) {
    private client!: client
    constructor() {
        super()
        Config()
        this.config = {
            name: botConfig.BOT_NAME,
            session: botConfig.SESSION,
            prefix: botConfig.PREFIX,
            chatBotUrl: botConfig.CHAT_BOT_URL,
            casinoGroup: botConfig.CASINO_GROUP,
            gkey: '',
            adminsGroup: botConfig.ADMINS_GROUP,
            supportGroups: botConfig.SUPPORT_GROUPS,
            mods: botConfig.MODS.map((user) => `${user}@s.whatsapp.net`),
            PORT: botConfig.PORT,
            persona: 'alya',
            channelLink: botConfig.CHANNEL_LINK,
            supportLink: botConfig.SUPPORT_LINK,
            botLink: botConfig.BOT_LINK,
            videoApiKey: botConfig.VIDEO_API_KEY
        }
        new Server(this)
    }

    public startTime = Date.now()
    private _dbConnected = false
    private _baileysVersion: [number, number, number] | undefined = undefined
    private _reconnecting = false
    private _keepAliveInterval: ReturnType<typeof setInterval> | null = null
    private _startupLogActive = true
    private _startupStages = new Map<string, string>()

    private _startKeepAlive = (): void => {
        if (this._keepAliveInterval) clearInterval(this._keepAliveInterval)
        this._keepAliveInterval = setInterval(async () => {
            if (this.condition !== 'connected') return
            try {
                await this.sendPresenceUpdate('available')
            } catch {}
        }, 20_000)
    }

    public start = async (): Promise<client> => {
        if (!botConfig.MONGO_URI) {
            throw new Error('No MongoDB URI provided — src/config.ts mein MONGO_URI set karo!')
        }
        if (!this._dbConnected) {
            set('strictQuery', false)
            await connect(botConfig.MONGO_URI)
            this._dbConnected = true
            this.log('Connected to the Database')
        }
        const { useDatabaseAuth } = new AuthenticationFromDatabase(this.config.session)
        const { saveState, state, clearState } = await useDatabaseAuth()
        this.clearStateCallback = clearState
        if (!this._baileysVersion) {
            const { version } = await fetchLatestBaileysVersion()
            this._baileysVersion = version
        }
        const version = this._baileysVersion
        this.client = Baileys({
            version,
            printQRInTerminal: true,
            auth: state,
            logger: P({ level: 'fatal' }),
            browser: Browsers.ubuntu('Chrome'),
            getMessage: async (key) => {
                return {
                    conversation: ''
                }
            },
           
            markOnlineOnConnect: false
        })
        for (const method of Object.keys(this.client)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any)[method] = (this.client as any)[method]
        }

        // NOTE: No sendMessage wrapper needed — the patched Baileys already handles
        // { buttons: [{text, sections}] } natively via its built-in nativeFlowMessage
        // builder. A manual wrapper would double-convert and cause "Invalid media type".

        this.ws.on('CB:call', (call: ICall) => this.emit('new_call', { from: call.content[0].attrs['call-creator'] }))
        this.ev.on('contacts.update', async (contacts) => await this.contact.saveContacts(contacts))
        // ── Promote / Demote: use Baileys' native group-participants.update event ──
        // Detecting promote/demote from messages.upsert fires while the
        // groupParticipantsUpdate IQ response is still being resolved on the same
        // socket, which causes WhatsApp to send <failure reason="500"> (badSession).
        // The native event fires AFTER all IQ processing is complete, avoiding the race.
        this.ev.on('group-participants.update', ({ id, participants, action, author }: {
            id: string
            participants: unknown[]
            action: ParticipantAction
            author?: string
        }) => {
            if (action !== 'promote' && action !== 'demote') return
            const normalizeJid = (p: unknown): string => {
                if (typeof p === 'string') return p
                if (p && typeof p === 'object') {
                    const obj = p as Record<string, unknown>
                    const jid = obj['id'] ?? obj['jid']
                    if (typeof jid === 'string') return jid
                    // phoneNumber fallback
                    const pn = obj['phoneNumber'] ?? obj['pn']
                    if (typeof pn === 'string') return `${pn}@s.whatsapp.net`
                }
                return String(p)
            }
            this.emit('participants_update', {
                jid: id,
                participants: participants.map(normalizeJid),
                action,
                author
            })
        })

        this.ev.on('messages.upsert', async ({ messages }) => {
            // In a linked-device setup the primary phone's group messages also arrive as
            // fromMe:true — we must NOT drop those or the owner can never use the bot.
            // Only skip fromMe in DMs (those are the bot's own sent replies).
            const isGroupMsg = messages[0].key?.remoteJid?.endsWith('@g.us')
            if (messages[0].key?.fromMe && !isGroupMsg) return void null
            const M = new Message(messages[0], this)
            if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage') return void null
            // Ignore messages received before the bot started (replay on reconnect)
            const msgTs = (messages[0].messageTimestamp as number ?? 0) * 1000
            if (msgTs && msgTs < this.startTime) return void null
            if (M.stubType && M.stubParameters) {
                const normalizeParticipantJid = (p: unknown): string => {
                    if (typeof p === 'string') return p
                    if (p && typeof p === 'object') {
                        const obj = p as Record<string, unknown>
                        const id = obj['id'] ?? obj['jid'] ?? obj
                        return typeof id === 'string' ? id : String(id)
                    }
                    return String(p)
                }
                const emitParticipantsUpdate = (action: ParticipantAction): boolean =>
                    this.emit('participants_update', {
                        jid: M.from,
                        participants: (M.stubParameters as unknown[]).map(normalizeParticipantJid),
                        action
                    })
                switch (M.stubType) {
                    case proto.WebMessageInfo.StubType.GROUP_CREATE:
                        return void this.emit('new_group_joined', {
                            jid: M.from,
                            subject: M.stubParameters[0]
                        })
                    case proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_ADD:
                    case proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                    case proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_INVITE:
                        return void emitParticipantsUpdate('add')
                    case proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_LEAVE:
                    case proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_REMOVE:
                        return void emitParticipantsUpdate('remove')
                    // promote/demote are handled by group-participants.update above
                }
            }
            return void this.emit('new_message', await M.simplify())
        })
        this.ev.on('connection.update', (update) => {
            if (update.qr) {
                if (this._pairingPhone) {
                    // Pairing code mode — intercept QR and request code instead
                    const phone = this._pairingPhone
                    ;(async () => {
                        try {
                            const code = await (this.client as any).requestPairingCode(phone)
                            this.log(`Pairing code for ${phone}: ${code}`)
                            if (this._pairingCodeResolve) {
                                this._pairingCodeResolve(code)
                                this._pairingCodeResolve = null
                                this._pairingCodeReject  = null
                            }
                        } catch (e) {
                            this.log(`Pairing code error: ${(e as Error).message}`, true)
                            if (this._pairingCodeReject) {
                                this._pairingCodeReject(e as Error)
                                this._pairingCodeResolve = null
                                this._pairingCodeReject  = null
                            }
                        } finally {
                            this._pairingPhone = null
                        }
                    })()
                } else {
                    this.QR = qr.imageSync(update.qr)
                    this.log(`QR code generated — scan with WhatsApp:`)
                    qrTerm.generate(update.qr, { small: true }, (qrStr: string) => console.log(qrStr))
                }
            }
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
                const reason = Object.keys(DisconnectReason).find(
                    (key) => (DisconnectReason as Record<string, unknown>)[key] === statusCode
                ) || statusCode
                this.log(`Connection closed — reason: ${reason} (code: ${statusCode})`, true)
                if (statusCode === DisconnectReason.connectionReplaced) {
                    this.log('Socket replaced by new instance — not reconnecting', true)
                    return
                }
                if (this._reconnecting) {
                    this.log('Reconnect already in progress — skipping', true)
                    return
                }
                this._reconnecting = true
                if (statusCode === DisconnectReason.loggedOut) {
                    this.log('Logged out — Deleting session and restarting', true)
                    clearState()
                    this.log('Session deleted')
                }
                // badSession (500) = WhatsApp forcing a quick reconnect after admin ops
                // (session is still valid — reconnect fast to minimise downtime)
                const reconnectDelay = statusCode === DisconnectReason.badSession ? 1000 : 5000
                this.log('Reconnecting...')
                setTimeout(async () => {
                    this._reconnecting = false
                    await this.start()
                }, reconnectDelay)
            }
            if (connection === 'connecting') {
                this.condition = 'connecting'
                this.log('Connecting to WhatsApp...')
            }
            if (connection === 'open') {
                this.condition = 'connected'
                // Allow a small clock/network skew around reconnect. Baileys can
                // deliver a freshly sent message with a timestamp just before
                // the open event; a strict Date.now() cutoff drops that command.
                // Older replayed messages are still ignored.
                this.startTime = Date.now() - 10_000
                this.log('Connected to WhatsApp')
                this._startKeepAlive()
                this.emit('open')
            }
        })
        this.ev.on('creds.update', saveState)
        return this.client
    }

    public utils = new Utils()

    public DB = new Database()

    public config: IConfig

    public contact = new Contact(this)
    
    public getAllGroups = async (): Promise<string[]> => Object.keys(await this.groupFetchAllParticipating())

    public correctJid = (jid: string): string => `${jid.split('@')[0].split(':')[0]}@s.whatsapp.net`

    public assets = new Map<string, Buffer>()

    /**
     * Keep the noisy startup sequence in one compact summary. Asset and
     * command loaders can emit hundreds of messages, so showing each one makes
     * the workflow log hard to scan. Errors and normal runtime messages still
     * get their own lines.
     */
    public log = (text: string, error: boolean = false): void => {
        const stage = !error && this.getStartupStage(text)
        if (this._startupLogActive && stage) {
            this._startupStages.set(stage.name, stage.value)

            // Once WhatsApp is connected, leave the completed summary in the
            // log and return to regular one-message-per-line logging.
            if (stage.name === 'whatsapp' && (stage.value === 'connected' || stage.value === 'waiting for QR')) {
                this.finishStartupStatus()
            }
            return
        }

        this.finishStartupStatus()
        console.log(
            chalk[error ? 'red' : 'blue'](`[${this.config.name.toUpperCase()}]`),
            chalk[error ? 'redBright' : 'greenBright'](text)
        )
    }

    public getStartupStage(text: string): { name: string; value: string } | null {
        const clean = text.replace(/\x1B\[[0-9;]*m/g, '').trim()

        if (/^Server started on PORT/i.test(clean)) return { name: 'server', value: 'ready' }
        if (/^Connected to the Database$/i.test(clean)) return { name: 'database', value: 'ready' }
        if (/^Loading Assets/i.test(clean)) return { name: 'assets', value: 'loading' }
        if (/^Loaded: .* from /i.test(clean)) {
            return this._startupStages.has('commands')
                ? { name: 'commands', value: 'loading' }
                : { name: 'assets', value: 'loading' }
        }
        if (/^Successfully loaded \d+ assets?$/i.test(clean)) {
            const count = clean.match(/Successfully loaded (\d+ assets?)/i)?.[1] ?? 'assets'
            return { name: 'assets', value: `ready (${count})` }
        }
        if (/^Loading Commands/i.test(clean)) return { name: 'commands', value: 'loading' }
        if (/^Successfully loaded \d+ (?:commands?|aliases?)/i.test(clean)) {
            const details = clean.replace(/^Successfully loaded /i, '')
            return { name: 'commands', value: `ready (${details})` }
        }
        if (/^Loading Moderators/i.test(clean)) return { name: 'moderators', value: 'loading' }
        if (/^Successfully loaded \d+ Moderators/i.test(clean)) {
            const count = clean.match(/Successfully loaded (\d+ Moderators)/i)?.[1] ?? 'moderators'
            return { name: 'moderators', value: `ready (${count})` }
        }
        if (/^Connecting to WhatsApp/i.test(clean)) return { name: 'whatsapp', value: 'connecting' }
        if (/^Reconnecting/i.test(clean)) return { name: 'whatsapp', value: 'reconnecting' }
        if (/^Connected to WhatsApp/i.test(clean)) return { name: 'whatsapp', value: 'connected' }
        if (/^QR code generated/i.test(clean)) return { name: 'whatsapp', value: 'waiting for QR' }

        return null
    }

    public getStartupSummary(): string {
        const order = ['server', 'database', 'assets', 'commands', 'moderators', 'whatsapp']
        const labels: Record<string, string> = {
            server: 'Server',
            database: 'Database',
            assets: 'Assets',
            commands: 'Commands',
            moderators: 'Moderators',
            whatsapp: 'WhatsApp'
        }
        return order
            .filter((name) => this._startupStages.has(name))
            .map((name) => `${labels[name]} ${this._startupStages.get(name)}`)
            .join(chalk.gray('  ·  '))
    }

    private finishStartupStatus(): void {
        if (!this._startupLogActive) return
        const summary = this.getStartupSummary()
        if (summary) {
            console.log(
                chalk.blue(`[${this.config.name.toUpperCase()}]`),
                chalk.greenBright(`✓ ${summary}`)
            )
        }
        this._startupLogActive = false
    }

    public QR!: Buffer

    // ── Logout / session-clear callback (set during start()) ─────────────────
    public clearStateCallback: (() => Promise<void>) | null = null

    // ── Pairing code support ──────────────────────────────────────────────────
    public _pairingPhone: string | null = null
    public _pairingCodeResolve: ((code: string) => void) | null = null
    public _pairingCodeReject:  ((err: Error)    => void) | null = null

    public condition!: 'connected' | 'connecting' | 'logged_out'

    public end!: client['end']
    public ev!: client['ev']
    public fetchBlocklist!: client['fetchBlocklist']
    public fetchPrivacySettings!: client['fetchPrivacySettings']
    public fetchStatus!: client['fetchStatus']
    public generateMessageTag!: client['generateMessageTag']
    public getBusinessProfile!: client['getBusinessProfile']
    public getCatalog!: client['getCatalog']
    public getCollections!: client['getCollections']
    public getOrderDetails!: client['getOrderDetails']
    public groupAcceptInvite!: client['groupAcceptInvite']
    public groupAcceptInviteV4!: client['groupAcceptInviteV4']
    public groupInviteCode!: client['groupInviteCode']
    public groupLeave!: client['groupLeave']
    public groupMetadata!: client['groupMetadata']
    public groupCreate!: client['groupCreate']
    public groupFetchAllParticipating!: client['groupFetchAllParticipating']
    public groupGetInviteInfo!: client['groupGetInviteInfo']
    public groupRevokeInvite!: client['groupRevokeInvite']
    public groupSettingUpdate!: client['groupSettingUpdate']
    public groupToggleEphemeral!: client['groupToggleEphemeral']
    public groupUpdateDescription!: client['groupUpdateDescription']
    public groupUpdateSubject!: client['groupUpdateSubject']
    public groupParticipantsUpdate!: client['groupParticipantsUpdate']
    public logout!: client['logout']
    public presenceSubscribe!: client['presenceSubscribe']
    public productDelete!: client['productDelete']
    public productCreate!: client['productCreate']
    public productUpdate!: client['productUpdate']
    public profilePictureUrl!: client['profilePictureUrl']
    public updateMediaMessage!: client['updateMediaMessage']
    public query!: client['query']
    public readMessages!: client['readMessages']
    public refreshMediaConn!: client['refreshMediaConn']
    public relayMessage!: client['relayMessage']
    public resyncAppState!: client['resyncAppState']
    
    public sendMessageAck!: client['sendMessageAck']
    public sendNode!: client['sendNode']
    public sendRawMessage!: client['sendRawMessage']
    public sendRetryRequest!: client['sendRetryRequest']
    public sendMessage!: client['sendMessage']
    public sendPresenceUpdate!: client['sendPresenceUpdate']
    public sendReceipt!: client['sendReceipt']
    public type!: client['type']
    public updateBlockStatus!: client['updateBlockStatus']
    public onUnexpectedError!: client['onUnexpectedError']
    public onWhatsApp!: client['onWhatsApp']
    public uploadPreKeys!: client['uploadPreKeys']
    public updateProfilePicture!: client['updateProfilePicture']
    public user!: client['user']
    public ws!: client['ws']
    public waitForMessage!: client['waitForMessage']
    public waitForSocketOpen!: client['waitForSocketOpen']
    public waitForConnectionUpdate!: client['waitForConnectionUpdate']
    public waUploadToServer!: client['waUploadToServer']
    public assertSessions!: client['assertSessions']
    public requestPairingCode!: (phoneNumber: string) => Promise<string>
    public appPatch!: client['appPatch']
    public authState!: client['authState']
    public upsertMessage!: client['upsertMessage']
    public updateProfileStatus!: client['updateProfileStatus']
    public chatModify!: client['chatModify']

    public sendButtons = async (
        jid: string,
        body: string,
        buttons: { id?: string; text: string; url?: string }[],
        options: { footer?: string; header?: string; quoted?: import('@adiwajshing/baileys').WAMessage } = {}
    ): Promise<void> => {
        await this.sendMessage(
            jid,
            {
                text: body,
                footer: options.footer ?? '',
                title: options.header ?? '',
                buttons: buttons.map((b) =>
                    b.url
                        ? { text: b.text, url: b.url }
                        : { text: b.text, id: b.id ?? b.text }
                )
            } as unknown as AnyMessageContent,
            { quoted: options.quoted }
        )
    }

}

type Events = {
    new_call: (call: { from: string }) => void
    new_message: (M: Message) => void
    participants_update: (event: IEvent) => void
    new_group_joined: (group: { jid: string; subject: string }) => void
    open: () => void
    pokemon_levelled_up: (data: {
        M: Message
        pokemon: Pokemon
        inBattle: boolean
        player: 'player1' | 'player2'
        user: string
    }) => void
}
