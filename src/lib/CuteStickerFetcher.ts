/**
 * 🐾 CuteStickerFetcher
 * Fetches cute anime-style images (neko / kitsune) from nekos.best
 * and converts them into WhatsApp stickers using wa-sticker-formatter.
 */

import { Sticker, Categories } from 'wa-sticker-formatter'

const CUTE_ENDPOINTS = ['neko', 'kitsune'] as const

const pickEndpoint = (): string =>
    CUTE_ENDPOINTS[Math.floor(Math.random() * CUTE_ENDPOINTS.length)]

const fetchBuffer = async (url: string): Promise<Buffer> => {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
    return Buffer.from(await res.arrayBuffer())
}

export const getCuteSticker = async (): Promise<Buffer> => {
    const endpoint = pickEndpoint()
    const apiUrl = `https://nekos.best/api/v2/${endpoint}`

    const apiRes = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) })
    if (!apiRes.ok) throw new Error(`nekos.best API error: ${apiRes.status}`)

    const json = (await apiRes.json()) as { results: { url: string }[] }
    const imageUrl = json.results?.[0]?.url
    if (!imageUrl) throw new Error('nekos.best: no image URL in response')

    const imageBuffer = await fetchBuffer(imageUrl)

    const sticker = new Sticker(imageBuffer, {
        pack: '🐾 Mochi Cats',
        author: '✨ RedzeoX',
        type: 'full',
        quality: 70,
        categories: ['💗', '😺'] as Categories[],
    })

    return await sticker.build()
}
