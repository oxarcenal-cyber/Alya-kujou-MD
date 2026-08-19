"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const _1 = require(".");
class Contact {
    constructor(client) {
        this.client = client;
        this.saveContacts = async (contacts) => {
            if (!this.contacts.has('contacts')) {
                const data = await this.DB.getContacts();
                this.contacts.set('contacts', data);
            }
            const data = this.contacts.get('contacts');
            for (const contact of contacts) {
                if (contact.id) {
                    const index = data.findIndex(({ id }) => id === contact.id);
                    if (index >= 0) {
                        if (contact.notify !== data[index].notify)
                            data[index].notify = contact.notify;
                        continue;
                    }
                    data.push({
                        id: contact.id,
                        notify: contact.notify,
                        status: contact.status,
                        imgUrl: contact.imgUrl,
                        name: contact.name,
                        verifiedName: contact.verifiedName
                    });
                }
            }
            this.contacts.set('contacts', data);
            await this.DB.contact.updateOne({ ID: 'contacts' }, { $set: { data } });
        };
        this.getContact = (jid) => {
            const contact = this.contacts.get('contacts');
            const isMod = this.client.config.mods.includes(jid);
            if (!contact)
                return {
                    username: 'User',
                    jid,
                    isMod
                };
            const index = contact.findIndex(({ id }) => id === jid);
            if (index < 0)
                return {
                    username: 'User',
                    jid,
                    isMod
                };
            const { notify, verifiedName, name } = contact[index];
            return {
                username: notify || verifiedName || name || 'User',
                jid,
                isMod
            };
        };
        this.DB = new _1.Database();
        this.contacts = new Map();
    }
}
exports.Contact = Contact;
