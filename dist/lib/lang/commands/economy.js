"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.economyCmds = void 0;
exports.economyCmds = {
    en: {
        // bank
        cmd_bank_desc: 'Check your bank balance 🏦',
        cmd_bank_usage: 'bank',
        // coinflip
        cmd_coinflip_desc: 'Flip a coin — pick heads or tails and double your gold! 🪙',
        cmd_coinflip_usage: 'coinflip <heads|tails> <amount>',
        // daily
        cmd_daily_desc: 'Claim your daily gold reward 💰',
        cmd_daily_usage: 'daily',
        // deposit
        cmd_deposit_desc: 'Deposit your gold into the bank 🏦',
        cmd_deposit_usage: 'deposit <amount>',
        // dice
        cmd_dice_desc: 'Roll a dice and bet gold — roll 4, 5 or 6 to win! 🎲',
        cmd_dice_usage: 'dice <amount>',
        // duel
        cmd_duel_desc: 'Challenge someone to a gold-bet duel ⚔️',
        cmd_duel_usage: 'duel @user <amount> | duel accept | duel cancel',
        // gamble
        cmd_gamble_desc: 'Gamble your gold — pick left or right 🎰',
        cmd_gamble_usage: 'gamble <left|right> <amount>',
        // give
        cmd_give_desc: 'Give your gold to another user 💎',
        cmd_give_usage: 'give [@user / quote user] <amount>',
        // giveaway
        cmd_giveaway_desc: 'Host a gold giveaway for your group! 🎟️',
        cmd_giveaway_usage: 'giveaway create <amount> <time> | giveaway join | giveaway end | giveaway cancel',
        // loan
        cmd_loan_desc: 'Take a loan from the bot and repay in 5 EMIs every 5 hours 🏦',
        cmd_loan_usage: 'loan <amount>',
        // loanpay
        cmd_loanpay_desc: 'Manually pay off your loan (partial or full) early 💳',
        cmd_loanpay_usage: 'loanpay <amount>',
        // myloan
        cmd_myloan_desc: 'Check your active loan status and EMI schedule 📋',
        cmd_myloan_usage: 'myloan',
        // rob
        cmd_rob_desc: 'Try to rob gold from another user (risky!) 🦹',
        cmd_rob_usage: 'rob [@user / quote user]',
        // roulette
        cmd_roulette_desc: 'Spin the roulette wheel and bet on numbers or colours! 🎡',
        cmd_roulette_usage: 'roulette <amount> <red|black|green|odd|even|low|high|0-36>',
        // slot
        cmd_slot_desc: 'Bet your gold in a slot machine 🎰',
        cmd_slot_usage: 'slot <amount>',
        // spinwheel
        cmd_spinwheel_desc: 'Spin the prize wheel and win gold! 🎡',
        cmd_spinwheel_usage: 'spinwheel <amount>',
        // stock
        cmd_stock_desc: 'Virtual stock market — buy/sell shares and earn profit! 📈',
        cmd_stock_usage: 'stock market | stock buy <symbol> <shares> | stock sell <symbol> <shares> | stock portfolio | stock info <symbol>',
        // wallet
        cmd_wallet_desc: 'Check your wallet balance 👛',
        cmd_wallet_usage: 'wallet',
        // withdraw
        cmd_withdraw_desc: 'Withdraw gold from your bank to your wallet 💸',
        cmd_withdraw_usage: 'withdraw <amount>',
    },
    hi: {
        // bank
        cmd_bank_desc: 'Apna bank balance check karo 🏦',
        cmd_bank_usage: 'bank',
        // coinflip
        cmd_coinflip_desc: 'Coin flip karo — heads ya tails choose karo aur gold double karo! 🪙',
        cmd_coinflip_usage: 'coinflip <heads|tails> <amount>',
        // daily
        cmd_daily_desc: 'Apna daily gold reward claim karo 💰',
        cmd_daily_usage: 'daily',
        // deposit
        cmd_deposit_desc: 'Apna gold bank mein deposit karo 🏦',
        cmd_deposit_usage: 'deposit <amount>',
        // dice
        cmd_dice_desc: 'Dice roll karo aur gold bet karo — 4, 5 ya 6 aane pe jeet! 🎲',
        cmd_dice_usage: 'dice <amount>',
        // duel
        cmd_duel_desc: 'Kisi ko gold bet pe duel challenge karo ⚔️',
        cmd_duel_usage: 'duel @user <amount> | duel accept | duel cancel',
        // gamble
        cmd_gamble_desc: 'Gold gamble karo — left ya right choose karo 🎰',
        cmd_gamble_usage: 'gamble <left|right> <amount>',
        // give
        cmd_give_desc: 'Apna gold kisi aur user ko do 💎',
        cmd_give_usage: 'give [@user / quote user] <amount>',
        // giveaway
        cmd_giveaway_desc: 'Group mein gold giveaway host karo! 🎟️',
        cmd_giveaway_usage: 'giveaway create <amount> <time> | giveaway join | giveaway end | giveaway cancel',
        // loan
        cmd_loan_desc: 'Bot se loan lo aur 5 EMIs mein 5-5 ghante pe chukao 🏦',
        cmd_loan_usage: 'loan <amount>',
        // loanpay
        cmd_loanpay_desc: 'Apna loan manually (partial ya full) pehle chukao 💳',
        cmd_loanpay_usage: 'loanpay <amount>',
        // myloan
        cmd_myloan_desc: 'Apne active loan ka status aur EMI schedule dekho 📋',
        cmd_myloan_usage: 'myloan',
        // rob
        cmd_rob_desc: 'Kisi user ka gold churane ki koshish karo (risky hai!) 🦹',
        cmd_rob_usage: 'rob [@user / quote user]',
        // roulette
        cmd_roulette_desc: 'Roulette wheel ghuma ke number ya colour pe bet karo! 🎡',
        cmd_roulette_usage: 'roulette <amount> <red|black|green|odd|even|low|high|0-36>',
        // slot
        cmd_slot_desc: 'Slot machine mein gold bet karo 🎰',
        cmd_slot_usage: 'slot <amount>',
        // spinwheel
        cmd_spinwheel_desc: 'Prize wheel spin karo aur gold jeeto! 🎡',
        cmd_spinwheel_usage: 'spinwheel <amount>',
        // stock
        cmd_stock_desc: 'Virtual stock market — shares buy/sell karo aur profit kamao! 📈',
        cmd_stock_usage: 'stock market | stock buy <symbol> <shares> | stock sell <symbol> <shares> | stock portfolio | stock info <symbol>',
        // wallet
        cmd_wallet_desc: 'Apna wallet balance check karo 👛',
        cmd_wallet_usage: 'wallet',
        // withdraw
        cmd_withdraw_desc: 'Bank se gold wallet mein withdraw karo 💸',
        cmd_withdraw_usage: 'withdraw <amount>',
    }
};
