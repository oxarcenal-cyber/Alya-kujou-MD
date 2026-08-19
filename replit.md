# Alya MD — WhatsApp Bot

**Private WhatsApp bot built with TypeScript, Baileys & MongoDB.**
Owner: **REDZEOX** · No public repository.

## Stack

- **Runtime**: Node.js (`--max-old-space-size=8192`)
- **Language**: TypeScript 5.4 → compiled to `dist/`
- **WhatsApp**: `@whiskeysockets/baileys` (aliased as `@adiwajshing/baileys` in imports)
- **Database**: MongoDB via Mongoose + Typegoose
- **HTTP**: Express (QR code page + health check on `PORT`)
- **Canvas**: node-canvas (TCG card gen, pixel art Pokédex, image editing)

## Running

```sh
yarn build   # TypeScript → dist/
yarn start   # node --max-old-space-size=8192 dist/bot.js
```

First run prints a QR code → scan with WhatsApp to authenticate.
Auth session is stored in MongoDB under the `SESSION` label.

## Environment Variables / Secrets

| Key | Required | Description |
|-----|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `SESSION` | ✅ | WhatsApp auth session label |
| `PREFIX` | ✅ | Command prefix (default `-`) |
| `MODS` | ✅ | Comma-separated admin phone numbers |
| `BOT_NAME` | optional | Display name (default `Alya MD ✨🍀`) |
| `PORT` | optional | HTTP port (default `3000`) |
| `CHAT_BOT_URL` | optional | Brainshop AI URL for chatbot |
| `SUPPORT_GROUPS` | optional | Support group invite links |
| `SESSION_SECRET` | ✅ | Session encryption secret |

## Project Structure

```
src/
  bot.ts              # Entry point — connects to WhatsApp & MongoDB
  config.ts           # All env-var defaults
  Structures/         # Client, Message, Auth, Server, Database
  Handlers/           # Message, Event, Asset, Call, Moderator
  Commands/           # Categorised command files (202 commands, 294 aliases)
  Database/           # Mongoose models (User, Group, Card, etc.)
  Types/              # TypeScript interfaces (IPokemonAPIResponse, etc.)
  lib/                # Shared libs
    PokemonCardGen.ts   # Modern TCG-style card image renderer
    PixelDexGen.ts      # Retro GBC-style pixel art Pokédex renderer
    TeamRocket.ts       # Team Rocket raid event system
    Utils.ts            # Fetch, buffer, misc helpers
assets/
  fonts/              # FredokaOne, ComicNeue
  images/             # Static images (help screens, etc.)
  videos/             # intro-1…8.mp4, fight videos, alya-help.mp4
  gifs/               # left.gif, right.gif
dist/                 # Compiled JS (auto-generated, do not edit)
```

## Key Behaviors

- **Prefix alone** (e.g. just `-`) → sends a random intro video (1 of 8)
- **Presence typing**: Fire-and-forget, no await — command runs immediately
- **Analytics**: Buffered in-memory, flushed to MongoDB every 30s
- **Cache TTL**: Users 60s, Groups 120s
- **Team Rocket Raids**: Cron every 3h, 30% chance per wild-enabled group, random jitter
- **Personas**: 7 switchable bot personalities (Alya, Rias, Chisato, Miku, Hinata, ZeroTwo, Akino)

## Baileys Migration Notes

- Source imports use `@adiwajshing/baileys` — aliased in `package.json` to `@whiskeysockets/baileys`
- TypeScript upgraded to 5.4 (avoids `using` keyword parse errors with `@types/node` v20)
- `protobufjs` pinned to `^7.4.0` via yarn resolutions
- Missing `SignalDataTypeMap` keys added to `Auth.ts` KEY_MAP

## User Preferences

- Keep TypeScript / Baileys / MongoDB stack — do not replace
- Always use `@whiskeysockets/baileys` aliased as `@adiwajshing/baileys` for source compatibility
- Run with `--max-old-space-size=8192` at all times (canvas operations are memory-heavy)
- Bot name: **Alya MD ✨🍀** · Owner: **REDZEOX** · Private — no public repo
