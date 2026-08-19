"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopItem = exports.SHOP_ITEMS = void 0;
exports.SHOP_ITEMS = [
    {
        key: 'lucky_charm',
        emoji: '🍀',
        name: 'Lucky Charm',
        desc: 'Get 1.5× gold on your next daily claim',
        price: 2000,
        usable: false // auto-applies on next daily
    },
    {
        key: 'pet_treat',
        emoji: '🦴',
        name: 'Pet Treat',
        desc: 'Instantly restore your pet hunger to 100%',
        price: 500,
        usable: true
    },
    {
        key: 'crystal_badge',
        emoji: '💎',
        name: 'Crystal Badge',
        desc: 'A shiny decorative badge for your profile',
        price: 1000,
        usable: false
    },
    {
        key: 'coin_bag',
        emoji: '💰',
        name: 'Coin Bag',
        desc: 'Instantly receive +500 gold bonus',
        price: 1500,
        usable: true
    },
    {
        key: 'xp_scroll',
        emoji: '📜',
        name: 'XP Scroll',
        desc: 'Instantly gain +200 experience points',
        price: 800,
        usable: true
    },
    {
        key: 'mystery_box',
        emoji: '🎁',
        name: 'Mystery Box',
        desc: 'Open for a random reward (100–3000 gold)',
        price: 1200,
        usable: true
    }
];
const getShopItem = (key) => exports.SHOP_ITEMS.find(i => i.key === key);
exports.getShopItem = getShopItem;
