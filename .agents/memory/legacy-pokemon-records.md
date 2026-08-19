---
name: Legacy Pokémon records
description: Older or malformed party entries may omit fields that the current Pokémon schema marks as required.
---

Commands that render or update a Pokémon party should treat display fields such as the name as untrusted legacy data and provide a readable fallback instead of calling string methods directly.

**Why:** A Nurse Joy action crashed when an existing party record had no name, even though the current TypeScript/Typegoose model requires one.

**How to apply:** Normalize or safely format party entries at the command boundary; do not delete the record just because a legacy field is missing.