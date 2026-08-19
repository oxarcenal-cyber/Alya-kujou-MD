"use strict";
/**
 * LANG — Command metadata (description/usage) translations, merged from
 * one file per category under `src/lib/lang/commands/`. Keys follow the
 * pattern `cmd_<commandName>_desc` and `cmd_<commandName>_usage`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandText = void 0;
const cards_1 = require("./commands/cards");
const dev_1 = require("./commands/dev");
const economy_1 = require("./commands/economy");
const fun_1 = require("./commands/fun");
const games_1 = require("./commands/games");
const general_1 = require("./commands/general");
const media_1 = require("./commands/media");
const moderation_1 = require("./commands/moderation");
const nsfw_1 = require("./commands/nsfw");
const pokemon_1 = require("./commands/pokemon");
const utils_1 = require("./commands/utils");
const weeb_1 = require("./commands/weeb");
const parts = [
    cards_1.cardsCmds, dev_1.devCmds, economy_1.economyCmds, fun_1.funCmds, games_1.gamesCmds,
    general_1.generalCmds, media_1.mediaCmds, moderation_1.moderationCmds, nsfw_1.nsfwCmds, pokemon_1.pokemonCmds, utils_1.utilsCmds, weeb_1.weebCmds
];
exports.commandText = {
    en: Object.assign({}, ...parts.map((p) => p.en)),
    hi: Object.assign({}, ...parts.map((p) => p.hi))
};
