import axios from 'axios'
import { tmpdir } from 'os'
import { promisify } from 'util'
import { exec, spawn } from 'child_process'
import { readFile, unlink, writeFile } from 'fs-extra'
// telegraph-uploader removed — using gofile.io instead
import FormData from 'form-data'
import { load } from 'cheerio'
import regex from 'emoji-regex'
import * as linkify from 'linkifyjs'

export class Utils {
    public generateRandomHex = (): string => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

    public capitalize = (content: string): string => `${content.charAt(0).toUpperCase()}${content.slice(1)}`

    public generateRandomUniqueTag = (n: number = 4): string => {
        let max = 11
        if (n > max) return `${this.generateRandomUniqueTag(max)}${this.generateRandomUniqueTag(n - max)}`
        max = Math.pow(10, n + 1)
        const min = max / 10
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString().substring(1)
    }

    public extractNumbers = (content: string): number[] => {
        const search = content.match(/(-\d+|\d+)/g)
        if (search !== null) return search.map((string) => parseInt(string))
        return []
    }

    public extractUrls = (content: string): string[] => {
        const urls = linkify.find(content)
        const arr: string[] = []
        for (const url of urls) {
            arr.push(url.value)
        }
        return arr
    }

    public extractEmojis = (content: string): string[] => content.match(regex()) || []

    public formatSeconds = (seconds: number): string => new Date(seconds * 1000).toISOString().substr(11, 8)

    public bufferToUrl = async (media: Buffer, filename = 'media.jpg'): Promise<string> => {
        // Pick an upload server from gofile.io
        const serverRes = await axios.get<{ status: string; data: { servers: { name: string }[] } }>(
            'https://api.gofile.io/servers', { timeout: 8000 }
        )
        if (serverRes.data.status !== 'ok') throw new Error('gofile server fetch failed')
        const server = serverRes.data.data.servers[0].name

        const form = new FormData()
        form.append('file', media, { filename })
        const upRes = await axios.post<{ status: string; data: { downloadPage: string } }>(
            `https://${server}.gofile.io/contents/uploadfile`,
            form,
            { headers: form.getHeaders(), timeout: 30000 }
        )
        if (upRes.data.status !== 'ok') throw new Error('gofile upload failed')
        return upRes.data.data.downloadPage
    }

    public convertMs = (ms: number, to: 'seconds' | 'minutes' | 'hours' = 'seconds'): number => {
        const seconds = parseInt((ms / 1000).toString().split('.')[0])
        const minutes = parseInt((seconds / 60).toString().split('.')[0])
        const hours = parseInt((minutes / 60).toString().split('.')[0])
        if (to === 'hours') return hours
        if (to === 'minutes') return minutes
        return seconds
    }

    public webpToPng = async (webp: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.webp`, webp)
        await this.exec(`dwebp "${filename}.webp" -o "${filename}.png"`)
        const buffer = await readFile(`${filename}.png`)
        Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
        return buffer
    }

    public mp3ToOpus = async (mp3: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.mp3`, mp3)
        await this.exec(`ffmpeg -i ${filename}.mp3 -c:a libopus ${filename}.opus`)
        const buffer = await readFile(`${filename}.opus`)
        Promise.all([unlink(`${filename}.mp3`), unlink(`${filename}.opus`)])
        return buffer
    }

    public mp4ToWhatsApp = async (mp4: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.mp4`, mp4)
        await this.exec(
            `ffmpeg -y -i ${filename}.mp4 -c:v libx264 -preset fast -crf 28 -c:a aac -b:a 128k -movflags faststart -pix_fmt yuv420p ${filename}_out.mp4`
        )
        const buffer = await readFile(`${filename}_out.mp4`)
        Promise.all([unlink(`${filename}.mp4`), unlink(`${filename}_out.mp4`)])
        return buffer
    }

    public webpToMp4 = async (webp: Buffer): Promise<Buffer> => {
        const responseFile = async (form: FormData, buffer = '') => {
            return axios.post(
                buffer ? `https://ezgif.com/webp-to-mp4/${buffer}` : 'https://ezgif.com/webp-to-mp4',
                form,
                {
                    headers: { 'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}` }
                }
            )
        }
        return new Promise(async (resolve, reject) => {
            const form: any = new FormData()
            form.append('new-image-url', '')
            form.append('new-image', webp, { filename: 'blob' })
            responseFile(form)
                .then(({ data }) => {
                    const datafrom: any = new FormData()
                    const $ = load(data)
                    const file = $('input[name="file"]').attr('value')
                    datafrom.append('file', file)
                    datafrom.append('convert', 'Convert WebP to MP4!')
                    responseFile(datafrom, file)
                        .then(async ({ data }) => {
                            const $ = load(data)
                            const result = await this.getBuffer(
                                `https:${$('div#output > p.outfile > video > source').attr('src')}`
                            )
                            resolve(result)
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    public gifToMp4 = async (gif: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.gif`, gif)
        await this.exec(
            `ffmpeg -y -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -crf 18 -preset medium -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
        )
        const buffer = await readFile(`${filename}.mp4`)
        Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.mp4`)])
        return buffer
    }

    public fetch = async <T>(url: string): Promise<T | null> => {
        try {
            return (await axios.get<T>(url)).data
        } catch (err) {
            console.error(`[Utils.fetch] Failed to fetch ${url}:`, (err as Error).message)
            return null
        }
    }

    public getBuffer = async (url: string): Promise<Buffer> => {
        try {
            return (await axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data
        } catch (err) {
            console.error(`[Utils.getBuffer] Failed to fetch buffer from ${url}:`, (err as Error).message)
            throw err
        }
    }

    /** Download buffer only if file size is within limit.
     *  Checks Content-Length header first — returns null if too large or fetch fails. */
    public getBufferCapped = async (url: string, maxBytes: number): Promise<Buffer | null> => {
        try {
            // HEAD request — check size without downloading
            const head = await axios.head(url, { timeout: 8000 }).catch(() => null)
            if (head) {
                const contentLength = parseInt(String(head.headers['content-length'] ?? '0'), 10)
                if (contentLength > 0 && contentLength > maxBytes) return null
            }
            const res = await axios.get<Buffer>(url, {
                responseType: 'arraybuffer',
                maxContentLength: maxBytes,
                maxBodyLength: maxBytes,
                timeout: 20000
            })
            const buf = Buffer.from(res.data)
            if (buf.length > maxBytes) return null
            return buf
        } catch {
            return null
        }
    }

    /** Convert a GIF URL → MP4 Buffer using ffmpeg (reads directly from URL).
     *  Scales to max 640px wide (keeps aspect ratio) — sharp + small enough for WhatsApp.
     *  Returns null on any failure so callers can fall back to text. */
    public gifUrlToMp4 = async (url: string, timeoutMs = 60_000): Promise<Buffer | null> => {
        return new Promise((resolve) => {
            const chunks: Buffer[] = []
            const proc = spawn('ffmpeg', [
                '-y',
                '-i', url,
                '-vf', "scale='min(640,iw)':-2,scale=trunc(iw/2)*2:trunc(ih/2)*2",
                '-pix_fmt', 'yuv420p',
                '-crf', '24',
                '-preset', 'fast',
                '-movflags', 'frag_keyframe+empty_moov+faststart',
                '-t', '30',
                '-f', 'mp4',
                'pipe:1'
            ], { stdio: ['ignore', 'pipe', 'ignore'] })

            proc.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))

            const timer = setTimeout(() => {
                proc.kill()
                resolve(null)
            }, timeoutMs)

            proc.on('close', (code: number) => {
                clearTimeout(timer)
                if (code === 0 && chunks.length > 0) resolve(Buffer.concat(chunks))
                else resolve(null)
            })

            proc.on('error', () => {
                clearTimeout(timer)
                resolve(null)
            })
        })
    }

    public sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

    public withRetry = async <T>(
        fn: () => Promise<T>,
        options: { retries?: number; delay?: number } = {}
    ): Promise<T> => {
        const { retries = 3, delay = 1500 } = options
        let lastError: unknown
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await fn()
            } catch (err) {
                lastError = err
                const status = (err as { response?: { status?: number } })?.response?.status
                const isRetryable = status === 429 || status === 503 || status === 504
                const isLastAttempt = attempt === retries
                if (!isRetryable || isLastAttempt) throw err
                await this.sleep(delay * (attempt + 1))
            }
        }
        throw lastError
    }

    public exec = promisify(exec)
}
