const fs = require('fs')
const path = require('path')

const replacements = [
  ['R U S S E L L X Z', 'R E D Z E O X'],
  ['— u l t r a  b a i l e y s —', '— u l t i m a t e  b a i l e y s —'],
  ['◆ modo turbo · baja latencia', '◆ turbo mode · low latency'],
  ['◆ botones nativos · listas · flows', '◆ native buttons · lists · flows'],
  ['◆ consola limpia · cero ruido', '◆ clean console · zero noise'],
  ['No se pudo consultar la versión de WA Web: se usa la incluida', 'Could not fetch the WA Web version; using the bundled version'],
  ['Si WhatsApp ya publicó una más nueva, la vinculación fallará ("código incorrecto").', 'If WhatsApp has published a newer version, linking may fail ("incorrect code").'],
  ['en vivo', 'live'],
  ['fijada', 'pinned']
]

const candidates = [
  path.join(__dirname, '..', 'node_modules', '@adiwajshing', 'baileys', 'lib', 'Utils', 'banner.js'),
  path.join(__dirname, '..', 'node_modules', 'baileys', 'lib', 'Utils', 'banner.js')
]

if (fs.existsSync(path.join(__dirname, '..', 'node_modules', '.pnpm'))) {
  for (const entry of fs.readdirSync(path.join(__dirname, '..', 'node_modules', '.pnpm'))) {
    candidates.push(
      path.join(__dirname, '..', 'node_modules', '.pnpm', entry, 'node_modules', 'baileys', 'lib', 'Utils', 'banner.js')
    )
  }
}

let patched = 0
for (const file of candidates) {
  if (!fs.existsSync(file)) continue
  const before = fs.readFileSync(file, 'utf8')
  let after = before
  for (const [from, to] of replacements) after = after.split(from).join(to)
  if (after !== before) {
    fs.writeFileSync(file, after)
    patched++
  }
}

if (patched === 0) {
  console.warn('[brand-baileys-banner] No Baileys banner file needed patching.')
} else {
  console.log(`[brand-baileys-banner] Patched ${patched} Baileys banner file(s).`)
}