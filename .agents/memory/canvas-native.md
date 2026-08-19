---
name: Canvas native module on Replit
description: Durable gotcha getting canvas npm package running on Replit Node 24
---

# Canvas Native Module — Key Decision

yarn install fails to compile canvas from source for Node 24 (ABI v137), but a prebuilt binary is available remotely.

**Why it matters:** The yarn postinstall silently fails; the package appears installed but crashes at require time.

**Fix:** After yarn install, run `node_modules/.bin/node-pre-gyp install --fallback-to-build --directory node_modules/canvas`. Also install `libuuid` as a system dep — it's a required shared library at runtime that Nix doesn't include by default.
