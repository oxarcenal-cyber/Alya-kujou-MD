"use strict";
/**
 * ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ — Random Emoji Reactor
 * Har message par randomly ek emoji reaction bhejo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACT_EMOJI_COUNTS = exports.getRandomReactEmoji = void 0;
const REGULAR_EMOJIS = [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💗', '💓',
    '💞', '💕', '💘', '💝', '💖', '❤️‍🔥', '💫', '⭐', '🌟',
    '✨', '🎉', '🎊', '🎶', '🎵', '🎸', '🎯', '🏆', '🥇', '🌸',
    '🌺', '🌻', '🌹', '🌷', '🌼', '🌙', '☀️', '🌈', '⚡', '🔥',
    '💥', '🌊', '🍀', '🎀', '🎁', '🎈', '🎆', '🎇', '🎮', '🕹️',
    '👾', '🤖', '👻', '🦋', '🐉', '🦄', '🐾', '🍭', '🍬',
    '🍫', '🍰', '🎂', '🧁', '🍩', '🍪', '🧋', '☕',
    '😍', '🥰', '😘', '😎', '🤩', '😊', '🥹', '😂', '🤣', '😭',
    '😤', '🤯', '😱', '🤔', '🧐', '🥺', '😏', '😌', '🫡',
    '👏', '🙌', '🤝', '👍', '✌️', '🤞', '🫶', '💪', '🙏', '🫂',
    '👑', '💎', '🪄', '⚔️', '🛡️', '🏹', '💰', '📿', '🧿', '🪬',
    '🎭', '🃏', '🎲', '🎰', '🧩', '🪅', '🎠', '🎡', '🎢', '🪄',
    '🌃', '🌉', '🌌', '🌠', '🎑', '🗺️', '🏔️', '🌋', '🏝️', '🌅',
];
const getRandomReactEmoji = (_mode = 'all') => REGULAR_EMOJIS[Math.floor(Math.random() * REGULAR_EMOJIS.length)];
exports.getRandomReactEmoji = getRandomReactEmoji;
exports.REACT_EMOJI_COUNTS = {
    regular: REGULAR_EMOJIS.length,
    anime: 0,
    total: REGULAR_EMOJIS.length
};
