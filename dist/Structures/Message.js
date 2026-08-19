"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const baileys_1 = require("@adiwajshing/baileys");
// ── Group metadata in-memory cache (60s TTL) ─────────────────────────────────
const _groupMetaCache = new Map();
const GROUP_META_TTL = 60000;
// ─────────────────────────────────────────────────────────────────────────────
class Message {
    constructor(M, client) {
        this.M = M;
        this.client = client;
        this.simplify = async () => {
            if (this.chat === 'dm')
                return this;
            // JID format normalize — LID (@lid) vs phone (@s.whatsapp.net) mismatch fix
            // Problem: groupMetadata participant.id can be LID format (e.g. "abc123:5@lid")
            // while sender.jid comes from participantAlt (phone format "9112...@s.whatsapp.net").
            // correctJid("abc123:5@lid") → "abc123@s.whatsapp.net" ≠ "9112...@s.whatsapp.net"
            // Fix: store BOTH normalized and raw IDs in admins list, AND also check raw LID
            // from the original message key.participant against raw admin IDs.
            const normJid = (j) => this.client.correctJid(j);
            // raw LID participant from the message key (before participantAlt fallback)
            const rawMsgParticipant = this.M.key?.participant || '';
            const isAdmin = (admins, jid) => admins.includes(jid) ||
                admins.includes(normJid(jid)) ||
                (rawMsgParticipant !== '' && admins.includes(rawMsgParticipant));
            const cached = _groupMetaCache.get(this.from);
            if (cached && Date.now() < cached.expires) {
                this.groupMetadata = cached.data;
                const admins = cached.data.admins ?? [];
                this.sender.isAdmin = isAdmin(admins, this.sender.jid);
                if (this.quoted)
                    this.quoted.sender.isAdmin = isAdmin(admins, this.quoted.sender.jid);
                return this;
            }
            // Do not let a slow group-metadata request hold the whole message
            // handler after a reconnect. The command can still run with the
            // database-backed group settings; admin metadata will be populated on
            // the next message (or from the cache) once WhatsApp responds.
            const result = await Promise.race([
                this.client.groupMetadata(this.from)
                    .then((res) => res)
                    .catch(() => null),
                new Promise((resolve) => setTimeout(() => resolve(null), 2500))
            ]);
            if (!result)
                return this;
            const adminParticipants = result.participants
                .filter((x) => x.admin !== null && x.admin !== undefined);
            // Store both normalized (@s.whatsapp.net) AND raw (may be @lid) IDs
            // so that any JID format on either side finds a match
            result.admins = [
                ...adminParticipants.map((x) => this.client.correctJid(x.id)),
                ...adminParticipants.map((x) => x.id)
            ];
            this.groupMetadata = result;
            this.sender.isAdmin = isAdmin(result.admins, this.sender.jid);
            if (this.quoted)
                this.quoted.sender.isAdmin = isAdmin(result.admins, this.quoted.sender.jid);
            _groupMetaCache.set(this.from, { data: result, expires: Date.now() + GROUP_META_TTL });
            return this;
        };
        this.reply = async (content, type = 'text', gif, mimetype, caption, mentions, externalAdReply, thumbnail, fileName, options = {}) => {
            if (type === 'text' && Buffer.isBuffer(content))
                throw new Error('Cannot send Buffer as a text message');
            return this.client.sendMessage(this.from, {
                [type]: content,
                gifPlayback: gif,
                caption,
                mimetype,
                mentions,
                fileName,
                jpegThumbnail: thumbnail ? thumbnail.toString('base64') : undefined,
                contextInfo: externalAdReply
                    ? {
                        externalAdReply
                    }
                    : undefined,
                footer: options.sections?.length ? `Bot` : undefined,
                sections: options.sections,
                title: options.title,
                buttonText: options.buttonText
            }, {
                quoted: this.M
            });
        };
        this.react = async (emoji, key = this.M.key) => await this.client.sendMessage(this.from, {
            react: {
                text: emoji,
                key
            }
        });
        this.downloadMediaMessage = async (message) => {
            let type = Object.keys(message)[0];
            let msg = message[type];
            if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
                if (type === 'viewOnceMessageV2') {
                    msg = message.viewOnceMessageV2?.message;
                    type = Object.keys(msg || {})[0];
                }
                else
                    type = Object.keys(msg || {})[1];
                msg = msg[type];
            }
            const stream = await (0, baileys_1.downloadContentFromMessage)(msg, type.replace('Message', ''));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            return buffer;
        };
        this.mentioned = [];
        this.message = this.M;
        this.from = M.key?.remoteJid || '';
        this.chat = this.from.endsWith('@s.whatsapp.net') ? 'dm' : 'group';
        // WhatsApp ke naye "LID" addressing mode mein group participant ki jid
        // asal phone number ki jagah ek internal @lid identifier ho sakti hai.
        // Baileys aisi cases mein `participantAlt` field mein asli phone-number
        // jid bhi bhejta hai — usko prefer karo, warna mods/admins ka JID match
        // hi nahi hoga (mod list mein number hone ke bawjood "sirf mods" error).
        const key = M.key;
        const participantJid = key?.participantAlt || key?.participant || '';
        const { jid, username, isMod } = this.client.contact.getContact(this.chat === 'dm' && this.M.key?.fromMe
            ? this.client.correctJid(this.client.user?.id || '')
            : this.chat === 'group'
                ? this.client.correctJid(participantJid)
                : this.client.correctJid(key?.remoteJidAlt || this.from));
        this.sender = {
            jid,
            username,
            isMod,
            isAdmin: false
        };
        this.type = Object.keys(M.message || {})[0] || 'conversation';
        if (this.M.pushName)
            this.sender.username = this.M.pushName;
        const supportedMediaType = ['videoMessage', 'imageMessage'];
        this.hasSupportedMediaMessage =
            this.type === 'buttonsMessage'
                ? supportedMediaType.includes(Object.keys(M.message?.buttonsMessage || {})[0])
                : supportedMediaType.includes(this.type);
        const getContent = () => {
            if (M.message?.buttonsResponseMessage)
                return M.message?.buttonsResponseMessage?.selectedButtonId || '';
            if (M.message?.listResponseMessage)
                return M.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '';
            if (M.message?.interactiveResponseMessage) {
                const nativeFlow = M.message.interactiveResponseMessage.nativeFlowResponseMessage;
                if (nativeFlow?.paramsJson) {
                    try {
                        const parsed = JSON.parse(nativeFlow.paramsJson);
                        if (parsed.id)
                            return parsed.id;
                        if (parsed.display_text)
                            return parsed.display_text;
                    }
                    catch { }
                }
                return M.message.interactiveResponseMessage.body?.text || '';
            }
            return M.message?.conversation
                ? M.message.conversation
                : this.hasSupportedMediaMessage
                    ? supportedMediaType
                        .map((type) => M.message?.[type]?.caption)
                        .filter((caption) => caption)[0] || ''
                    : M.message?.extendedTextMessage?.text
                        ? M.message?.extendedTextMessage.text
                        : '';
        };
        this.content = getContent();
        this.urls = this.client.utils.extractUrls(this.content);
        // contextInfo ko saare possible message wrappers se dhundho —
        // newer WhatsApp versions mein message type alag ho sakta hai
        // (conversation, extendedTextMessage, imageMessage, videoMessage,
        //  ephemeralMessage, viewOnceMessage, etc.)
        const contextInfo = M.message?.extendedTextMessage?.contextInfo ||
            M.message?.imageMessage?.contextInfo ||
            M.message?.videoMessage?.contextInfo ||
            M.message?.audioMessage?.contextInfo ||
            M.message?.documentMessage?.contextInfo ||
            M.message?.stickerMessage?.contextInfo ||
            (M.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo) ||
            (M.message?.viewOnceMessage?.message?.extendedTextMessage?.contextInfo) ||
            (M.message?.viewOnceMessageV2?.message?.extendedTextMessage?.contextInfo) ||
            null;
        const mentions = (contextInfo?.mentionedJid || []).filter((x) => x !== null && x !== undefined);
        for (const mentioned of mentions)
            this.mentioned.push(mentioned);
        let text = this.content;
        for (const mentioned of this.mentioned)
            text = text.replace(mentioned.split('@')[0], '');
        this.numbers = this.client.utils.extractNumbers(text);
        if (contextInfo?.quotedMessage) {
            const { quotedMessage, participant, stanzaId } = contextInfo || {};
            if (quotedMessage && participant && stanzaId) {
                const Type = Object.keys(quotedMessage)[0];
                const getQuotedContent = () => {
                    if (quotedMessage?.buttonsResponseMessage)
                        return quotedMessage?.buttonsResponseMessage?.selectedDisplayText || '';
                    if (quotedMessage?.listResponseMessage)
                        return quotedMessage?.listResponseMessage?.singleSelectReply?.selectedRowId || '';
                    return quotedMessage?.conversation
                        ? quotedMessage.conversation
                        : supportedMediaType.includes(Type)
                            ? supportedMediaType
                                .map((type) => quotedMessage?.[type]?.caption)
                                .filter((caption) => caption)[0] || ''
                            : quotedMessage?.extendedTextMessage?.text
                                ? quotedMessage?.extendedTextMessage.text
                                : '';
                };
                const { username, jid, isMod } = this.client.contact.getContact(this.client.correctJid(participant));
                this.quoted = {
                    sender: {
                        jid: jid || this.client.correctJid(participant),
                        username: username || 'User',
                        isMod: isMod || this.client.config.mods.includes(this.client.correctJid(participant)),
                        isAdmin: false
                    },
                    content: getQuotedContent(),
                    message: quotedMessage,
                    type: Type,
                    hasSupportedMediaMessage: Type !== 'buttonsMessage'
                        ? supportedMediaType.includes(Type)
                        : supportedMediaType.includes(Object.keys(quotedMessage?.buttonsMessage || {})[1]),
                    key: {
                        remoteJid: this.from,
                        fromMe: this.client.correctJid(participant) === this.client.correctJid(this.client.user?.id || ''),
                        id: stanzaId,
                        participant
                    }
                };
            }
        }
        this.emojis = this.client.utils.extractEmojis(this.content);
    }
    /** Admin list cache manually clear karo (promote/demote ke baad) */
    static clearGroupMetaCache(jid) {
        _groupMetaCache.delete(jid);
    }
    get stubType() {
        return this.M.messageStubType;
    }
    get stubParameters() {
        return this.M.messageStubParameters;
    }
}
exports.Message = Message;
