"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
class BaseCommand {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        this.execute = async (M, args) => {
            throw new Error('Command method not implemented');
        };
        /** Get the current language for a group (defaults to 'en' for DMs) */
        this.getLang = async (M) => {
            if (M.chat !== 'group')
                return 'en';
            try {
                const data = await this.client.DB.getGroup(M.from);
                return (data.language) || 'en';
            }
            catch {
                return 'en';
            }
        };
    }
}
exports.BaseCommand = BaseCommand;
