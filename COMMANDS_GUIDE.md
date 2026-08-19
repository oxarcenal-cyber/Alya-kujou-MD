# 📖 Bot Commands Guide
> Quick reference for all commands. Use `{prefix}help <command>` in chat for live details.
> `<value>` = required · `[value]` = optional · `@user` = tag or quote a user

---

## 🌐 General

| Command | What it does | How to use |
|---------|-------------|------------|
| `help` | Show all commands or details on one | `help` → full menu · `help blackjack` → blackjack details |
| `hi` | Say hello to the bot | `hi` |
| `info` | Bot info and stats | `info` |
| `status` | Bot uptime & health check | `status` |
| `profile` | View a user's profile card | `profile` → your profile · `profile @user` → their profile |
| `rank` | View a user's rank card | `rank` · `rank @user` |
| `lb` | Top users leaderboard | `lb` → global · `lb --group` → group only |
| `poll` | Create a WhatsApp poll | `poll "Question?" Option1 Option2 Option3` (min 2, max 12 options) |
| `remind` | Set a reminder | `remind 30m drink water` · `remind 2h homework` · `remind list` · `remind clear` |
| `marry` | Propose marriage to a user | `marry @user` |
| `divorce` | End marriage | `divorce` |
| `spouse` | View your spouse | `spouse` |
| `support` | Get support group link in DM | `support` |
| `repo` | Bot GitHub info | `repo` |
| `owner` | Bot owner info | `owner` |
| `mods` | List bot moderators | `mods` |
| `co-mods` | List bot co-moderators | `co-mods` |
| `devs` | List bot developers | `devs` |
| `badges` | View your earned badges | `badges` |
| `groupstats` | Group activity stats | `groupstats` |
| `animenews` | Latest anime news | `animenews` |
| `setbirthday` | Set your birthday | `setbirthday DD/MM/YYYY` |
| `birthdays` | View upcoming birthdays in group | `birthdays` |
| `delete` | Delete a quoted message (bot must be admin) | Quote a message → `delete` |

---

## 💰 Economy

| Command | What it does | How to use |
|---------|-------------|------------|
| `wallet` | Check your wallet balance | `wallet` |
| `bank` | Check your bank balance | `bank` |
| `daily` | Claim daily gold reward (once per day) | `daily` |
| `deposit` | Move gold from wallet to bank | `deposit 500` · `deposit all` |
| `withdraw` | Move gold from bank to wallet | `withdraw 500` · `withdraw all` |
| `give` | Send gold to another user | `give @user 200` · quote user and `give 200` |
| `shop` | Browse the item shop | `shop` |
| `buy` | Buy an item from the shop | `buy <item_key>` (key shown in shop) |
| `inventory` | View your owned items | `inventory` |
| `loan` | Take a loan (repaid in 5 EMIs every 5 hours) | `loan 1000` |
| `loanpay` | Pay off your loan early | `loanpay 500` |
| `myloan` | Check your loan status & EMI schedule | `myloan` |
| `rob` | Try to steal gold from a user (risky!) | `rob @user` · quote user and `rob` |
| `duel` | Challenge a user to a gold duel | `duel @user 200` → they reply `duel accept` or `duel cancel` |
| `giveaway` | Host a gold giveaway in the group | `giveaway create 500 10m` · `giveaway join` · `giveaway end` · `giveaway cancel` |

### 🎰 Casino Games (Economy)

| Command | What it does | How to use |
|---------|-------------|------------|
| `coinflip` | Flip a coin — guess right to double gold | `coinflip heads 100` · `coinflip tails 500` |
| `dice` | Roll a dice — roll 4/5/6 to win | `dice 200` |
| `gamble` | Pick left or right to win | `gamble left 300` · `gamble right 100` |
| `slot` | Spin a slot machine | `slot 100` |
| `spinwheel` | Spin a prize wheel | `spinwheel 200` |
| `roulette` | Bet on number or colour | `roulette 100 red` · `roulette 50 7` · `roulette 200 odd` |
| `stock` | Virtual stock market | `stock market` → view · `stock buy AAPL 5` · `stock sell AAPL 3` · `stock portfolio` · `stock info AAPL` |

---

## 🎮 Games

### Quiz & Trivia

| Command | What it does | How to use |
|---------|-------------|------------|
| `quiz` | Start an anime quiz in the group | `quiz` → bot asks question, everyone can answer |
| `answer` | Answer the current quiz question | `answer 1` · `answer 2` · `answer 3` |
| `forfeit` | Stop the ongoing quiz | `forfeit` (admin/quiz starter) |
| `musicquiz` | Bot shows lyrics → guess the song | `musicquiz start` · `musicquiz <song name>` · `musicquiz hint` · `musicquiz skip` · `musicquiz stop` |
| `riddle` | Get a riddle to solve | `riddle` → read riddle · `riddle answer` → see answer |

### Word & Letter Games

| Command | What it does | How to use |
|---------|-------------|------------|
| `hangman` | Guess the hidden word letter by letter | `hangman start` → starts · `hangman A` → guess a letter · `hangman quit` → stop |
| `wordle` | Guess a 5-letter word in 6 tries | `wordle start` → starts · `wordle crane` → guess a word · `wordle quit` → stop |

### Card & Duel Games

| Command | What it does | How to use |
|---------|-------------|------------|
| `blackjack` | Play Blackjack vs the dealer | `blackjack 200` → bet & start · `blackjack hit` → draw card · `blackjack stand` → hold · `blackjack quit` → exit |
| `cardduel` | Random card duel with abilities | `cardduel @user 100` → challenge · `cardduel accept` · `cardduel cancel` |
| `bomb` | Defuse a bomb by cutting the right wire | `bomb` → start · `bomb cut red` → cut a wire (red/blue/green/yellow/white) |
| `rps` | Rock Paper Scissors vs bot | `rps rock` · `rps paper` · `rps scissors` |

### Group Games (need multiple players)

| Command | What it does | How to use |
|---------|-------------|------------|
| `russianroulette` | Elimination game — 1 bullet, 6 chambers | `rr create 100` → host · `rr join` → join · `rr start` → begin · `rr shoot` → pull trigger · `rr cancel` |
| `race` | Everyone bets and races to the finish | `race create 100` → host · `race join` → join · `race start` → begin · `race cancel` |
| `tournament` | Bracket tournament — last one wins | `tournament create 100` → host · `tournament join` → join · `tournament start` · `tournament cancel` |

---

## 🎴 Cards System

> Cards spawn randomly in groups. Collect and trade them!

| Command | What it does | How to use |
|---------|-------------|------------|
| `collect` | Claim a card that just spawned in the group | `collect` (fast — first one gets it!) |
| `cards` | View all your cards | `cards` → all · `cards --tier` → sorted by tier · `cards --name` → sorted by name |
| `deck` | View your active deck or a specific card | `deck` → full deck · `deck 1` → card at slot 1 |
| `coll` | View your collection | `coll` → all · `coll 2` → image of card 2 |
| `cardinfo` | View any card's image and details | `cardinfo Rias` · `cardinfo Rias-gold` |
| `cardgive` | Gift a deck card to another user | `cardgive 2 @user` (deck slot 2) |
| `tocoll` | Move a card from deck → collection | `tocoll 3` (deck slot 3) |
| `todeck` | Move a card from collection → deck | `todeck 1` (collection slot 1) |
| `swapcard` | Swap two card positions in your deck | `swapcard 1 3` |
| `salecard` | List a deck card for sale in the group | `salecard 2\|500` (slot 2, price 500 gold) |
| `buycard` | Buy a card listed for sale | `buycard <shopID>` (ID shown in sale listing) |
| `cancelsale` | Cancel your active sale listing | `cancelsale` |
| `auction` | Start / end / check a card auction | `auction start\|2\|200` → start (slot 2, min bid 200) · `auction end` · `auction status` |
| `bid` | Bid on the active auction | `bid 350` |

### 🃏 Card Battle

> Short version: challenge someone, accept, pick a deck card, then use the buttons.

| Command | What it does | How to use |
|---------|--------------|------------|
| `cardgame` | Open the card hub menu | `cardgame` |
| `cardbattle @user` | Friendly battle (no stake) | `cardbattle @user` or `cardbattle @user friendly` |
| `cardbattle @user gold 500` | Gold battle — winner takes both stakes | `cardbattle @user gold 500` |
| `cardbattle @user card` | Card battle — winner picks 1 unprotected card | `cardbattle @user card` |
| `cardbattle @user ranked` | Rated battle — rating changes, no card loss | `cardbattle @user ranked` |
| `cardbattle accept` | Accept a pending challenge | `cardbattle accept` (or tap button) |
| `cardbattle decline` | Decline a pending challenge | `cardbattle decline` |
| `cardbattle attack` | Attack action during battle | `cardbattle attack` (or tap button) |
| `cardbattle defend` | Defend action during battle | `cardbattle defend` |
| `cardbattle special` | Use card's special skill (once per battle) | `cardbattle special` |
| `cardbattle cancel` | Cancel a challenge you started | `cardbattle cancel` |
| `cardbattle help` | Show short rules | `cardbattle help` |

**Quick shortcuts** (same as cardbattle subcommands):

| Command | Shortcut for |
|---------|-------------|
| `cardforfeit` | Cancel / forfeit an active battle |
| `cardstats` | Your battle stats |
| `cardhistory` | Recent battle history |
| `cardlb` | Leaderboard (add `--group` for group only) |
| `cardprofile [@user]` | Full card profile |
| `cardprotect <index>` | Protect a card (max 3) |
| `cardunprotect <slot>` | Remove protection |
| `cardprotected` | List protected cards |

**Battle flow:** Challenge → Accept → Both pick a deck card → Attack / Defend / Special each turn → Winner.  
**Rules:** challenge expires in 60 s; selection expires in 90 s; gold is reserved on accept and refunded on timeout; card mode never takes protected cards.

### 🎯 Card Missions & Progression

| Command | What it does | How to use |
|---------|-------------|------------|
| `cardmissions` | View today's 3 daily missions | `cardmissions` |
| `cardmissions claim 1` | Claim reward for completed mission | `cardmissions claim 1` · `claim 2` · `claim 3` |

Missions reset daily at midnight. Completing them earns **gold + XP**.

### 📦 Card Packs & Shop

| Command | What it does | How to use |
|---------|-------------|------------|
| `cardshop` | Browse available packs and their prices | `cardshop` |
| `cardpack <type>` | Buy a pack (stored until opened) | `cardpack basic` · `cardpack premium` · `cardpack legendary` · `cardpack divine` |
| `cardopen` | Open your next pack and receive cards | `cardopen` |

**Pack tiers:**
| Pack | Price | Cards | Tier range |
|------|-------|-------|-----------|
| `basic` | 500 gold | 2 | T1–T3 |
| `premium` | 2,000 gold | 3 | T2–T5 |
| `legendary` | 8,000 gold | 3 | T4–S |
| `divine` | 30,000 gold | 3 | T5–S |

### ✨ Card Upgrade

| Command | What it does | How to use |
|---------|-------------|------------|
| `cardupgrade` | Show upgrade guide | `cardupgrade` |
| `cardupgrade <slot1> <slot2>` | Combine 2 identical cards → next tier | `cardupgrade 3 7` (slot numbers from `cards`) |

**Rule:** Both cards must be the same character **and** same tier. T1+T1 → T2, T2+T2 → T3 … up to S (max).

---

## ⚡ Pokémon System

> Full Pokémon RPG — catch wild Pokémon, battle Gym Leaders, trade with others!

### Getting Started
| Command | What it does | How to use |
|---------|-------------|------------|
| `startjourney` | Begin your Pokémon adventure | `startjourney` → follow the steps to pick trainer, region & starter |
| `selecttrainer` | Change your trainer character | `selecttrainer 3` (pick 1–12) |
| `setregion` | Change your adventure region | `setregion Kanto` · `setregion Johto` · `setregion Hoenn` |
| `choosestarter` | Pick a starter Pokémon for your region | `choosestarter 1` · `choosestarter 2` · `choosestarter 3` |
| `trainername` | Set your trainer's display name | `trainername Ash` |
| `trainercard` | View your trainer card (party + badges) | `trainercard` |

### Catching & Managing Pokémon
| Command | What it does | How to use |
|---------|-------------|------------|
| `catch` | Catch a wild Pokémon that appeared in the group | `catch Pikachu` (type the Pokémon's name) |
| `party` | View your active Pokémon team (max 6) | `party` |
| `pc` | View Pokémon stored in your PC box | `pc` |
| `swap` | Swap two Pokémon positions in your party | `swap 1 3` |
| `t2pc` | Move a Pokémon from party → PC | `t2pc 2` (party slot 2) |
| `t2party` | Move a Pokémon from PC → party | `t2party 4` (PC slot 4) |
| `pokedex` | View all Pokémon you've caught | `pokedex` · `pokedex Username` |
| `pokemon` | Look up any Pokémon's info | `pokemon Pikachu` · `pokemon 25` |

### Gym Battles
| Command | What it does | How to use |
|---------|-------------|------------|
| `challenge` | Battle the Gym Leader currently in the group | `challenge` → battle · `challenge info` → see their team |
| `claim` | Claim your Gym victory reward | `claim currency` · `claim pokemon` · `claim badge` |
| `badges` | View your collected Gym Badges | `badges` |
| `gymstatus` | Check if a Gym Leader is active now | `gymstatus` |
| `gymhistory` | See last 5 Gym battles in this group | `gymhistory` |
| `pokelb` | Top Pokémon trainers leaderboard | `pokelb` · `pokelb --group` |

### Trading
| Command | What it does | How to use |
|---------|-------------|------------|
| `trade` | Offer a Pokémon trade to the group | `trade 2 Pikachu` (your party slot 2 for their Pikachu) |
| `trade-confirm` | Accept a pending trade offer | `trade-confirm` |
| `trade-delete` | Cancel your own trade offer | `trade-delete` |

### Admin / Toggle
| Command | What it does | How to use |
|---------|-------------|------------|
| `wild` | Turn wild Pokémon spawning on/off in the group | `wild on` · `wild off` · `wild status` |

---

## 🎭 Fun

| Command | What it does | How to use |
|---------|-------------|------------|
| `8ball` | Ask the magic 8-ball a yes/no question | `8ball Will I pass the exam?` |
| `truth` | Get a random Truth or Dare truth question | `truth` |
| `dare` | Get a random Truth or Dare dare | `dare` |
| `wouldyourather` | Get a "Would you rather?" question | `wouldyourather` |
| `joke` | Get a random joke | `joke` |
| `fact` | Get a random interesting fact | `fact` |
| `meme` | Get a random Reddit meme | `meme` |
| `quote` | Get a motivational quote | `quote` |
| `pickup` | Get a random pickup line | `pickup` |
| `roast` | Roast a user with a savage line | `roast @user` · quote user and `roast` |
| `roastbattle` | Challenge someone to a roast battle | `roastbattle @user` → they reply `roastbattle accept` or `roastbattle cancel` |
| `ship` | Ship two users together | `ship @user1 @user2` |
| `friendship` | Check friendship % between users | `friendship @user` |
| `aura` | Check someone's aura level | `aura` → yours · `aura @user` → theirs |
| `powerlevel` | Dragon Ball style power level check | `powerlevel` · `powerlevel @user` |
| `simp` | Generate a simp image | `simp @user` · quote user |
| `triggered` | Generate a triggered GIF | `triggered @user` · quote an image |
| `compliment` | Send a sweet compliment | `compliment @user` |
| `chat` | Chat with the bot AI | `chat How are you?` |
| `dxd` | Get a DxD character dialogue | `dxd` · `dxd Rias` |
| `reaction` | React with an anime GIF | `hug @user` · `pat @user` · `kiss @user` (use reaction name directly) |
| `adopt` | Adopt a user | `adopt @user` |

---

## 🛡️ Moderation (Admin Only)

| Command | What it does | How to use |
|---------|-------------|------------|
| `warn` | Warn a user (3 warnings = auto-remove) | `warn @user` · `warn @user spamming` |
| `warnings` | Check how many warnings a user has | `warnings @user` |
| `clearwarn` | Clear all warnings for a user | `clearwarn @user` |
| `promote` | Make a member an admin | `promote @user` |
| `demote` | Remove admin from a member | `demote @user` |
| `remove` | Remove a member from the group | `remove @user` |
| `removeall` | Preview, then remove all regular members (admins/owner/bot protected) | `removeall` → `removeall confirm` |
| `tagall` | Tag all group members | `tagall` · `tagall Important announcement!` |
| `close` | Lock group — only admins can chat | `close` |
| `open` | Unlock group — everyone can chat | `open` |
| `antilink` | Block WhatsApp group invite links | `antilink on` · `antilink off` · `antilink` → check status |
| `welcome` | Welcome/farewell messages on join/leave | `welcome on` · `welcome off` · `welcome` → check status |
| `autoreact` | Bot auto-reacts to every message | `autoreact on` · `autoreact off` · `autoreact mode anime` |
| `gchatbot` | Enable AI chatbot in this group | `gchatbot on` · `gchatbot off` |
| `dxdchat` | Enable DxD character auto-chat | `dxdchat on` · `dxdchat off` |
| `dxdgreet` | Enable DxD morning/night greetings | `dxdgreet on` · `dxdgreet off` |
| `spawn` | Control character/Pokémon spawning | `spawn chara on` · `spawn wild off` · `spawn all on` · `spawn status` |
| `rules` | Show group rules | `rules` |
| `setrules` | Set group rules | `setrules No spam. Be respectful.` |
| `ping` | Check bot response latency | `ping` |
| `delete` | Delete a quoted message (bot must be admin) | Quote message → `delete` |

---

## 🎵 Media

| Command | What it does | How to use |
|---------|-------------|------------|
| `song` | Search a song and get the audio | `song Shape of You` |
| `ytmp3` | Download audio from a YouTube link | `ytmp3 https://youtube.com/watch?v=...` |
| `ytmp4` | Download video from a YouTube link | `ytmp4 https://youtube.com/watch?v=...` |
| `spotify` | Download audio from a Spotify track link | `spotify https://open.spotify.com/track/...` |
| `lyrics` | Get lyrics of a song | `lyrics Believer` |
| `yts` | Search YouTube and get top results | `yts lo-fi beats` |

---

## 🔧 Utils

| Command | What it does | How to use |
|---------|-------------|------------|
| `sticker` | Convert image/video/GIF to a sticker | Send/quote media → `sticker` · `sticker pack\|author` |
| `img` | Convert a sticker back to an image | Quote sticker → `img` |
| `steal` | Re-pack a sticker with custom pack & author | Quote sticker → `steal` |
| `take` | Re-format a sticker with new metadata | Quote sticker → `take PackName\|AuthorName` |
| `qr` | Generate a QR code | `qr https://example.com` · `qr Hello World` |
| `translate` | Translate text to any language | `translate hi Hello` (hi = Hindi code) · `translate ja Good morning` |
| `calc` | Calculate a math expression | `calc 25 * 4 + 10` · `calc sqrt(144)` |
| `define` | Dictionary definition of a word | `define ephemeral` |
| `weather` | Live weather for any city | `weather Mumbai` · `weather New York` |
| `font` | Convert text to fancy fonts | `font bold Hello` · `font list` → see all styles · `font all Hi` → all styles |
| `quotly` | Make a Telegram-style quote sticker | `quotly That's life` · quote a message → `quotly` |
| `react` | React to a message with an emoji | `react 🔥` · quote message → `react ❤️` |
| `retrieve` | Reveal a view-once message | Quote view-once message → `retrieve` |
| `upload` | Upload media and get a direct link (max 5 MB) | Send/quote image/video → `upload` |
| `prettier` | Format code with Prettier | `prettier --lang=json <code>` · quote code message → `prettier --lang=js` |
| `shorten` | Shorten a long URL | `shorten https://very-long-url.com/...` |

---

## 🌸 Weeb

| Command | What it does | How to use |
|---------|-------------|------------|
| `anime` | Search an anime on MyAnimeList | `anime Naruto` · `anime` → trending |
| `manga` | Search a manga on MyAnimeList | `manga Berserk` |
| `character` | Search an anime/manga character | `character Rem` |
| `waifu` | Get a random waifu image | `waifu` |
| `neko` | Get a random neko image | `neko` |
| `kitsune` | Get a random kitsune image | `kitsune` |

---

## 🔞 NSFW *(only in NSFW-enabled groups)*

| Command | What it does | How to use |
|---------|-------------|------------|
| `nhentai` | Search or download a doujin | `nhentai` · `nhentai romance` |
| `loli` | Random NSFW loli image | `loli` |

---

## ⏱️ Time Format Reference (for `remind`, `giveaway`, etc.)
| Code | Meaning |
|------|---------|
| `30s` | 30 seconds |
| `5m` | 5 minutes |
| `2h` | 2 hours |
| `1d` | 1 day |

**Example:** `remind 1h30m take medicine` · `giveaway create 500 10m`

---

## 💡 Tips
- **Quotes** — Many commands work by quoting a message instead of typing the user/media.  
  Example: Quote someone's message → `warn` to warn them.
- **Aliases** — Most commands have shortcuts. Use `help <command>` to see them.
- **Cooldowns** — Each command has a cooldown (3–60 sec) to prevent spam.
- **XP** — Every command used earns XP toward your rank. Use `rank` to check progress.
