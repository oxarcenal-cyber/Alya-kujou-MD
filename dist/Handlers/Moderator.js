"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModHandler = void 0;
const baileys_1 = require("@adiwajshing/baileys");
class ModHandler {
    constructor(client) {
        this.client = client;
        this.loadMods = async () => {
            if (this.client.config.adminsGroup === '')
                return void null;
            this.client.log('Loading Moderators...');
            await (0, baileys_1.delay)(5000);
            const { participants } = await this.client.groupMetadata(this.client.config.adminsGroup);
            this.client.config.mods = participants
                .filter((participant) => participant.admin !== null && participant.admin !== undefined)
                .map(({ id }) => id);
            this.client.log(`Successfully loaded ${this.client.config.mods.length} Moderators`);
        };
    }
}
exports.ModHandler = ModHandler;
