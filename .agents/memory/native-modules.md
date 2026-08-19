---
name: Native module builds
description: How to fix sharp and canvas missing .node binaries after pnpm install in this project
---

## Rule
After `pnpm install`, sharp@0.30.7 and canvas@2.11.2 native binaries are not auto-built. They must be fetched manually.

**Why:** pnpm runs build scripts in a sandbox (`.ignored_*` directories). The `pnpm.allowedBuilds` list in `package.json` now includes `sharp`, `canvas`, and `@whiskeysockets/baileys`, but on first install or clean environments the binaries may still be missing.

## How to apply
If startup fails with `Cannot find module '../build/Release/sharp-linux-x64.node'`:
```
cd node_modules/.pnpm/sharp@0.30.7/node_modules/sharp
node install/libvips && node install/dll-copy && npx prebuild-install --runtime napi --tag-prefix v
```

If startup fails with `Cannot find module '../build/Release/canvas.node'`:
```
cd node_modules/.pnpm/canvas@2.11.2/node_modules/canvas
npx node-pre-gyp install --fallback-to-build=false
```

## Notes
- sharp@0.30.7 is a transitive dep of wa-sticker-formatter@4.4.4 (cannot be upgraded without updating wa-sticker-formatter)
- sharp@0.35.3 is the direct project dep (for newer commands); they coexist
- canvas@2.11.2 is used by @shineiichijo/canvas-chan (GuessThePokemon) and canvacord
- canvacord assets warning ("Could not load assets") is non-fatal; rebuild with `npx canvacord rebuild --force` if card commands fail
