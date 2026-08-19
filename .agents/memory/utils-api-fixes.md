---
name: Utils command API fixes
description: Which third-party APIs used by Utils commands are broken and what they were replaced with
---

- `bot.lyo.su/quote/generate` — returns Cloudflare 526 (blocked). Replaced Quotly.ts with local canvas rendering.
- `genius.com/api/search/song` — returns 403 Forbidden. Replaced Lyrics.ts with lrclib.net (free, no auth, returns lyrics inline) + iTunes Search API for album art.
- `telegraph-uploader` (npm) — `uploadByBuffer` throws "Unknown error" at runtime. Replaced `bufferToUrl` in Utils.ts with gofile.io (GET /servers → pick server, POST /contents/uploadfile).
- `translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=...&dt=t&q=...` — free Google Translate endpoint, works without API key, auto-detects source language. Replaced mymemory.translated.net (which rejected `auto` as source lang).

**Why:** Upstream APIs went down or started blocking Replit environment IPs. Canvas, lrclib, gofile.io, and the GTX translate endpoint all confirmed working from this environment.

**How to apply:** Any command using these services should use the confirmed-working replacements above. Do not reintroduce lyo.su, Genius API, or telegraph-uploader.
