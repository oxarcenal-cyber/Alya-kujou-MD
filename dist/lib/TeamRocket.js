"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaidProgressBar = exports.getRocketMember = exports.ROCKET_MEMBERS = void 0;
exports.ROCKET_MEMBERS = [
    {
        name: 'Jessie',
        emoji: '💄',
        taunt: '"Prepare for trouble! Hand over that Pokémon, NOW!"',
        retreat: '"How dare you! We\'ll be back, twerps!"'
    },
    {
        name: 'James',
        emoji: '🌹',
        taunt: '"Make it double! Your Pokémon belongs to Team Rocket!"',
        retreat: '"Oh no! The boss is going to be furious with us..."'
    },
    {
        name: 'Giovanni',
        emoji: '😈',
        taunt: '"Surrender your Pokémon. Team Rocket takes what it wants."',
        retreat: '"Hmph. Consider this a warning. Team Rocket never forgets."'
    },
    {
        name: 'Butch & Cassidy',
        emoji: '🕶️',
        taunt: '"Prepare for trouble, and make it double — Cassidy style!"',
        retreat: '"This isn\'t over! We\'ll steal your whole party next time!"'
    }
];
const getRocketMember = () => exports.ROCKET_MEMBERS[Math.floor(Math.random() * exports.ROCKET_MEMBERS.length)];
exports.getRocketMember = getRocketMember;
const getRaidProgressBar = (current, total) => {
    const pct = Math.min(current / total, 1);
    const filled = Math.round(pct * 10);
    const empty = 10 - filled;
    return `[` + '▰'.repeat(filled) + '▱'.repeat(empty) + `] ${Math.round(pct * 100)}%`;
};
exports.getRaidProgressBar = getRaidProgressBar;
