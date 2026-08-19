/**
 * ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ — Random Emoji Reactor
 * Har message par randomly ek emoji reaction bhejo.
 */

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
]

export type ReactMode = 'all' | 'regular' | 'anime'

export const getRandomReactEmoji = (_mode: ReactMode = 'all'): string =>
    REGULAR_EMOJIS[Math.floor(Math.random() * REGULAR_EMOJIS.length)]

export const REACT_EMOJI_COUNTS = {
    regular: REGULAR_EMOJIS.length,
    anime:   0,
    total:   REGULAR_EMOJIS.length
}
