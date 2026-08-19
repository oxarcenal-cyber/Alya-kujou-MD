import { AnyMessageContent } from '@adiwajshing/baileys'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

type GuideGame = 'pokemon' | 'shoob'
type GuideLanguage = 'en' | 'hi'

const guides: Record<GuideGame, Record<GuideLanguage, string>> = {
    pokemon: {
        en:
            `🎮 *Pokémon Games — How to Play*\n\n` +
            `🌱 Choose your Starter Pokémon.\n` +
            `🗺️ Explore the map and catch new Pokémon.\n` +
            `⚔️ Train your Pokémon and win battles.\n` +
            `🏅 Defeat Gym Leaders and collect badges.\n` +
            `⭐ Level up your team and become a Pokémon Champion!\n\n` +
            `💡 Tip: Build a balanced team and learn each Pokémon type's strengths.`,
        hi:
            `🎮 *Pokémon Games — Kaise Khele*\n\n` +
            `🌱 Apna Starter Pokémon choose karo.\n` +
            `🗺️ Map explore karo aur naye Pokémon catch karo.\n` +
            `⚔️ Pokémon ko train karke battles jeeto.\n` +
            `🏅 Gym Leaders ko harao aur badges collect karo.\n` +
            `⭐ Apni team ko level up karke Pokémon Champion bano!\n\n` +
            `💡 Tip: Balanced team banao aur har Pokémon type ki strength samjho.`
    },
    shoob: {
        en:
            `🃏 *Shoob.gg Cards — How to Play*\n\n` +
            `🎴 Collect cards and build your collection.\n` +
            `🔍 Check each card's power and ability.\n` +
            `🧠 Create a smart combination of cards.\n` +
            `⚔️ Use your cards strategically against opponents.\n` +
            `✨ Use special abilities at the right time.\n` +
            `🏆 Build the best deck and win the game!\n\n` +
            `💡 Tip: Save your strongest cards for the perfect moment.`,
        hi:
            `🃏 *Shoob.gg Cards — Kaise Khele*\n\n` +
            `🎴 Cards collect karke apni collection banao.\n` +
            `🔍 Har card ki power aur ability check karo.\n` +
            `🧠 Cards ka smart combination ready karo.\n` +
            `⚔️ Opponent ke against cards ko strategy se use karo.\n` +
            `✨ Special abilities ka sahi time par use karo.\n` +
            `🏆 Best deck banao aur game jeeto!\n\n` +
            `💡 Tip: Apne strongest cards ko sahi moment ke liye save karo.`
    }
}

const gameNames: Record<GuideGame, string> = {
    pokemon: '🎮 Pokémon Games',
    shoob: '🃏 Shoob.gg Cards'
}

@Command('gameguide', {
    description: 'Open the Pokémon and Shoob.gg game guides',
    usage: 'gameguide',
    category: 'games',
    aliases: ['gamesguide', 'playguide'],
    cooldown: 5,
    exp: 2,
    dm: true
})
export default class GameGuideCommand extends BaseCommand {
    private sendMainMenu = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        await this.client.sendMessage(
            M.from,
            {
                text:
                    `📚 *GAMES GUIDE*\n\n` +
                    `Choose a game to learn how to play it.\n` +
                    `Game select karne ke baad apni language choose karo. ✨`,
                footer: '⚡ Pokémon · Shoob.gg Cards',
                title: '🎮 Games Guide',
                buttons: [{
                    text: '📋 Open Games Guide',
                    sections: [{
                        title: '🎮 Choose a Game',
                        rows: [
                            {
                                title: '🎮 Pokémon Games',
                                description: 'Learn how to play Pokémon',
                                id: `${prefix}gameguide pokemon`
                            },
                            {
                                title: '🃏 Shoob.gg Cards',
                                description: 'Learn how to play the card game',
                                id: `${prefix}gameguide shoob`
                            }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent,
            { quoted: M.message as any }
        )
    }

    private sendLanguageMenu = async (M: Message, game: GuideGame): Promise<void> => {
        const prefix = this.client.config.prefix

        await this.client.sendMessage(
            M.from,
            {
                text:
                    `${gameNames[game]} selected! ✅\n\n` +
                    `Choose your language / Apni language choose karo:`,
                footer: '🇬🇧 English · 🇮🇳 Hinglish',
                title: '🌐 Choose Language',
                buttons: [{
                    text: '📋 Select Language',
                    sections: [{
                        title: '🌐 Guide Language',
                        rows: [
                            {
                                title: '🇬🇧 English Guide',
                                description: 'Read the guide in English',
                                id: `${prefix}gameguide ${game} en`
                            },
                            {
                                title: '🇮🇳 Hinglish Guide',
                                description: 'Hinglish mein guide padho',
                                id: `${prefix}gameguide ${game} hi`
                            }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent,
            { quoted: M.message as any }
        )
    }

    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const [gameArg, languageArg] = context.trim().toLowerCase().split(/\s+/)
        const game = gameArg as GuideGame
        const language = languageArg as GuideLanguage

        if (!gameArg) return this.sendMainMenu(M)
        if (!(game in guides)) return this.sendMainMenu(M)
        if (!languageArg) return this.sendLanguageMenu(M, game)

        if (language !== 'en' && language !== 'hi') return this.sendLanguageMenu(M, game)

        const prefix = this.client.config.prefix
        await this.client.sendMessage(
            M.from,
            {
                text: guides[game][language],
                footer: `Use ${prefix}gameguide to open the guide menu again.`,
                buttons: [{
                    text: '📋 More Guide Options',
                    sections: [{
                        title: '🎮 Games Guide',
                        rows: [
                            {
                                title: '🔄 Change Language',
                                description: 'Choose English or Hinglish again',
                                id: `${prefix}gameguide ${game}`
                            },
                            {
                                title: '🏠 Games Guide Home',
                                description: 'Choose another game',
                                id: `${prefix}gameguide`
                            }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent,
            { quoted: M.message as any }
        )
    }
}