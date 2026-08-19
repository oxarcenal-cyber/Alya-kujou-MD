"use strict";
/**
 * LANG — Cards category (deck/collection, claim, sale, auction, gifting)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cards = void 0;
exports.cards = {
    en: {
        card_not_available: '🙅 *No card available right now!*\n\n' +
            'Cards spawn every few minutes in groups 🃏',
        card_no_gold: '💸 *Not enough gold!*\n\n' +
            '💰 *Card price:* {price} gold\n' +
            '👛 *Your wallet:* {wallet} gold\n\n' +
            '_Earn more gold first!_ 💎',
        card_empty_deck: '📦 *Your deck is empty!*',
        card_empty_coll: '🗃️ *Your collection is empty!*',
        card_deck_full: '📦 *Your deck is full! (12/12)*\n\n' +
            'Move a card to collection first: `{p}tocoll <num>`',
        card_invalid_idx: '❗ Invalid index. Only {max} cards available.',
        card_not_found_msg: '❗ Card data not found.',
        card_image_failed: '🖼️ _Image failed to load_',
        card_claimed: '˚✧. ୭ৎ 𝒍𝒍.𝑶\'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n' +
            '  🌸✿ᰰ  *{te} {title}*  ✿ᰰ🌸\n' +
            '      𐚁 ✅ 𝑪𝒂𝒓𝒅 𝑪𝒍𝒂𝒊𝒎𝒆𝒅! ✅ 𐚁\n\n' +
            '  ‧₊˚ 🏷️ 𝑻𝒊𝒆𝒓    ·❀·  {tier}\n' +
            '  ‧₊˚ 💰 𝑷𝒂𝒊𝒅    ·❀·  {paid} gold\n' +
            '  ‧₊˚ 📦 𝑺𝒕𝒐𝒓𝒆𝒅  ·❀·  {stored}\n\n' +
            '    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n' +
            '  🍃 ⁺. !deck · !coll .⁺ 🍃\n\n' +
            '  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒍𝒂𝒊𝒎𝒆𝒅 𖥻ִֶָ',
        card_moved_to_deck: '✅ *Card Moved to Deck!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '📦 *Deck:* {deck}/12\n' +
            '🗃️ *Collection:* {coll} cards',
        card_moved_to_coll: '✅ *Card Moved to Collection!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '📦 *Deck:* {deck}/12\n' +
            '🗃️ *Collection:* {coll} cards',
        card_swap_done: '*🔀 Swap Done!*\n\n' +
            '*#{a}:* {ea} {ta} _(T{ra})_\n' +
            '*#{b}:* {eb} {tb} _(T{rb})_\n\n' +
            '_Use `{p}deck` to verify_ ✅',
        card_same_idx: '❗ Same index — nothing to swap! Give two different numbers.',
        card_give_self: '😏 You can\'t give a card to yourself!',
        card_give_protected: '🔒 Cards at positions 10-12 are protected. Swap them first!',
        card_give_success: '*🎁 Card Gift!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '👤 *From:* {from}\n' +
            '🎯 *To:* @{to}\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Happy collecting! 🥰_',
        sale_already_active: '⚠️ *A sale is already active in this group!*\n' +
            '_Wait for it to end or cancel it: `{p}cancelsale`_',
        sale_none: '🏪 No active sale in this group.',
        sale_own: '😏 You can\'t buy your own card!',
        sale_no_gold: '💸 *Not enough gold!*\n' +
            '💰 *Price:* {price}\n' +
            '👛 *Your wallet:* {wallet}',
        sale_stale: '❗ Seller removed the card. Sale cancelled.',
        sale_success: '*✅ Card Purchase Successful!*\n\n' +
            '🃏 *{title}* _(Tier {tier})_\n' +
            '💰 *Paid:* {paid} gold\n' +
            '👤 *Seller:* {seller}\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Congratulations!_ 🎊',
        sale_cancelled: '✅ *Sale Cancelled!*\n\n' +
            '🃏 *{title}* _(Tier {tier})_ is no longer for sale.\n\n' +
            '_Card is still in your deck._',
        sale_cancel_denied: '❗ Only the seller or a group admin can cancel this sale.',
        auction_already_active: '⚠️ *An auction is already running in this group!*\n' +
            '_End it first: `{p}auction end`_',
        auction_none: '🔨 No auction is currently running in this group.',
        auction_own: '😏 You can\'t bid on your own auction!',
        auction_low_bid: '❗ *Your bid must be higher than the current bid!*\n\n' +
            '💰 *Current bid:* {current} gold\n' +
            '_Bid higher!_',
        auction_no_gold: '💸 *Not enough gold!*\n' +
            '👛 *Your wallet:* {wallet}\n' +
            '💰 *Your bid:* {bid}',
        auction_ended_no_bid: '🔨 *Auction Ended!*\n\nNo one placed a bid. Card returned to seller.',
        auction_ended: '*🏆 AUCTION ENDED! 🏆*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '🥇 *Winner:* @{winner}\n' +
            '💰 *Final Bid:* {bid} gold\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Congratulations to the winner!_ 🎊',
        auction_no_permission: '❗ Only the seller or an admin can end this auction.',
        auction_seller_gone: '❗ Seller\'s card not found. Auction cancelled.',
        auction_bid_placed: '*💰 New Bid Placed!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '🥇 *New Highest:* {bidder}\n' +
            '💰 *Bid:* {amount} gold\n' +
            '{outbid}' +
            '_Use `{p}bid <amount>` to bid higher!_',
        auction_outbid: '\n_Previous bidder @{prev} was outbid!_\n',
        // inline ternary strings migrated to t()
        card_valid_deck_idx: '❗ Provide a valid deck index.',
        card_valid_start_price: '❗ Provide a valid starting price.',
        card_valid_idx_nums: '❗ Please provide valid index numbers.',
        card_valid_card_idx: '❗ Provide a valid card index. Check with `{p}deck`.',
        card_not_found_input: '❗ *Card not found:* "{input}"\n\n_Check the name spelling. Tier filter: `{p}cardinfo Asuna Yuuki-4`_',
        card_wrong_shop_id: '❗ Wrong Shop ID. Check the active sale listing.',
        card_sale_fmt: '❗ Format: `{p}salecard <index>|<price>` (e.g. `{p}salecard 3|50000`)',
        card_sale_valid_idx: '❗ Provide a valid deck index.',
        card_sale_valid_price: '❗ Provide a valid price (greater than 0).',
        card_no_cards_yet: '🃏 *You have no cards yet!*\n\n' +
            'Cards spawn in groups every few minutes.\n' +
            '_Use `{p}collect` to claim one!_ 🎴',
        card_empty_deck_hint: '📦 *Your deck is empty!*\n\n' +
            'Cards spawn in groups — use `{p}collect` to claim! 🃏',
        card_empty_coll_hint: '🗃️ *Your collection is empty!*\n\n' +
            'Cards go here when your deck is full.\n' +
            'Or use `{p}tocoll <num>` to move from deck. 🃏',
        auction_status_no_bids: 'None yet',
        bid_exceed_hint: '_Your bid must exceed the current highest bid_',
    },
    hi: {
        card_not_available: '🙅 *Abhi koi card available nahi hai!*\n\n' +
            'Cards har kuch minute mein groups mein spawn hote hain 🃏',
        card_no_gold: '💸 *Gold kam hain!*\n\n' +
            '💰 *Card price:* {price} gold\n' +
            '👛 *Tera wallet:* {wallet} gold\n\n' +
            '_Aur gold kamao pehle!_ 💎',
        card_empty_deck: '📦 *Tera deck khaali hai!*',
        card_empty_coll: '🗃️ *Teri collection khaali hai!*',
        card_deck_full: '📦 *Tera deck full hai! (12/12)*\n\n' +
            'Pehle koi card collection mein bhejo: `{p}tocoll <num>`',
        card_invalid_idx: '❗ Invalid index. Sirf {max} cards available hain.',
        card_not_found_msg: '❗ Card data nahi mila.',
        card_image_failed: '🖼️ _Image load nahi hua_',
        card_claimed: '˚✧. ୭ৎ 𝒍𝒍.𝑶\'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n' +
            '  🌸✿ᰰ  *{te} {title}*  ✿ᰰ🌸\n' +
            '      𐚁 ✅ 𝑪𝒂𝒓𝒅 𝑪𝒍𝒂𝒊𝒎𝒆𝒅! ✅ 𐚁\n\n' +
            '  ‧₊˚ 🏷️ 𝑻𝒊𝒆𝒓    ·❀·  {tier}\n' +
            '  ‧₊˚ 💰 𝑷𝒂𝒊𝒅    ·❀·  {paid} gold\n' +
            '  ‧₊˚ 📦 𝑺𝒕𝒐𝒓𝒆𝒅  ·❀·  {stored}\n\n' +
            '    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n' +
            '  🍃 ⁺. !deck · !coll .⁺ 🍃\n\n' +
            '  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒍𝒂𝒊𝒎𝒆𝒅 𖥻ִֶָ',
        card_moved_to_deck: '✅ *Card Deck Mein Aa Gaya!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '📦 *Deck:* {deck}/12\n' +
            '🗃️ *Collection:* {coll} cards',
        card_moved_to_coll: '✅ *Card Collection Mein Chala Gaya!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '📦 *Deck:* {deck}/12\n' +
            '🗃️ *Collection:* {coll} cards',
        card_swap_done: '*🔀 Swap Ho Gaya!*\n\n' +
            '*#{a}:* {ea} {ta} _(T{ra})_\n' +
            '*#{b}:* {eb} {tb} _(T{rb})_\n\n' +
            '_`{p}deck` se verify karo_ ✅',
        card_same_idx: '❗ Same index — koi fayda nahi! Alag numbers do.',
        card_give_self: '😏 Khud ko card nahi de sakte!',
        card_give_protected: '🔒 Position 10-12 ke cards protected hain. Pehle swap karo!',
        card_give_success: '*🎁 Card Gift!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '👤 *From:* {from}\n' +
            '🎯 *To:* @{to}\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Maza karo dono! 🥰_',
        sale_already_active: '⚠️ *Is group mein pehle se ek sale chal rahi hai!*\n' +
            '_Pehle wali khatam hone do ya cancel karo: `{p}cancelsale`_',
        sale_none: '🏪 Is group mein koi active sale nahi hai.',
        sale_own: '😏 Apna card khud nahi kharid sakte!',
        sale_no_gold: '💸 *Gold kam hain!*\n' +
            '💰 *Price:* {price}\n' +
            '👛 *Tera wallet:* {wallet}',
        sale_stale: '❗ Seller ne card hataa diya. Sale cancel ho gayi.',
        sale_success: '*✅ Card Purchase Successful!*\n\n' +
            '🃏 *{title}* _(Tier {tier})_\n' +
            '💰 *Paid:* {paid} gold\n' +
            '👤 *Seller:* {seller}\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Mubarak ho!_ 🎊',
        sale_cancelled: '✅ *Sale Cancel Ho Gayi!*\n\n' +
            '🃏 *{title}* _(Tier {tier})_ ab sale nahi hai.\n\n' +
            '_Card ab bhi teri deck mein hai._',
        sale_cancel_denied: '❗ Sirf wahi cancel kar sakta hai jisne sale lagayi thi, ya group admin.',
        auction_already_active: '⚠️ *Is group mein pehle se ek auction chal raha hai!*\n' +
            '_Pehle wala khatam karo: `{p}auction end`_',
        auction_none: '🔨 Is group mein koi auction nahi chal raha.',
        auction_own: '😏 Apni khud ki auction pe bid nahi laga sakte!',
        auction_low_bid: '❗ *Bid current bid se zyada honi chahiye!*\n\n' +
            '💰 *Current bid:* {current} gold\n' +
            '_Isse zyada lagao!_',
        auction_no_gold: '💸 *Itne gold nahi hain!*\n' +
            '👛 *Tera wallet:* {wallet}\n' +
            '💰 *Teri bid:* {bid}',
        auction_ended_no_bid: '🔨 *Auction Khatam!*\n\nKisi ne bid nahi lagayi. Card wapas seller ke paas.',
        auction_ended: '*🏆 AUCTION ENDED! 🏆*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '🥇 *Winner:* @{winner}\n' +
            '💰 *Final Bid:* {bid} gold\n' +
            '📦 *Stored in:* {stored}\n\n' +
            '_Mubarak ho winner ko!_ 🎊',
        auction_no_permission: '❗ Sirf seller ya admin hi auction band kar sakta hai.',
        auction_seller_gone: '❗ Seller ka card nahi mila. Auction cancel.',
        auction_bid_placed: '*💰 New Bid Lagi!*\n\n' +
            '{te} *{title}* _(Tier {tier})_\n\n' +
            '🥇 *Naya Highest:* {bidder}\n' +
            '💰 *Bid:* {amount} gold\n' +
            '{outbid}' +
            '_`{p}bid <amount>` se aur zyada lagao!_',
        auction_outbid: '\n_Pehle wale bidder @{prev} se zyada bid lagi!_\n',
        // inline ternary strings migrated to t()
        card_valid_deck_idx: '❗ Valid deck index do.',
        card_valid_start_price: '❗ Valid starting price do.',
        card_valid_idx_nums: '❗ Valid index numbers do.',
        card_valid_card_idx: '❗ Valid card index do. `{p}deck` se check karo.',
        card_not_found_input: '❗ *Card nahi mila:* "{input}"\n\n_Exact name check karo. Tier-wise: `{p}cardinfo Asuna Yuuki-4`_',
        card_wrong_shop_id: '❗ Yeh Shop ID galat hai. Active sale ka ID alag hai.',
        card_sale_fmt: '❗ Format: `{p}salecard <index>|<price>` (e.g. `{p}salecard 3|50000`)',
        card_sale_valid_idx: '❗ Valid deck index do.',
        card_sale_valid_price: '❗ Valid price do (1 se zyada).',
        card_no_cards_yet: '🃏 *Tera koi card nahi hai abhi!*\n\n' +
            'Cards groups mein spawn hote hain.\n' +
            '_`{p}collect` karke claim karo!_ 🎴',
        card_empty_deck_hint: '📦 *Tera deck khaali hai!*\n\n' +
            'Cards groups mein spawn hote hain — `{p}collect` karo! 🃏',
        card_empty_coll_hint: '🗃️ *Teri collection khaali hai!*\n\n' +
            'Deck full hone ke baad cards collection mein jaate hain.\n' +
            'Ya `{p}tocoll <num>` se deck se bhejo. 🃏',
        auction_status_no_bids: 'Koi nahi abhi',
        bid_exceed_hint: '_Active auction ke current bid se zyada lagao_',
    }
};
