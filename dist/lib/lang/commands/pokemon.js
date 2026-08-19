"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonCmds = void 0;
exports.pokemonCmds = {
    en: {
        // badges
        cmd_badges_desc: '🎖️ Shows the Gym Badges you have collected',
        cmd_badges_usage: 'badges',
        // catch
        cmd_catch_desc: '🎣 Catches the wild Pokémon that just appeared in this group',
        cmd_catch_usage: 'catch <pokemon_name>',
        // challenge
        cmd_challenge_desc: '⚔️ Battle the Gym Leader that appeared in this group',
        cmd_challenge_usage: 'challenge [info]',
        // claim
        cmd_claim_desc: '🏆 Claim your Gym Challenge victory reward',
        cmd_claim_usage: 'claim <currency/pokemon/badge>',
        // pokedex
        cmd_pokedex_desc: '📖 View all Pokémon you have caught (party + PC)',
        cmd_pokedex_usage: 'pokedex [username]',
        // gymhistory
        cmd_gymhistory_desc: '🏟️ Shows the last 5 Gym Leader battles in this group',
        cmd_gymhistory_usage: 'gymhistory',
        // gymstatus
        cmd_gymstatus_desc: '🏟️ Shows the currently active Gym Leader in this group, if any',
        cmd_gymstatus_usage: 'gymstatus',
        // pokelb
        cmd_pokelb_desc: '🏆 Shows the top Pokémon trainers leaderboard',
        cmd_pokelb_usage: 'pokelb [--group]',
        // party
        cmd_party_desc: '🎒 Displays your active Pokémon party',
        cmd_party_usage: 'party',
        // pc
        cmd_pc_desc: '💾 Displays the Pokémon stored in your PC box',
        cmd_pc_usage: 'pc',
        // pokemon
        cmd_pokemon_desc: '🔍 Look up a Pokémon by name or Pokédex ID',
        cmd_pokemon_usage: 'pokemon <name|id>',
        // swap
        cmd_swap_desc: '🔀 Swap two Pokémon positions in your party',
        cmd_swap_usage: 'swap <index1> <index2>',
        // t2party
        cmd_t2party_desc: '📤 Transfer a Pokémon from your PC to your party',
        cmd_t2party_usage: 't2party <pc_index>',
        // t2pc
        cmd_t2pc_desc: '📥 Transfer a Pokémon from your party to your PC',
        cmd_t2pc_usage: 't2pc <party_index>',
        // trade-confirm
        cmd_trade_confirm_desc: '✅ Accept and complete a pending Pokémon trade offer',
        cmd_trade_confirm_usage: 'trade-confirm',
        // trade-delete
        cmd_trade_delete_desc: '❌ Cancel your active Pokémon trade offer',
        cmd_trade_delete_usage: 'trade-delete',
        // trade
        cmd_trade_desc: '🔄 Offer a Pokémon trade to the group',
        cmd_trade_usage: 'trade <slot#> <pokemon>',
        // wild
        cmd_wild_desc: '🌿 Turn wild Pokémon spawning on or off in this group',
        cmd_wild_usage: 'wild <on/off/status>',
        // startjourney
        cmd_startjourney_desc: '🌟 Begin your Pokémon adventure — choose trainer, region & starter!',
        cmd_startjourney_usage: 'startjourney',
        // trainercard
        cmd_trainercard_desc: '🃏 View your Trainer\'s Card with party & gym badges',
        cmd_trainercard_usage: 'trainercard',
        // selecttrainer
        cmd_selecttrainer_desc: '👤 Choose your trainer character (12 options)',
        cmd_selecttrainer_usage: 'selecttrainer <1-12>',
        // setregion
        cmd_setregion_desc: '🌍 Set your adventure region (Kanto, Johto, Hoenn, Sinnoh…)',
        cmd_setregion_usage: 'setregion <region name>',
        // choosestarter
        cmd_choosestarter_desc: '🌱 Pick your starter Pokémon for your region',
        cmd_choosestarter_usage: 'choosestarter <1/2/3>',
        // trainername
        cmd_trainername_desc: '✏️ Set the name shown on your Trainer\'s Card',
        cmd_trainername_usage: 'trainername <name>',
    },
    hi: {
        // badges
        cmd_badges_desc: '🎖️ Tumhare collected Gym Badges dekho',
        cmd_badges_usage: 'badges',
        // catch
        cmd_catch_desc: '🎣 Is group mein abhi aaye wild Pokémon ko pakdo',
        cmd_catch_usage: 'catch <pokemon_name>',
        // challenge
        cmd_challenge_desc: '⚔️ Is group mein aaye Gym Leader se ladai karo',
        cmd_challenge_usage: 'challenge [info]',
        // claim
        cmd_claim_desc: '🏆 Gym Challenge jeetnay ka reward claim karo',
        cmd_claim_usage: 'claim <currency/pokemon/badge>',
        // pokedex
        cmd_pokedex_desc: '📖 Tumhare pakde hue saare Pokémon dekho (party + PC)',
        cmd_pokedex_usage: 'pokedex [username]',
        // gymhistory
        cmd_gymhistory_desc: '🏟️ Is group ki last 5 Gym Leader battles dekho',
        cmd_gymhistory_usage: 'gymhistory',
        // gymstatus
        cmd_gymstatus_desc: '🏟️ Is group mein abhi active Gym Leader hai ya nahi, dekho',
        cmd_gymstatus_usage: 'gymstatus',
        // pokelb
        cmd_pokelb_desc: '🏆 Top Pokémon trainers ka leaderboard dekho',
        cmd_pokelb_usage: 'pokelb [--group]',
        // party
        cmd_party_desc: '🎒 Tumhari active Pokémon party dekho',
        cmd_party_usage: 'party',
        // pc
        cmd_pc_desc: '💾 Tumhare PC box mein stored Pokémon dekho',
        cmd_pc_usage: 'pc',
        // pokemon
        cmd_pokemon_desc: '🔍 Kisi Pokémon ko naam ya Pokédex ID se search karo',
        cmd_pokemon_usage: 'pokemon <naam|id>',
        // swap
        cmd_swap_desc: '🔀 Party mein do Pokémon ki positions swap karo',
        cmd_swap_usage: 'swap <index1> <index2>',
        // t2party
        cmd_t2party_desc: '📤 PC se koi Pokémon party mein bhejo',
        cmd_t2party_usage: 't2party <pc_index>',
        // t2pc
        cmd_t2pc_desc: '📥 Party se koi Pokémon PC mein bhejo',
        cmd_t2pc_usage: 't2pc <party_index>',
        // trade-confirm
        cmd_trade_confirm_desc: '✅ Pending Pokémon trade offer accept karo',
        cmd_trade_confirm_usage: 'trade-confirm',
        // trade-delete
        cmd_trade_delete_desc: '❌ Apna active Pokémon trade offer cancel karo',
        cmd_trade_delete_usage: 'trade-delete',
        // trade
        cmd_trade_desc: '🔄 Group mein Pokémon trade ki offer do',
        cmd_trade_usage: 'trade <slot#> <pokemon>',
        // wild
        cmd_wild_desc: '🌿 Is group mein wild Pokémon spawning on ya off karo',
        cmd_wild_usage: 'wild <on/off/status>',
        // startjourney
        cmd_startjourney_desc: '🌟 Apna Pokémon adventure shuru karo — trainer, region & starter chuno!',
        cmd_startjourney_usage: 'startjourney',
        // trainercard
        cmd_trainercard_desc: '🃏 Apna Trainer\'s Card dekho (party & gym badges ke saath)',
        cmd_trainercard_usage: 'trainercard',
        // selecttrainer
        cmd_selecttrainer_desc: '👤 Apna trainer character chuno (12 options)',
        cmd_selecttrainer_usage: 'selecttrainer <1-12>',
        // setregion
        cmd_setregion_desc: '🌍 Apna adventure region set karo (Kanto, Johto, Hoenn, Sinnoh…)',
        cmd_setregion_usage: 'setregion <region name>',
        // choosestarter
        cmd_choosestarter_desc: '🌱 Apne region ka starter Pokémon chuno',
        cmd_choosestarter_usage: 'choosestarter <1/2/3>',
        // trainername
        cmd_trainername_desc: '✏️ Trainer\'s Card pe dikhne wala naam set karo',
        cmd_trainername_usage: 'trainername <naam>',
    }
};
