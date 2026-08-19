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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const line = '─'.repeat(28);
            if (M.chat !== 'group' || !M.groupMetadata)
                return void M.reply((0, lib_1.t)('setcasino_group_only', lang));
            const groupJid = M.from;
            const groupName = M.groupMetadata.subject || 'This Group';
            const currentCasino = this.client.config.casinoGroup;
            if (context.trim().toLowerCase() === 'yes') {
                const configPath = path.join(__dirname, '..', '..', '..', 'src', 'config.ts');
                try {
                    let configContent = fs.readFileSync(configPath, 'utf8');
                    configContent = configContent.replace(/CASINO_GROUP:\s*'[^']*'/, `CASINO_GROUP: '${groupJid}'`);
                    fs.writeFileSync(configPath, configContent, 'utf8');
                    this.client.config.casinoGroup = groupJid;
                    return void M.reply((0, lib_1.t)('setcasino_set_success', lang, { groupName, groupJid }));
                }
                catch {
                    return void M.reply((0, lib_1.t)('setcasino_set_runtime', lang, { groupName, groupJid }));
                }
            }
            if (currentCasino === groupJid) {
                return void M.reply((0, lib_1.t)('setcasino_already', lang, { line, groupName, groupJid }));
            }
            return void M.reply((0, lib_1.t)('setcasino_prompt', lang, {
                line,
                groupName,
                groupJid,
                currentCasino: currentCasino || (0, lib_1.t)('setcasino_not_set', lang),
                prefix
            }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('setcasino', {
        description: 'Is group ko casino group set karo 🎰',
        category: 'moderation',
        usage: 'setcasino',
        aliases: ['casinogroup', 'casinojid'],
        exp: 0,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
