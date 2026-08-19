import TrackDetails from 'spotifydl-x/dist/lib/details/Track'
import { Spotify, t } from '../../lib'
import { Command, BaseCommand, Message } from '../../Structures'

@Command('spotify', {
    description: 'Downloads and sends the track of the given spotify track URL',
    aliases: ['sp'],
    usage: 'spotify [track_url]',
    cooldown: 10,
    category: 'media',
    exp: 25
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        M.urls = M.urls.filter((url) => url.includes('open.spotify.com'))
        if (!M.urls.length) return void M.reply(t('media_spotify_no_url', lang))
        const spotify = new Spotify(M.urls[0])
        const info = await spotify.getInfo()
        if ((info as { error: string }).error) return void M.reply(t('media_spotify_invalid', lang))
        const { name, artists, album_name, release_date, cover_url } = info as TrackDetails
        const text = `🎧 *Title:* ${name || ''}\n🎤 *Artists:* ${(artists || []).join(
            ','
        )}\n💽 *Album:* ${album_name}\n📆 *Release Date:* ${release_date || ''}`
        await M.reply(await this.client.utils.getBuffer(cover_url), 'image', undefined, undefined, text)
        const buffer = await spotify.download()
        return void (await M.reply(buffer, 'audio'))
    }
}
