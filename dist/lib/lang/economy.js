"use strict";
/**
 * LANG — Economy category (casino toggle, etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.economy = void 0;
exports.economy = {
    en: {
        casino_set: '🎰 *Casino group set!* ✅\nCasino commands now work here.',
        casino_already: '✅ This group is already the casino group!',
        // Give
        give_no_target: '❌ Please tag or quote someone!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_self: '❌ You cannot give gold to yourself!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_no_amount: '❌ Please specify an amount!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_zero: '❌ Amount must be greater than 0!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_no_gold: '❌ You don\'t have that much gold in your wallet!\n💎 *Wallet:* {wallet}\n\n📢 *How to use:* `{prefix}give @user 500`',
        // Slot
        slot_no_amount: '💬 Please specify an amount!\nExample: *slot 500*',
        slot_not_enough: '❌ You don\'t have that much in your wallet!\n💎 *Wallet:* {wallet}',
        slot_min: '❌ Minimum bet is *300 gold*',
        slot_max: '❌ Maximum bet is *10,000 gold*',
        slot_win: '🎉 *You won! +{delta} gold!*\n🏆 Points: {points}x',
        slot_lose: '💔 *You lost! -{amount} gold!*',
        // Rob
        rob_group_blocked: '❌ Rob is not allowed in this group!',
        rob_cooldown: '⏳ Rob cooldown is active!\n\n🕐 Try again in *{left} minute(s)*.\n\n📢 *How to use:* `{prefix}rob @user`',
        rob_no_target: '❌ Please tag or quote someone to rob!\n\n📢 *How to use:* `{prefix}rob @user`',
        rob_no_gold: '❌ That user doesn\'t have enough gold to rob!',
        rob_success: '🦹 *ROB SUCCESSFUL!*\n{line}\n\n@{robber} stole *{amount} Gold* from @{victim}!\n\n{line}\n📢 *How to use:* `{prefix}rob @user`',
        rob_caught: '🚔 *CAUGHT!*\n{line}\n\n@{robber} got caught and had to pay *{amount} Gold* to @{victim}!\n\n{line}\n📢 *How to use:* `{prefix}rob @user`',
        // Duel
        duel_group_only: '❌ Duel can only happen in a group!',
        duel_no_target: '❌ Please tag someone to duel!\n📢 Example: `{prefix}duel @user 1000`',
        duel_self: '❌ You cannot duel yourself!',
        duel_no_amount: '❌ Please specify a bet amount! Minimum *100 gold*\n📢 Example: `{prefix}duel @user 1000`',
        duel_max_bet: '❌ Maximum bet is *50,000 gold*',
        duel_no_gold: '❌ You only have *{wallet} gold* in your wallet!',
        duel_challenge: '⚔️ *DUEL CHALLENGE!* ⚔️\n\n😈 *{challenger}* challenges *{target}*!\n\n💰 *Bet:* {amount} gold each\n🏆 *Winner gets:* {prize} gold\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n@{targetId} will you accept the duel? ⚔️\n\n✅ Accept: `{prefix}duel accept`\n❌ Ignore → expires in 60s\n🛑 Cancel: `{prefix}duel cancel`',
        duel_no_pending: '❌ No pending duel challenge for you!\n📢 Start one: `{prefix}duel @user 1000`',
        duel_already_active: '❌ A duel is already active in this group!',
        duel_no_challenge: '❌ You have no active challenge to cancel!',
        duel_cancelled: '🛑 *Duel challenge cancelled!*',
        duel_accept_no_gold: '❌ You don\'t have enough gold to accept!\n💎 *Wallet:* {wallet}',
        // Giveaway
        giveaway_group_only: '❌ Giveaway can only happen in a group!',
        giveaway_help: '🎟️ *GIVEAWAY SYSTEM*\n\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}ga create <amount> <time>` → Create a giveaway\n' +
            '  `{prefix}ga join` → Join the giveaway\n' +
            '  `{prefix}ga end` → Pick winner now\n' +
            '  `{prefix}ga cancel` → Cancel the giveaway\n\n' +
            '⏰ *Time formats:* `30s`, `5m`, `1h`\n' +
            '💰 *Min prize:* 100 gold\n\n' +
            '📢 *Example:*\n' +
            '  `{prefix}ga create 5000 5m` → 5000 gold, 5 minute giveaway',
        giveaway_none_active: '❌ No active giveaway!\n📢 Create: `{prefix}ga create <amount> <time>`',
        giveaway_already_joined: '❌ You have already joined! 🍀',
        giveaway_joined: '✅ *{name}* joined the giveaway! 🎟️\n\n💰 Prize: *{prize} gold*\n👥 Entries: *{count}*',
        giveaway_invalid_time: '❌ Invalid time format!\n⏰ Use: `30s`, `5m`, `1h`',
        giveaway_min_prize: '❌ Minimum prize is *100 gold*!',
        giveaway_no_gold: '❌ You don\'t have enough gold!\n💎 *Wallet:* {wallet}',
        giveaway_already_active: '❌ A giveaway is already running in this group!',
        giveaway_started: '🎟️ ═══ *GIVEAWAY STARTED!* ═══ 🎟️\n\n' +
            '💰 *Prize:* {prize} gold\n' +
            '👑 *Host:* {host}\n' +
            '⏰ *Duration:* {time}\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            '📢 Join: `{prefix}ga join`\n' +
            '_Good luck everyone!_ 🍀',
        giveaway_not_host: '❌ Only the giveaway host can do this!',
        giveaway_end_none: '❌ No active giveaway to end!',
        giveaway_cancel_none: '❌ No active giveaway to cancel!',
        giveaway_cancelled: '🛑 *Giveaway cancelled!* 💰 {prize} gold returned to host.',
        giveaway_no_entries: '🎟️ *GIVEAWAY ENDED*\n\n😢 Nobody joined!\n💰 *{prize} gold* returned to host.',
        giveaway_spinning: '🎰 *Picking winner...*\n\n{names}\n\n_Spinning..._',
        giveaway_winner: '🎊 Congratulations @{winnerId}! You won *{prize} gold*!',
        giveaway_unknown_cmd: '❓ Unknown subcommand!\n📢 Help: `{prefix}ga`',
        // SpinWheel
        spinwheel_no_amount: '📢 *How to use:*\n  `{prefix}spinwheel <amount>` → Spin the wheel!\n\n🎰 *Prize Table:*\n{table}\n\n📢 *Example:* `{prefix}sw 1000`',
        spinwheel_min: '❌ Min bet *100 gold*!\n📢 Example: `{prefix}sw 1000`',
        spinwheel_max: '❌ Max bet *50,000 gold*',
        spinwheel_no_gold: '❌ You only have *{wallet} gold* in your wallet!',
        spinwheel_break_even: '🔄 *Break Even! Bet returned!*',
        // Roulette
        roulette_min: '❌ Min bet is *100 gold*!\n📢 Example: `{prefix}roulette 500 red`',
        roulette_max: '❌ Max bet is *50,000 gold*!',
        roulette_no_gold: '❌ You don\'t have enough gold!\n💎 *Wallet:* {wallet}',
        roulette_bad_amount: '❌ Please enter a valid amount!\n📢 Example: `{prefix}roulette 500 red`',
        roulette_bad_bet: '❌ Invalid bet type!\n📢 Options: `red`, `black`, `green`, `odd`, `even`, `low`, `high`, or `0-36`',
        roulette_green_note: '🟢 Green (0)',
        // Stock Market
        stock_help: '📈 *STOCK MARKET*\n\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}stock market` → View all stock prices\n' +
            '  `{prefix}stock info RIAS` → View stock details\n' +
            '  `{prefix}stock buy RIAS 5` → Buy 5 shares\n' +
            '  `{prefix}stock sell RIAS 5` → Sell 5 shares\n' +
            '  `{prefix}stock sell RIAS all` → Sell all shares\n' +
            '  `{prefix}stock portfolio` → View your portfolio\n\n' +
            '⏰ *Market tick:* Prices update every 5 minutes\n' +
            '📊 *Available stocks:*\n' +
            '{stocks}\n\n' +
            '📢 *Example:*\n' +
            '  `{prefix}stock buy CRYS 10`',
        stock_market_footer: '⏰ Prices update every 5 min\n📢 Buy: `{prefix}stock buy <SYMBOL> <qty>`',
        stock_not_found: '❌ Stock *{sym}* not found!\n📢 `{prefix}stock market` to see list',
        stock_portfolio_empty: '📋 *Portfolio is empty!*\n\n📢 Buy shares: `{prefix}stock buy RIAS 5`',
        stock_buy_max: '❌ Max *1000 shares* per transaction',
        stock_buy_no_gold: '❌ You only have *{wallet} gold* in your wallet\n💸 Need: *{total} gold*',
        stock_bought: '✅ *{qty} {sym} shares purchased!*\n\n{emoji} *{name}*\n💰 Price: *{price}* each\n💸 Total cost: *{total} gold*\n📦 Holdings: *{holdings} shares*\n\n📢 Portfolio: `{prefix}stock portfolio`',
        stock_no_shares: '❌ You don\'t have any *{sym}* shares!',
        stock_sell_qty: '❌ How many shares to sell? Or use `all`\n📢 Example: `{prefix}stock sell {sym} 5`',
        stock_sell_too_many: '❌ You only have *{shares} shares*!',
        stock_sold: '✅ *{qty} {sym} shares sold!*\n\n{emoji} *{name}*\n💰 Sell price: *{price}* each\n💵 Earned: *{earned} gold*\n{pnlEmoji} P&L: *{pnl} gold*\n\n📢 Portfolio: `{prefix}stock portfolio`',
        stock_unknown_cmd: '❓ Unknown subcommand!\n📢 Help: `{prefix}stock`',
        stock_buy_qty: '❌ How many shares? Min *1*\n📢 Example: `{prefix}stock buy {sym} 5`',
    },
    hi: {
        casino_set: '🎰 *Casino group set ho gaya!* ✅\nAb is group mein casino commands kaam karenge.',
        casino_already: '✅ Ye group already casino group hai!',
        // Give
        give_no_target: '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_self: '❌ Apne aap ko gold nahi de sakte!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_no_amount: '❌ Amount bhi likho!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_zero: '❌ Amount 0 se zyada hona chahiye!\n\n📢 *How to use:* `{prefix}give @user 500`',
        give_no_gold: '❌ Itne gold nahi hain tumhare wallet mein!\n💎 *Wallet:* {wallet}\n\n📢 *How to use:* `{prefix}give @user 500`',
        // Slot
        slot_no_amount: '💬 Amount likho!\nExample: *slot 500*',
        slot_not_enough: '❌ Wallet mein itna nahi hai!\n💎 *Wallet:* {wallet}',
        slot_min: '❌ Minimum bet *300 gold* hai',
        slot_max: '❌ Maximum bet *10,000 gold* hai',
        slot_win: '🎉 *Jeet gaye! +{delta} gold!*\n🏆 Points: {points}x',
        slot_lose: '💔 *Haar gaye! -{amount} gold!*',
        // Rob
        rob_group_blocked: '❌ Is group mein rob nahi kar sakte!',
        rob_cooldown: '⏳ Rob cooldown chal raha hai!\n\n🕐 *{left} minute* baad try karo.\n\n📢 *How to use:* `{prefix}rob @user`',
        rob_no_target: '❌ Kisi ko tag ya quote karo rob karne ke liye!\n\n📢 *How to use:* `{prefix}rob @user`',
        rob_no_gold: '❌ Us user ke wallet mein itne gold nahi hain rob karne ke liye!',
        rob_success: '🦹 *ROB SUCCESSFUL!*\n{line}\n\n@{robber} ne @{victim} se *{amount} Gold* chura liye!\n\n{line}\n📢 *How to use:* `{prefix}rob @user`',
        rob_caught: '🚔 *CAUGHT!*\n{line}\n\n@{robber} pakda gaya aur @{victim} ko *{amount} Gold* dena pada!\n\n{line}\n📢 *How to use:* `{prefix}rob @user`',
        // Duel
        duel_group_only: '❌ Duel sirf group mein hota hai!',
        duel_no_target: '❌ Kisi ko tag karo duel ke liye!\n📢 Example: `{prefix}duel @user 1000`',
        duel_self: '❌ Apne aap ko duel nahi kar sakte!',
        duel_no_amount: '❌ Bet amount batao! Minimum *100 gold*\n📢 Example: `{prefix}duel @user 1000`',
        duel_max_bet: '❌ Maximum bet *50,000 gold* hai',
        duel_no_gold: '❌ Tumhare wallet mein sirf *{wallet} gold* hai!',
        duel_challenge: '⚔️ *DUEL CHALLENGE!* ⚔️\n\n😈 *{challenger}* ne *{target}* ko challenge kiya!\n\n💰 *Bet:* {amount} gold each\n🏆 *Winner gets:* {prize} gold\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n@{targetId} kya tum accept karte ho? ⚔️\n\n✅ Accept: `{prefix}duel accept`\n❌ Ignore karo → 60s baad expire\n🛑 Cancel: `{prefix}duel cancel`',
        duel_no_pending: '❌ Tumhare liye koi pending duel challenge nahi hai!\n📢 Shuru karo: `{prefix}duel @user 1000`',
        duel_already_active: '❌ Is group mein ek duel already chal raha hai!',
        duel_no_challenge: '❌ Tumhara koi active challenge nahi hai cancel karne ke liye!',
        duel_cancelled: '🛑 *Duel challenge cancel ho gaya!*',
        duel_accept_no_gold: '❌ Tumhare paas accept karne ke liye itna gold nahi hai!\n💎 *Wallet:* {wallet}',
        // Giveaway
        giveaway_group_only: '❌ Giveaway sirf group mein hoti hai!',
        giveaway_help: '🎟️ *GIVEAWAY SYSTEM*\n\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}ga create <amount> <time>` → Giveaway banao\n' +
            '  `{prefix}ga join` → Giveaway mein shamil ho\n' +
            '  `{prefix}ga end` → Abhi winner choose karo\n' +
            '  `{prefix}ga cancel` → Giveaway cancel karo\n\n' +
            '⏰ *Time formats:* `30s`, `5m`, `1h`\n' +
            '💰 *Min prize:* 100 gold\n\n' +
            '📢 *Example:*\n' +
            '  `{prefix}ga create 5000 5m` → 5000 gold, 5 minute giveaway',
        giveaway_none_active: '❌ Koi active giveaway nahi!\n📢 Create: `{prefix}ga create <amount> <time>`',
        giveaway_already_joined: '❌ Tum pehle se joined ho! 🍀',
        giveaway_joined: '✅ *{name}* giveaway mein join hua! 🎟️\n\n💰 Prize: *{prize} gold*\n👥 Entries: *{count}*',
        giveaway_invalid_time: '❌ Time format galat hai!\n⏰ Use karo: `30s`, `5m`, `1h`',
        giveaway_min_prize: '❌ Minimum prize *100 gold* hona chahiye!',
        giveaway_no_gold: '❌ Tumhare paas itna gold nahi hai!\n💎 *Wallet:* {wallet}',
        giveaway_already_active: '❌ Is group mein ek giveaway already chal rahi hai!',
        giveaway_started: '🎟️ ═══ *GIVEAWAY STARTED!* ═══ 🎟️\n\n' +
            '💰 *Prize:* {prize} gold\n' +
            '👑 *Host:* {host}\n' +
            '⏰ *Duration:* {time}\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            '📢 Join: `{prefix}ga join`\n' +
            '_Sabko best of luck!_ 🍀',
        giveaway_not_host: '❌ Sirf giveaway host hi ye kar sakta hai!',
        giveaway_end_none: '❌ Khatam karne ke liye koi active giveaway nahi!',
        giveaway_cancel_none: '❌ Cancel karne ke liye koi active giveaway nahi!',
        giveaway_cancelled: '🛑 *Giveaway cancel ho gayi!* 💰 {prize} gold host ko wapas.',
        giveaway_no_entries: '🎟️ *GIVEAWAY ENDED*\n\n😢 Koi join hi nahi kiya!\n💰 *{prize} gold* wapas host ko.',
        giveaway_spinning: '🎰 *Winner choose ho raha hai...*\n\n{names}\n\n_Spinning..._',
        giveaway_winner: '🎊 Congratulations @{winnerId}! Tumne *{prize} gold* jeete!',
        giveaway_unknown_cmd: '❓ Sahi command batao!\n📢 Help: `{prefix}ga`',
        // SpinWheel
        spinwheel_no_amount: '📢 *How to use:*\n  `{prefix}spinwheel <amount>` → Wheel spin karo!\n\n🎰 *Prize Table:*\n{table}\n\n📢 *Example:* `{prefix}sw 1000`',
        spinwheel_min: '❌ Min bet *100 gold*!\n📢 Example: `{prefix}sw 1000`',
        spinwheel_max: '❌ Max bet *50,000 gold*',
        spinwheel_no_gold: '❌ Wallet mein sirf *{wallet} gold* hai!',
        spinwheel_break_even: '🔄 *Break Even! Bet wapas!*',
        // Roulette
        roulette_min: '❌ Min bet *100 gold* hai!\n📢 Example: `{prefix}roulette 500 red`',
        roulette_max: '❌ Max bet *50,000 gold* hai!',
        roulette_no_gold: '❌ Tumhare paas itna gold nahi hai!\n💎 *Wallet:* {wallet}',
        roulette_bad_amount: '❌ Sahi amount likho!\n📢 Example: `{prefix}roulette 500 red`',
        roulette_bad_bet: '❌ Sahi bet type likho!\n📢 Options: `red`, `black`, `green`, `odd`, `even`, `low`, `high`, ya `0-36`',
        roulette_green_note: '🟢 Green (0) — sirf 0 pe',
        // Stock Market
        stock_help: '📈 *STOCK MARKET*\n\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}stock market` → Sab stocks ki prices dekho\n' +
            '  `{prefix}stock info RIAS` → Ek stock ki detail dekho\n' +
            '  `{prefix}stock buy RIAS 5` → 5 shares kharido\n' +
            '  `{prefix}stock sell RIAS 5` → 5 shares becho\n' +
            '  `{prefix}stock sell RIAS all` → Sab shares becho\n' +
            '  `{prefix}stock portfolio` → Apna portfolio dekho\n\n' +
            '⏰ *Market tick:* Har 5 minute mein prices change hoti hain\n' +
            '📊 *Available stocks:*\n' +
            '{stocks}\n\n' +
            '📢 *Example:*\n' +
            '  `{prefix}stock buy CRYS 10`',
        stock_market_footer: '⏰ Prices har 5 min update hoti hain\n📢 Buy: `{prefix}stock buy <SYMBOL> <qty>`',
        stock_not_found: '❌ Stock *{sym}* nahi mila!\n📢 `{prefix}stock market` se list dekho',
        stock_portfolio_empty: '📋 *Portfolio khali hai!*\n\n📢 Shares kharido: `{prefix}stock buy RIAS 5`',
        stock_buy_max: '❌ Max *1000 shares* ek baar mein',
        stock_buy_no_gold: '❌ Wallet mein *{wallet} gold* hai\n💸 Chahiye: *{total} gold*',
        stock_bought: '✅ *{qty} {sym} shares kharide!*\n\n{emoji} *{name}*\n💰 Price: *{price}* each\n💸 Total cost: *{total} gold*\n📦 Holdings: *{holdings} shares*\n\n📢 Portfolio: `{prefix}stock portfolio`',
        stock_no_shares: '❌ Tumhare paas *{sym}* shares nahi hain!',
        stock_sell_qty: '❌ Kitne shares becho? Ya `all`\n📢 Example: `{prefix}stock sell {sym} 5`',
        stock_sell_too_many: '❌ Tumhare paas sirf *{shares} shares* hain!',
        stock_sold: '✅ *{qty} {sym} shares bech diye!*\n\n{emoji} *{name}*\n💰 Sell price: *{price}* each\n💵 Earned: *{earned} gold*\n{pnlEmoji} P&L: *{pnl} gold*\n\n📢 Portfolio: `{prefix}stock portfolio`',
        stock_unknown_cmd: '❓ Sahi command batao!\n📢 Help: `{prefix}stock`',
        stock_buy_qty: '❌ Kitne shares? Min *1*\n📢 Example: `{prefix}stock buy {sym} 5`',
    }
};
