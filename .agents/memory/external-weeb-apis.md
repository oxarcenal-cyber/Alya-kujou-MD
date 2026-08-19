---
name: External weeb/anime API reliability
description: Which third-party APIs used by weeb commands (waifu, anime, manga, character) are blocked or rate-limited, and the mitigation applied
---

- `api.waifu.im` returns a hard Cloudflare 403 "Just a moment" block from this environment's outbound IPs — it is not usable here. Replaced with `nekos.best` (`/api/v2/waifu`), which works reliably.
- `api.jikan.moe` (MyAnimeList API, used by the `@shineiichijo/marika` library for anime/manga/character lookups) has a strict public rate limit (~3 req/sec, 60/min) and returns 429 under light concurrent load — even a handful of back-to-back requests can trigger it.
- `nekos.best` can still return 403 for individual reaction media URLs (notably `/kick`); reaction commands must treat GIF media as optional and provide a text fallback.

**Why:** User reported waifu/anime/manga/character commands "not working." Root cause was two separate issues: waifu.im is fully blocked (not a code bug), while Jikan calls had no retry so a transient 429 was silently swallowed into a generic "not found" reply.

**How to apply:** Any command hitting Jikan/marika should wrap the call in a retry-with-backoff helper (see `Utils.withRetry` in `src/lib/Utils.ts`) that specifically retries on HTTP 429. Do not reintroduce waifu.im as an image source — prefer nekos.best or nekos.life for waifu/neko/kitsune style commands.
