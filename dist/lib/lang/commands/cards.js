"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardsCmds = void 0;
exports.cardsCmds = {
    en: {
        // auction
        cmd_auction_desc: 'Start, end, or check the status of a card auction 🔨',
        cmd_auction_usage: 'auction start|<deck index>|<price>  /  auction end  /  auction status',
        // bid
        cmd_bid_desc: 'Place a bid on the currently active card auction 💰',
        cmd_bid_usage: 'bid <amount>',
        // buycard
        cmd_buycard_desc: 'Buy a card that is listed for sale in this group 🛒',
        cmd_buycard_usage: 'buycard <shopID>',
        // cancelsale
        cmd_cancelsale_desc: 'Cancel your active card sale listing 🚫',
        cmd_cancelsale_usage: 'cancelsale',
        // cardgive
        cmd_cardgive_desc: 'Give one of your deck cards to another user as a gift 🎁',
        cmd_cardgive_usage: 'cardgive <deck index> @user',
        // cardinfo
        cmd_cardinfo_desc: 'View the image and details of any card by name 🔍',
        cmd_cardinfo_usage: 'cardinfo <card name>  /  cardinfo <card name>-<tier>',
        // card game
        cmd_cardgame_desc: 'Open the card game hub with menus 🃏',
        cmd_cardgame_usage: 'cardgame',
        cmd_cardbattle_desc: 'Battle another player with your real cards ⚔️',
        cmd_cardbattle_usage: 'cardbattle @user [friendly|gold|card|ranked] [amount]',
        // cards
        cmd_cards_desc: 'View all your cards (deck + collection), sorted by tier or name 🃏',
        cmd_cards_usage: 'cards  /  cards --tier  /  cards --name',
        // collect
        cmd_collect_desc: 'Claim a card that has spawned in this group 🎴',
        cmd_collect_usage: 'collect',
        // collection
        cmd_collection_desc: 'View your card collection or see a specific collected card image 🗃️',
        cmd_collection_usage: 'coll  /  coll <index>',
        // deck
        cmd_deck_desc: 'View your deck or see the image of a specific deck card 📦',
        cmd_deck_usage: 'deck  /  deck <index>',
        // salecard
        cmd_salecard_desc: 'Put one of your deck cards up for sale in this group 💎',
        cmd_salecard_usage: 'salecard <deck index>|<price>',
        // swapcard
        cmd_swapcard_desc: 'Swap the positions of two cards in your deck 🔀',
        cmd_swapcard_usage: 'swapcard <index1> <index2>',
        // tocoll
        cmd_tocoll_desc: 'Move a card from your deck into your collection 🗃️',
        cmd_tocoll_usage: 'tocoll <deck index>',
        // todeck
        cmd_todeck_desc: 'Move a card from your collection back into your deck 📦',
        cmd_todeck_usage: 'todeck <collection index>',
    },
    hi: {
        // auction
        cmd_auction_desc: 'Card auction shuru karo, band karo, ya status dekho 🔨',
        cmd_auction_usage: 'auction start|<deck index>|<price>  /  auction end  /  auction status',
        // bid
        cmd_bid_desc: 'Active card auction mein bid lagao 💰',
        cmd_bid_usage: 'bid <amount>',
        // buycard
        cmd_buycard_desc: 'Group mein sale pe rakha card kharido 🛒',
        cmd_buycard_usage: 'buycard <shopID>',
        // cancelsale
        cmd_cancelsale_desc: 'Apni active card sale cancel karo 🚫',
        cmd_cancelsale_usage: 'cancelsale',
        // cardgive
        cmd_cardgive_desc: 'Apna ek deck card kisi doosre user ko gift karo 🎁',
        cmd_cardgive_usage: 'cardgive <deck index> @user',
        // cardinfo
        cmd_cardinfo_desc: 'Kisi bhi card ki image aur details dekho 🔍',
        cmd_cardinfo_usage: 'cardinfo <card name>  /  cardinfo <card name>-<tier>',
        // card game
        cmd_cardgame_desc: 'Menu ke saath card game hub kholo 🃏',
        cmd_cardgame_usage: 'cardgame',
        cmd_cardbattle_desc: 'Apne real cards ke saath kisi player se battle karo ⚔️',
        cmd_cardbattle_usage: 'cardbattle @user [friendly|gold|card|ranked] [amount]',
        // cards
        cmd_cards_desc: 'Apne saare cards dekho (deck + collection), tier ya naam se sort karke 🃏',
        cmd_cards_usage: 'cards  /  cards --tier  /  cards --name',
        // collect
        cmd_collect_desc: 'Group mein spawn hua card claim karo 🎴',
        cmd_collect_usage: 'collect',
        // collection
        cmd_collection_desc: 'Apni card collection dekho ya kisi specific card ki image dekho 🗃️',
        cmd_collection_usage: 'coll  /  coll <index>',
        // deck
        cmd_deck_desc: 'Apna deck dekho ya kisi specific card ki image dekho 📦',
        cmd_deck_usage: 'deck  /  deck <index>',
        // salecard
        cmd_salecard_desc: 'Apna ek deck card is group mein sale pe lagao 💎',
        cmd_salecard_usage: 'salecard <deck index>|<price>',
        // swapcard
        cmd_swapcard_desc: 'Deck ke do cards ki positions swap karo 🔀',
        cmd_swapcard_usage: 'swapcard <index1> <index2>',
        // tocoll
        cmd_tocoll_desc: 'Deck se ek card collection mein bhejo 🗃️',
        cmd_tocoll_usage: 'tocoll <deck index>',
        // todeck
        cmd_todeck_desc: 'Collection se ek card wapas deck mein laao 📦',
        cmd_todeck_usage: 'todeck <collection index>',
    }
};
