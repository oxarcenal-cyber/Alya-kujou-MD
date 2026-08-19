---
name: WhatsApp LID call handling
description: Why incoming call handlers must treat WhatsApp @lid identities differently from phone-number JIDs
---

# WhatsApp LID call handling

Incoming WhatsApp call events may identify the caller with an internal `@lid` JID. The LID can only be blocked when Baileys has a corresponding LID-to-phone-number mapping; otherwise block operations fail with an unresolved PN JID error.

**Why:** WhatsApp's newer LID identity system does not guarantee that the mapping is available when the call event arrives, so treating every caller as a phone JID makes the call handler fragile.

**How to apply:** Keep unresolved LID calls non-fatal. Do not synthesize a phone number from the LID; skip or defer blocking until a real mapping exists, and isolate notification, persistence, and block operations so one failure cannot escape the event handler.