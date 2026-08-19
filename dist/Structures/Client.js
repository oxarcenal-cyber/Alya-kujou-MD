"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
const events_1 = __importDefault(require("events"));
const config_1 = __importDefault(require("../config"));
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const pino_1 = __importDefault(require("pino"));
const mongoose_1 = require("mongoose");
const qr_image_1 = __importDefault(require("qr-image"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const lib_1 = require("../lib");
const _1 = require(".");
class Client extends events_1.default {
    constructor() {
        super();
        this.startTime = Date.now();
        this._dbConnected = false;
        this._baileysVersion = undefined;
        this._reconnecting = false;
        this._keepAliveInterval = null;
        this._startupLogActive = true;
        this._startupStages = new Map();
        this._startKeepAlive = () => {
            if (this._keepAliveInterval)
                clearInterval(this._keepAliveInterval);
            this._keepAliveInterval = setInterval(async () => {
                if (this.condition !== 'connected')
                    return;
                try {
                    await this.sendPresenceUpdate('available');
                }
                catch { }
            }, 20000);
        };
        this.start = async () => {
            if (!config_1.default.MONGO_URI) {
                throw new Error('No MongoDB URI provided — src/config.ts mein MONGO_URI set karo!');
            }
            if (!this._dbConnected) {
                (0, mongoose_1.set)('strictQuery', false);
                await (0, mongoose_1.connect)(config_1.default.MONGO_URI);
                this._dbConnected = true;
                this.log('Connected to the Database');
            }
            const { useDatabaseAuth } = new _1.AuthenticationFromDatabase(this.config.session);
            const { saveState, state, clearState } = await useDatabaseAuth();
            this.clearStateCallback = clearState;
            if (!this._baileysVersion) {
                const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
                this._baileysVersion = version;
            }
            const version = this._baileysVersion;
            this.client = (0, baileys_1.default)({
                version,
                printQRInTerminal: true,
                auth: state,
                logger: (0, pino_1.default)({ level: 'fatal' }),
                browser: baileys_1.Browsers.ubuntu('Chrome'),
                getMessage: async (key) => {
                    return {
                        conversation: ''
                    };
                },
                markOnlineOnConnect: false
            });
            for (const method of Object.keys(this.client)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this[method] = this.client[method];
            }
            // NOTE: No sendMessage wrapper needed — the patched Baileys already handles
            // { buttons: [{text, sections}] } natively via its built-in nativeFlowMessage
            // builder. A manual wrapper would double-convert and cause "Invalid media type".
            this.ws.on('CB:call', (call) => this.emit('new_call', { from: call.content[0].attrs['call-creator'] }));
            this.ev.on('contacts.update', async (contacts) => await this.contact.saveContacts(contacts));
            // ── Promote / Demote: use Baileys' native group-participants.update event ──
            // Detecting promote/demote from messages.upsert fires while the
            // groupParticipantsUpdate IQ response is still being resolved on the same
            // socket, which causes WhatsApp to send <failure reason="500"> (badSession).
            // The native event fires AFTER all IQ processing is complete, avoiding the race.
            this.ev.on('group-participants.update', ({ id, participants, action, author }) => {
                if (action !== 'promote' && action !== 'demote')
                    return;
                const normalizeJid = (p) => {
                    if (typeof p === 'string')
                        return p;
                    if (p && typeof p === 'object') {
                        const obj = p;
                        const jid = obj['id'] ?? obj['jid'];
                        if (typeof jid === 'string')
                            return jid;
                        // phoneNumber fallback
                        const pn = obj['phoneNumber'] ?? obj['pn'];
                        if (typeof pn === 'string')
                            return `${pn}@s.whatsapp.net`;
                    }
                    return String(p);
                };
                this.emit('participants_update', {
                    jid: id,
                    participants: participants.map(normalizeJid),
                    action,
                    author
                });
            });
            this.ev.on('messages.upsert', async ({ messages }) => {
                // In a linked-device setup the primary phone's group messages also arrive as
                // fromMe:true — we must NOT drop those or the owner can never use the bot.
                // Only skip fromMe in DMs (those are the bot's own sent replies).
                const isGroupMsg = messages[0].key?.remoteJid?.endsWith('@g.us');
                if (messages[0].key?.fromMe && !isGroupMsg)
                    return void null;
                const M = new _1.Message(messages[0], this);
                if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage')
                    return void null;
                // Ignore messages received before the bot started (replay on reconnect)
                const msgTs = (messages[0].messageTimestamp ?? 0) * 1000;
                if (msgTs && msgTs < this.startTime)
                    return void null;
                if (M.stubType && M.stubParameters) {
                    const normalizeParticipantJid = (p) => {
                        if (typeof p === 'string')
                            return p;
                        if (p && typeof p === 'object') {
                            const obj = p;
                            const id = obj['id'] ?? obj['jid'] ?? obj;
                            return typeof id === 'string' ? id : String(id);
                        }
                        return String(p);
                    };
                    const emitParticipantsUpdate = (action) => this.emit('participants_update', {
                        jid: M.from,
                        participants: M.stubParameters.map(normalizeParticipantJid),
                        action
                    });
                    switch (M.stubType) {
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_CREATE:
                            return void this.emit('new_group_joined', {
                                jid: M.from,
                                subject: M.stubParameters[0]
                            });
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_ADD:
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_INVITE:
                            return void emitParticipantsUpdate('add');
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_LEAVE:
                        case baileys_1.proto.WebMessageInfo.StubType.GROUP_PARTICIPANT_REMOVE:
                            return void emitParticipantsUpdate('remove');
                        // promote/demote are handled by group-participants.update above
                    }
                }
                return void this.emit('new_message', await M.simplify());
            });
            this.ev.on('connection.update', (update) => {
                if (update.qr) {
                    if (this._pairingPhone) {
                        // Pairing code mode — intercept QR and request code instead
                        const phone = this._pairingPhone;
                        (async () => {
                            try {
                                const code = await this.client.requestPairingCode(phone);
                                this.log(`Pairing code for ${phone}: ${code}`);
                                if (this._pairingCodeResolve) {
                                    this._pairingCodeResolve(code);
                                    this._pairingCodeResolve = null;
                                    this._pairingCodeReject = null;
                                }
                            }
                            catch (e) {
                                this.log(`Pairing code error: ${e.message}`, true);
                                if (this._pairingCodeReject) {
                                    this._pairingCodeReject(e);
                                    this._pairingCodeResolve = null;
                                    this._pairingCodeReject = null;
                                }
                            }
                            finally {
                                this._pairingPhone = null;
                            }
                        })();
                    }
                    else {
                        this.QR = qr_image_1.default.imageSync(update.qr);
                        this.log(`QR code generated — scan with WhatsApp:`);
                        qrcode_terminal_1.default.generate(update.qr, { small: true }, (qrStr) => console.log(qrStr));
                    }
                }
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const reason = Object.keys(baileys_1.DisconnectReason).find((key) => baileys_1.DisconnectReason[key] === statusCode) || statusCode;
                    this.log(`Connection closed — reason: ${reason} (code: ${statusCode})`, true);
                    if (statusCode === baileys_1.DisconnectReason.connectionReplaced) {
                        this.log('Socket replaced by new instance — not reconnecting', true);
                        return;
                    }
                    if (this._reconnecting) {
                        this.log('Reconnect already in progress — skipping', true);
                        return;
                    }
                    this._reconnecting = true;
                    if (statusCode === baileys_1.DisconnectReason.loggedOut) {
                        this.log('Logged out — Deleting session and restarting', true);
                        clearState();
                        this.log('Session deleted');
                    }
                    // badSession (500) = WhatsApp forcing a quick reconnect after admin ops
                    // (session is still valid — reconnect fast to minimise downtime)
                    const reconnectDelay = statusCode === baileys_1.DisconnectReason.badSession ? 1000 : 5000;
                    this.log('Reconnecting...');
                    setTimeout(async () => {
                        this._reconnecting = false;
                        await this.start();
                    }, reconnectDelay);
                }
                if (connection === 'connecting') {
                    this.condition = 'connecting';
                    this.log('Connecting to WhatsApp...');
                }
                if (connection === 'open') {
                    this.condition = 'connected';
                    // Allow a small clock/network skew around reconnect. Baileys can
                    // deliver a freshly sent message with a timestamp just before
                    // the open event; a strict Date.now() cutoff drops that command.
                    // Older replayed messages are still ignored.
                    this.startTime = Date.now() - 10000;
                    this.log('Connected to WhatsApp');
                    this._startKeepAlive();
                    this.emit('open');
                }
            });
            this.ev.on('creds.update', saveState);
            return this.client;
        };
        this.utils = new lib_1.Utils();
        this.DB = new _1.Database();
        this.contact = new _1.Contact(this);
        this.getAllGroups = async () => Object.keys(await this.groupFetchAllParticipating());
        this.correctJid = (jid) => `${jid.split('@')[0].split(':')[0]}@s.whatsapp.net`;
        this.assets = new Map();
        /**
         * Keep the noisy startup sequence in one compact summary. Asset and
         * command loaders can emit hundreds of messages, so showing each one makes
         * the workflow log hard to scan. Errors and normal runtime messages still
         * get their own lines.
         */
        this.log = (text, error = false) => {
            const stage = !error && this.getStartupStage(text);
            if (this._startupLogActive && stage) {
                this._startupStages.set(stage.name, stage.value);
                // Once WhatsApp is connected, leave the completed summary in the
                // log and return to regular one-message-per-line logging.
                if (stage.name === 'whatsapp' && (stage.value === 'connected' || stage.value === 'waiting for QR')) {
                    this.finishStartupStatus();
                }
                return;
            }
            this.finishStartupStatus();
            console.log(chalk_1.default[error ? 'red' : 'blue'](`[${this.config.name.toUpperCase()}]`), chalk_1.default[error ? 'redBright' : 'greenBright'](text));
        };
        // ── Logout / session-clear callback (set during start()) ─────────────────
        this.clearStateCallback = null;
        // ── Pairing code support ──────────────────────────────────────────────────
        this._pairingPhone = null;
        this._pairingCodeResolve = null;
        this._pairingCodeReject = null;
        this.sendButtons = async (jid, body, buttons, options = {}) => {
            await this.sendMessage(jid, {
                text: body,
                footer: options.footer ?? '',
                title: options.header ?? '',
                buttons: buttons.map((b) => b.url
                    ? { text: b.text, url: b.url }
                    : { text: b.text, id: b.id ?? b.text })
            }, { quoted: options.quoted });
        };
        (0, dotenv_1.config)();
        this.config = {
            name: config_1.default.BOT_NAME,
            session: config_1.default.SESSION,
            prefix: config_1.default.PREFIX,
            chatBotUrl: config_1.default.CHAT_BOT_URL,
            casinoGroup: config_1.default.CASINO_GROUP,
            gkey: '',
            adminsGroup: config_1.default.ADMINS_GROUP,
            supportGroups: config_1.default.SUPPORT_GROUPS,
            mods: config_1.default.MODS.map((user) => `${user}@s.whatsapp.net`),
            PORT: config_1.default.PORT,
            persona: 'alya',
            channelLink: config_1.default.CHANNEL_LINK,
            supportLink: config_1.default.SUPPORT_LINK,
            botLink: config_1.default.BOT_LINK,
            videoApiKey: config_1.default.VIDEO_API_KEY
        };
        new _1.Server(this);
    }
    getStartupStage(text) {
        const clean = text.replace(/\x1B\[[0-9;]*m/g, '').trim();
        if (/^Server started on PORT/i.test(clean))
            return { name: 'server', value: 'ready' };
        if (/^Connected to the Database$/i.test(clean))
            return { name: 'database', value: 'ready' };
        if (/^Loading Assets/i.test(clean))
            return { name: 'assets', value: 'loading' };
        if (/^Loaded: .* from /i.test(clean)) {
            return this._startupStages.has('commands')
                ? { name: 'commands', value: 'loading' }
                : { name: 'assets', value: 'loading' };
        }
        if (/^Successfully loaded \d+ assets?$/i.test(clean)) {
            const count = clean.match(/Successfully loaded (\d+ assets?)/i)?.[1] ?? 'assets';
            return { name: 'assets', value: `ready (${count})` };
        }
        if (/^Loading Commands/i.test(clean))
            return { name: 'commands', value: 'loading' };
        if (/^Successfully loaded \d+ (?:commands?|aliases?)/i.test(clean)) {
            const details = clean.replace(/^Successfully loaded /i, '');
            return { name: 'commands', value: `ready (${details})` };
        }
        if (/^Loading Moderators/i.test(clean))
            return { name: 'moderators', value: 'loading' };
        if (/^Successfully loaded \d+ Moderators/i.test(clean)) {
            const count = clean.match(/Successfully loaded (\d+ Moderators)/i)?.[1] ?? 'moderators';
            return { name: 'moderators', value: `ready (${count})` };
        }
        if (/^Connecting to WhatsApp/i.test(clean))
            return { name: 'whatsapp', value: 'connecting' };
        if (/^Reconnecting/i.test(clean))
            return { name: 'whatsapp', value: 'reconnecting' };
        if (/^Connected to WhatsApp/i.test(clean))
            return { name: 'whatsapp', value: 'connected' };
        if (/^QR code generated/i.test(clean))
            return { name: 'whatsapp', value: 'waiting for QR' };
        return null;
    }
    getStartupSummary() {
        const order = ['server', 'database', 'assets', 'commands', 'moderators', 'whatsapp'];
        const labels = {
            server: 'Server',
            database: 'Database',
            assets: 'Assets',
            commands: 'Commands',
            moderators: 'Moderators',
            whatsapp: 'WhatsApp'
        };
        return order
            .filter((name) => this._startupStages.has(name))
            .map((name) => `${labels[name]} ${this._startupStages.get(name)}`)
            .join(chalk_1.default.gray('  ·  '));
    }
    finishStartupStatus() {
        if (!this._startupLogActive)
            return;
        const summary = this.getStartupSummary();
        if (summary) {
            console.log(chalk_1.default.blue(`[${this.config.name.toUpperCase()}]`), chalk_1.default.greenBright(`✓ ${summary}`));
        }
        this._startupLogActive = false;
    }
}
exports.Client = Client;
