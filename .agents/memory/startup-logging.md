---
name: Startup logging
description: The bot's console and browser log stream should summarize initialization without hiding operational messages.
---

Startup initialization is intentionally summarized into one final status entry covering the server, database, assets, commands, and WhatsApp connection. Individual asset and command load events are not useful in the normal workflow log, while QR output, errors, and post-start runtime events remain visible.

**Why:** The workflow log previously became difficult to scan because every loaded asset and command produced a separate line. Carriage-return spinners are not reliable in Replit's captured logs because each update can be recorded as a new line.

**How to apply:** Prefer event aggregation with a final summary over terminal-only `\r` spinners when changing startup logging. Preserve errors and operational events as separate entries. Keep startup non-blocking: register listeners first, queue early messages, and defer non-critical initialization.