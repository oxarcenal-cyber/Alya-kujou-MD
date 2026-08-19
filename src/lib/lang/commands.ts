/**
 * LANG — Command metadata (description/usage) translations, merged from
 * one file per category under `src/lib/lang/commands/`. Keys follow the
 * pattern `cmd_<commandName>_desc` and `cmd_<commandName>_usage`.
 */

import { cardsCmds } from './commands/cards'
import { devCmds } from './commands/dev'
import { economyCmds } from './commands/economy'
import { funCmds } from './commands/fun'
import { gamesCmds } from './commands/games'
import { generalCmds } from './commands/general'
import { mediaCmds } from './commands/media'
import { moderationCmds } from './commands/moderation'
import { nsfwCmds } from './commands/nsfw'
import { pokemonCmds } from './commands/pokemon'
import { utilsCmds } from './commands/utils'
import { weebCmds } from './commands/weeb'

const parts = [
    cardsCmds, devCmds, economyCmds, funCmds, gamesCmds,
    generalCmds, mediaCmds, moderationCmds, nsfwCmds, pokemonCmds, utilsCmds, weebCmds
]

export const commandText = {
    en: Object.assign({}, ...parts.map((p) => p.en)),
    hi: Object.assign({}, ...parts.map((p) => p.hi))
}
