"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndAwardBadges = exports.getBadge = exports.BADGE_LIST = void 0;
exports.BADGE_LIST = [
    { key: 'first_daily', emoji: '🌅', name: 'Early Bird', desc: 'Claimed your first daily reward' },
    { key: 'big_wallet', emoji: '💰', name: 'Wealthy', desc: 'Accumulated 10,000+ gold in your wallet' },
    { key: 'married', emoji: '💍', name: 'Taken', desc: 'Got married to another user' },
    { key: 'birthday_set', emoji: '📅', name: 'Birthday Star', desc: 'Set your birthday' },
    { key: 'pet_owner', emoji: '🐾', name: 'Pet Owner', desc: 'Adopted a virtual pet' },
    { key: 'shopper', emoji: '🛒', name: 'Shopaholic', desc: 'Made your first purchase in the shop' },
    { key: 'level_5', emoji: '⭐', name: 'Rising Star', desc: 'Reached Level 5' },
    { key: 'level_10', emoji: '🌠', name: 'Shooting Star', desc: 'Reached Level 10' },
    { key: 'level_25', emoji: '🏆', name: 'Legend', desc: 'Reached Level 25' },
    { key: 'quiz_master', emoji: '🎯', name: 'Quiz Master', desc: 'Won 10 or more quizzes' },
    { key: 'card_collector', emoji: '🃏', name: 'Card Collector', desc: 'Collected 10 or more anime cards' },
    { key: 'sharpshooter', emoji: '🎮', name: 'Sharpshooter', desc: 'Won 5 or more duels' },
];
const getBadge = (key) => exports.BADGE_LIST.find(b => b.key === key);
exports.getBadge = getBadge;
/**
 * Call after any user update to auto-award milestone badges.
 * Returns array of newly unlocked badge keys.
 */
const checkAndAwardBadges = async (jid, DB) => {
    const user = await DB.getUser(jid);
    const current = user.badges || [];
    const newBadges = [];
    const award = (key) => {
        if (!current.includes(key)) {
            current.push(key);
            newBadges.push(key);
        }
    };
    if ((user.wallet + user.bank) >= 10000)
        award('big_wallet');
    if (user.partner)
        award('married');
    if (user.birthday)
        award('birthday_set');
    if (user.pet?.active)
        award('pet_owner');
    if (user.inventory?.length > 0)
        award('shopper');
    if (user.level >= 5)
        award('level_5');
    if (user.level >= 10)
        award('level_10');
    if (user.level >= 25)
        award('level_25');
    if ((user.quizWins || 0) >= 10)
        award('quiz_master');
    if ((user.cardCollection || []).length >= 10)
        award('card_collector');
    if (newBadges.length > 0) {
        await DB.user.updateOne({ jid }, { $set: { badges: current } });
        DB.cacheInvalidate(`user:${jid}`);
    }
    return newBadges;
};
exports.checkAndAwardBadges = checkAndAwardBadges;
