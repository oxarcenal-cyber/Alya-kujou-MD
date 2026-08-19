<div align="center">

<img src="https://media1.tenor.com/images/aa3560eeb67340a6dd670f810cd3f79a/tenor.gif" width="100%" alt="Alya MD Banner"/>

# 🌸 Alya MD — WhatsApp Bot

**A powerful, feature-rich private WhatsApp bot built with TypeScript & Baileys**

[![Owner](https://img.shields.io/badge/Owner-REDZEOX-blueviolet?style=for-the-badge&logo=github)](https://github.com/REDZEOX)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Platform](https://img.shields.io/badge/Platform-WhatsApp-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com)
[![Status](https://img.shields.io/badge/Status-Private-red?style=for-the-badge)](https://github.com/REDZEOX)

</div>

---

> ⚠️ **WARNING — PRIVATE BOT**
>
> 🔒 This bot is **strictly private** and owned exclusively by **[@REDZEOX](https://github.com/REDZEOX)**.
> There is **no public repository** for this project.
> - ❌ Do **not** share, redistribute, or clone this source code
> - ❌ Do **not** deploy a copy without explicit permission from the owner
> - ❌ Do **not** claim ownership of this project
> - ✅ For support or inquiries, contact **REDZEOX** directly

---

## ✨ About

**Alya MD** is an advanced, multi-persona WhatsApp bot built on the [Baileys](https://github.com/WhiskeySockets/Baileys) library. With **200+ commands** spanning games, economy, Pokémon, anime, media, moderation and more — it brings a full gaming experience right into your WhatsApp groups.

🎭 **Bot has multiple switchable AI personas** — each with a unique personality, dialogue style, and visual theme. Type just the prefix to get a surprise intro video!

---

## 🎮 Features

### 🐾 Pokémon System
| Feature | Description |
|---------|-------------|
| 🌿 Wild Spawns | Pokémon spawn randomly in groups — catch them with `!catch` |
| ⚔️ Team Rocket Raids | Rocket steals your Pokémon! Fight together as a group to get it back |
| 🎴 TCG Card Generator | Generate pixel-perfect modern Pokémon TCG-style cards (`!pokecard`) |
| 📱 Pixel Art Pokédex | Retro GBC-style Pokédex with real pixel sprites (`!pokedex`) |
| 🏟️ Gym Battles | Challenge gym leaders and earn badges (`!challenge`) |
| 🔄 Trading | Trade Pokémon with other users in the group (`!trade`) |
| 💾 Party & PC Box | Manage your team in party (6 slots) and unlimited PC box |

### 💰 Economy System
| Feature | Description |
|---------|-------------|
| 💵 Wallet & Bank | Earn, deposit, withdraw crystals |
| 🎰 Casino Games | Slots, roulette, blackjack, dice, coinflip |
| 📈 Stock Market | Buy & sell stocks, watch prices fluctuate |
| 🎡 Spin Wheel | Daily spin for bonus rewards |
| 🤝 Loans | Borrow crystals with EMI-based repayment system |
| 🔫 Rob & Duel | Steal from others or challenge to a duel |
| 🏪 Shop | Buy items, boosts, and collectibles |

### 🎌 Anime & Waifu
| Feature | Description |
|---------|-------------|
| 👘 Character Claims | Claim anime characters and build your gallery |
| 🃏 Card System | Collect, trade, auction anime character cards |
| 🦊 Reactions | Neko, kitsune, waifu, and anime reaction GIFs |
| 📰 Anime News | Latest anime & manga news |
| 📚 Manga/Anime Search | Search via MyAnimeList integration |

### 🎮 Games
| Game | Command |
|------|---------|
| 🎯 Hangman | `!hangman` |
| 🟩 Wordle | `!wordle` |
| ❓ Quiz | `!quiz` |
| 🎵 Music Quiz | `!musicquiz` |
| 🃏 Card Duel | `!cardduel` |
| 💣 Bomb Defuse | `!bomb` |
| 🏁 Race | `!race` |
| 🤜 Rock Paper Scissors | `!rps` |
| 🎲 Blackjack | `!blackjack` |
| ❌⭕ Tic Tac Toe | `!tictactoe` |
| 🧩 Riddle | `!riddle` |
| 🔫 Russian Roulette | `!russianroulette` |

### 🛠️ Moderation & Management
- 👑 Admin commands — promote, demote, tagall, close/open group
- 🚫 Anti-link, bad word filter, auto-warn system
- 👋 Custom welcome & goodbye messages
- 🗳️ Polls, reminders, group rules
- 🤖 Group chatbot (AI-powered)
- 🌍 Multi-language support

### 🎭 Personas (Switchable)
The bot can switch personalities with different dialogue styles and themes:

| Persona | Style |
|---------|-------|
| 🌸 **Alya** *(default)* | Sweet & cheerful anime girl |
| 🔥 **Rias Gremory** | Elegant & powerful demon queen |
| 🌸 **Chisato Nishikigi** | Lycoris Recoil agent vibes |
| 🎵 **Miku** | Vocaloid — energetic & musical |
| 🎯 **Hinata** | Shy but determined |
| 🌹 **Zero Two** | Wild & fierce darling |
| 🦊 **Akino** | Playful fox spirit |

### 🎬 Special Features
- 📹 **Prefix Video Intro** — Just type the prefix alone (`-`) to get a surprise animated intro video
- 📸 Image, sticker, GIF creation tools
- 🎵 YouTube MP3/MP4 downloader
- 🔊 Spotify track info
- 🌤️ Weather, dictionary, URL shortener
- 📖 Lyrics finder

---

## ⚙️ Tech Stack

```
🟦 Language     — TypeScript 5.4
🟩 Runtime      — Node.js (with --max-old-space-size=8192)
🔵 WhatsApp     — @whiskeysockets/baileys (aliased as @adiwajshing/baileys)
🟠 Database     — MongoDB + Mongoose + Typegoose
🟣 HTTP Server  — Express.js (QR code page + health endpoint)
🖼️  Canvas       — node-canvas (card generation, pixel art, image editing)
📦 Package Mgr  — Yarn
```

---

## 🗂️ Project Structure

```
Alya-MD/
├── src/
│   ├── bot.ts                  # 🚀 Entry point
│   ├── config.ts               # ⚙️  Bot configuration
│   ├── Structures/             # 🏗️  Client, Message, Auth, Server
│   ├── Handlers/               # 📨 Message, Event, Asset, Call, Moderator
│   ├── Commands/               # 💬 All command files (categorised)
│   │   ├── Pokemon/            # 🐾 Pokémon commands
│   │   ├── Economy/            # 💰 Economy commands
│   │   ├── Games/              # 🎮 Game commands
│   │   ├── Cards/              # 🃏 Card system
│   │   ├── Moderation/         # 🛡️  Moderation commands
│   │   ├── Fun/                # 🎉 Fun commands
│   │   ├── Weeb/               # 🎌 Anime commands
│   │   ├── Media/              # 🎵 Media commands
│   │   └── Utils/              # 🔧 Utility commands
│   ├── Database/               # 🗄️  Mongoose models & schemas
│   ├── Types/                  # 📝 TypeScript interfaces
│   └── lib/                   # 📚 Shared libraries & generators
│       ├── PokemonCardGen.ts   # 🃏 TCG card renderer
│       ├── PixelDexGen.ts      # 🎮 Pixel art Pokédex renderer
│       ├── TeamRocket.ts       # 🚀 Raid event system
│       └── ...
├── assets/
│   ├── fonts/                  # 🔤 Custom fonts
│   ├── images/                 # 🖼️  Static images
│   ├── videos/                 # 🎬 Intro & event videos
│   └── gifs/                   # 🎞️  Animated GIFs
└── dist/                       # 📦 Compiled JavaScript (auto-generated)
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ Yes | MongoDB connection string |
| `SESSION` | ✅ Yes | WhatsApp auth session label |
| `PREFIX` | ✅ Yes | Command prefix (default: `-`) |
| `MODS` | ✅ Yes | Comma-separated admin phone numbers |
| `BOT_NAME` | ⚙️ Optional | Bot display name (default: `Alya MD`) |
| `PORT` | ⚙️ Optional | HTTP server port (default: `3000`) |
| `CHAT_BOT_URL` | ⚙️ Optional | Brainshop AI URL for chatbot feature |
| `SUPPORT_GROUPS` | ⚙️ Optional | Support group invite links |
| `SESSION_SECRET` | ✅ Yes | Secret key for session security |

---

## 🚀 Running the Bot

```sh
# Install dependencies
yarn install

# Build TypeScript → JavaScript
yarn build

# Start the bot
yarn start

# Or directly:
node --max-old-space-size=8192 dist/bot.js
```

> 📱 On first run, a **QR code** will appear in the console.
> Scan it with WhatsApp to authenticate. Auth state is stored in MongoDB.

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| 📝 Total Commands | 202+ |
| 🔗 Total Aliases | 294+ |
| 🎭 Personas | 7 |
| 🐾 Pokémon Integrated | Gen 1–8 (900+) |
| 🃏 Card Types | Anime + Pokémon TCG |
| 🎬 Intro Videos | 8 random |
| 💾 Database | MongoDB (persistent) |

---

## ⚠️ Important Notes

> 🔴 **This is a PRIVATE bot. There is NO public GitHub repository.**
> Do not share the source code or session credentials with anyone.

> 🟡 **Session Security** — Your WhatsApp session is stored encrypted in MongoDB.
> Never share your `MONGO_URI` or `SESSION` values publicly.

> 🟠 **Stability** — Always run with `--max-old-space-size=8192` flag to prevent
> memory crashes during heavy image/canvas generation.

> 🟢 **Updates** — Only the bot owner (REDZEOX) can push updates to this bot.
> Unauthorized modifications may cause instability.

---

## 👑 Ownership & Credits

| Role | Name |
|------|------|
| 🔑 **Owner & Developer** | [REDZEOX](https://github.com/REDZEOX) |
| 📚 **WhatsApp Library** | [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) |
| 🤖 **AI Integration** | Brainshop AI |
| 🎌 **Anime Data** | MyAnimeList / Jikan API |
| 🐾 **Pokémon Data** | [PokeAPI](https://pokeapi.co/) |

---

<div align="center">

**🌸 Alya MD — Built with ❤️ by REDZEOX 🌸**

*Private Bot · No Public Repo · All Rights Reserved © 2024–2026*

</div>
