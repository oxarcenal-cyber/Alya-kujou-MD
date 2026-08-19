import { proto } from '@adiwajshing/baileys'
import { Sticker, Categories } from 'wa-sticker-formatter'
import { Command, Message, BaseCommand } from '../../Structures'
import { IArgs } from '../../Types'

@Command('take', {
    description: 'Format the given stickers',
    category: 'utils',
    exp: 15,
    cooldown: 10,
    usage: 'take [quote sticker message [options] | <pack> | <author>',
    aliases: ['repack']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { flags, context }: IArgs): Promise<void> => {
       let buffer!: Buffer
        if (M.quoted?.message?.stickerMessage) buffer = await await M.downloadMediaMessage(M.quoted.message)
        if (!buffer) return void M.reply('Provide a sticker to format, Baka!')
        flags.forEach((flag) => (context = context.replace(flag, '')))
        const numbersFlag = this.client.utils
            .extractNumbers(flags.join(' ').replace(/\--/g, ''))
            .filter((number) => number > 0 && number <= 100)
        const quality =
            numbersFlag[0] || this.getQualityFromType(flags.filter((flag) => this.qualityTypes.includes(flag))) || 50
        const categories = this.getStickerEmojisFromCategories(flags)
        const pack = context.split('|')
        const sticker = new Sticker(buffer, {
            categories,
            pack: pack[1] ? pack[1].trim() : 'Stealed By',
            author: pack[2] ? pack[2].trim() : M.sender.username,
            quality,
            type:
                flags.includes('--c') || flags.includes('--crop') || flags.includes('--cropped')
                    ? 'crop'
                    : flags.includes('--s') || flags.includes('--stretch') || flags.includes('--stretched')
                    ? 'default'
                    : flags.includes('--circle') ||
                      flags.includes('--r') ||
                      flags.includes('--round') ||
                      flags.includes('--rounded')
                    ? 'circle'
                    : 'full'
        })
        return void (await M.reply(await sticker.build(), 'sticker'))
    }

    private qualityTypes = ['--low', '--broke', '--medium', '--high']

    private getQualityFromType = (types: string[]): number | undefined => {
        if (!types[0]) return
        for (const type of types) {
            switch (type) {
                case '--broke':
                    return 1
                case '--low':
                    return 10
                case '--medium':
                    return 50
                case '--high':
                    return 100
            }
        }
    }

    private getStickerEmojisFromCategories = (flags: string[]): Categories[] => {
        const categories: Categories[] = []
        for (const flag of flags) {
            if (categories.length >= 3) return categories
            switch (flag) {
                case '--angry':
                    categories.push('💢')
                    break
                case '--happy':
                    categories.push('😄')
                    break
                case '--sad':
                    categories.push('😭')
                    break
                case '--love':
                    categories.push('❤️')
                    break
                case '--celebrate':
                    categories.push('🎉')
                    break
                case '--greet':
                    categories.push('👋')
                    break
            }
        }
        if (categories.length < 1) categories.push('✨', '💗')
        return categories
    }
}
