"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
class CallHandler {
    constructor(client) {
        this.client = client;
        this.handleCall = async (call) => {
            const caller = call.from;
            const { username } = this.client.contact.getContact(caller);
            this.client.log(`${chalk_1.default.cyanBright('Call')} from ${chalk_1.default.blueBright(username)}`);
            // Newer WhatsApp accounts can send calls with an internal LID instead
            // of a phone-number JID. Baileys can only block a LID when its
            // LID→phone mapping is already available; otherwise updateBlockStatus
            // throws "Unable to resolve PN JID for LID". A call event must never be
            // allowed to become an unhandled socket-level failure.
            if (caller.endsWith('@lid')) {
                this.client.log(`Call ignored — no phone mapping available for LID ${caller}`, true);
                return;
            }
            try {
                await this.client.sendMessage(caller, { text: 'You are now banned' });
            }
            catch (error) {
                this.client.log(`Call warning — could not send ban notice: ${error.message}`, true);
            }
            try {
                await this.client.DB.updateBanStatus(caller);
            }
            catch (error) {
                this.client.log(`Call warning — could not save ban: ${error.message}`, true);
            }
            try {
                await this.client.updateBlockStatus(caller, 'block');
            }
            catch (error) {
                this.client.log(`Call warning — could not block caller: ${error.message}`, true);
            }
        };
    }
}
exports.CallHandler = CallHandler;
