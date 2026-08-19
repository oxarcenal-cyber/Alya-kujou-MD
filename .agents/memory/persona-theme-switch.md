---
name: Bot persona/theme switch
description: How the WhatsApp bot's personality/branding (e.g. Rias Gremory vs Alya Kujou) is switched bot-wide, and a headless-screenshot quirk with video backgrounds.
---

Bot-wide persona switching follows the same lightweight, non-DB-persisted pattern as the existing prefix switch
(`this.client.config.prefix`, set by `-setprefix`): a runtime field on `client.config` (`persona`), changed by a
command (`-settheme`), consumed by a small helper (`getPersona`/`getPersonaName`) that picks between per-persona
dialogue modules and AI system prompts.

**Why:** the codebase already had an established "runtime config field + admin command" convention for bot-wide
settings (not per-group, which uses the Group DB model like `-lang`); reusing it kept the change consistent instead
of introducing a new DB-backed settings collection for a single flag.

**How to apply:** new bot personas should add a dialogue module mirroring the existing one's exported function
shape (same keys: banned, cooldown, welcome, chatReply, etc.), and a matching AI system prompt in ChatBot.ts, then
be wired into the `getPersona`/`getPersonaName` switch — everything else (Message.ts, help.ts, Server.ts QR page)
reads through those helpers rather than hardcoding a name.

**Headless screenshot quirk:** a QR-login page background video (`<video autoplay muted loop playsinline>`) renders
correctly in real browsers but the Screenshot tool's headless capture may show only the page background color
instead of a video frame (timing/autoplay policy in headless chromium). Always add a `poster="..."` attribute
(a still frame extracted via ffmpeg) so there's a guaranteed visible background even before/if the video paints —
this also verifies the capture without needing to trust video playback in an automated screenshot.
