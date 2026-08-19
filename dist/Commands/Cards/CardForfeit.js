"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const CardBattleState_1 = require("../../lib/CardBattleState");
let CardForfeitCommand = class CardForfeitCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (M.chat !== 'group')
                return void M.reply(`❌ Card battles are only in groups.`);
            const self = (0, CardBattleState_1.normalize)(M.sender.jid);
            const group = M.from;
            const session = CardBattleState_1.sessions.get(group);
            if (session && [session.challengerJid, session.challengedJid].includes(self)) {
                CardBattleState_1.sessions.delete(group);
                CardBattleState_1.activeUsers.delete(session.challengerJid);
                CardBattleState_1.activeUsers.delete(session.challengedJid);
                if (session.stakeReserved && session.mode === 'gold') {
                    await this.client.DB.setCrystal(session.challengerJid, session.amount);
                    await this.client.DB.setCrystal(session.challengedJid, session.amount);
                }
                return void await this.client.sendMessage(M.from, {
                    text: `🏳️ *${M.sender.username || 'Player'}* forfeited the battle.\n_Stakes refunded if any._`,
                    footer: 'Start a new battle anytime.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'What next?',
                                    rows: [
                                        { title: '📊 My Stats', description: 'Check wins, rating & streak', id: `${prefix}cardstats` },
                                        { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                                        { title: '🃏 Card Game Hub', description: 'Back to main menu', id: `${prefix}cardgame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const challenge = CardBattleState_1.pending.get(group);
            if (challenge && challenge.challengerJid === self) {
                CardBattleState_1.pending.delete(group);
                return void await this.client.sendMessage(M.from, {
                    text: `🛑 Challenge cancelled.`,
                    footer: 'You can start a new challenge anytime.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'What next?',
                                    rows: [
                                        { title: '⚔️ New Battle', description: 'Challenge someone', id: `${prefix}cardbattle help` },
                                        { title: '📦 My Deck', description: 'Manage your deck', id: `${prefix}deck` },
                                        { title: '🃏 Card Game Hub', description: 'Back to main menu', id: `${prefix}cardgame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            return void await this.client.sendMessage(M.from, {
                text: `❌ No active battle or challenge found for you.`,
                footer: `Use ${prefix}cardbattle @user to start one.`,
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Quick Links',
                                rows: [
                                    { title: '⚔️ Battle Help', description: 'How to battle', id: `${prefix}cardbattle help` },
                                    { title: '📦 My Deck', description: 'View your deck', id: `${prefix}deck` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardForfeitCommand = __decorate([
    (0, Structures_1.Command)('cardforfeit', {
        description: 'Forfeit or cancel the current card battle',
        usage: 'cardforfeit',
        category: 'cards',
        aliases: ['cforfeit', 'cardcancel'],
        cooldown: 0, exp: 0, dm: false
    })
], CardForfeitCommand);
exports.default = CardForfeitCommand;
