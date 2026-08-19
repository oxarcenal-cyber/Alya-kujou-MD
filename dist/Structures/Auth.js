"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationFromDatabase = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const _1 = require(".");
class AuthenticationFromDatabase {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.useDatabaseAuth = async () => {
            let creds;
            let keys = {};
            const storedCreds = await this.DB.getSession(this.sessionId);
            if (storedCreds !== null && storedCreds.session) {
                const parsedCreds = JSON.parse(storedCreds.session, baileys_1.BufferJSON.reviver);
                creds = parsedCreds.creds;
                keys = parsedCreds.keys;
            }
            else {
                if (!storedCreds)
                    await this.DB.saveNewSession(this.sessionId);
                creds = (0, baileys_1.initAuthCreds)();
            }
            const saveState = async () => {
                const session = JSON.stringify({ creds, keys }, baileys_1.BufferJSON.replacer, 2);
                await this.DB.updateSession(this.sessionId, session);
            };
            const clearState = async () => {
                await this.DB.removeSession(this.sessionId);
            };
            return {
                state: {
                    creds,
                    keys: {
                        get: (type, ids) => {
                            const key = this.KEY_MAP[type];
                            return ids.reduce((dict, id) => {
                                let value = keys[key]?.[id];
                                if (value) {
                                    if (type === 'app-state-sync-key')
                                        value = baileys_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                                    dict[id] = value;
                                }
                                return dict;
                            }, {});
                        },
                        set: (data) => {
                            for (const _key in data) {
                                const key = this.KEY_MAP[_key];
                                keys[key] = keys[key] || {};
                                Object.assign(keys[key], data[_key]);
                            }
                            saveState();
                        }
                    }
                },
                saveState,
                clearState
            };
        };
        this.KEY_MAP = {
            'pre-key': 'preKeys',
            session: 'sessions',
            'sender-key': 'senderKeys',
            'app-state-sync-key': 'appStateSyncKeys',
            'app-state-sync-version': 'appStateVersions',
            'sender-key-memory': 'senderKeyMemory',
            'lid-mapping': 'lidMapping',
            'device-list': 'deviceList',
            tctoken: 'tcToken',
            'identity-key': 'identityKey'
        };
        this.DB = new _1.Database();
    }
}
exports.AuthenticationFromDatabase = AuthenticationFromDatabase;
