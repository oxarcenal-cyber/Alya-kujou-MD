---
name: Baileys migration from adiwajshing to whiskeysockets
description: Durable gotchas when migrating a WhatsApp Baileys bot to the whiskeysockets fork
---

# Baileys Migration — Key Decisions

## Package alias strategy
Keep source imports as `@adiwajshing/baileys`; alias in package.json to `npm:@whiskeysockets/baileys`. Avoids touching every source file.

**Why:** The old package is abandoned. The alias lets the project compile and run against the maintained fork with zero source-import changes.

## Non-obvious companion requirements
- Add `"protobufjs": "^7.4.0"` in yarn resolutions — Replit's package firewall blocks the old 6.x version pulled transitively
- TypeScript must be ≥5.2 — @types/node v20+ uses the `using` keyword, which older TS can't parse even with skipLibCheck
- `Auth.ts` KEY_MAP must include all keys in `SignalDataTypeMap` — the newer fork added `lid-mapping`, `device-list`, `tctoken`, `identity-key`
- Some client methods were removed in the new fork (`getPrivacyTokens`, `processingMutex`) — remove their declarations from wrapper classes
- `WAMessage` has a non-nullable `key`; `proto.IWebMessageInfo` does not — cast with `as WAMessage` at `quoted:` call sites

**Why:** These are silent build failures or runtime crashes that only surface when actually running the new package, not during a naive dependency swap.
