import { readFileSync, existsSync, readdirSync } from 'fs-extra'
import { join } from 'path'

const VIDEO_DIR = join(__dirname, '..', '..', 'assets', 'videos')

/** Returns total count of intro-*.mp4 files available on disk */
export const getIntroVideoCount = (): number => {
    try {
        return readdirSync(VIDEO_DIR).filter(f => /^intro-\d+\.mp4$/.test(f)).length
    } catch {
        return 0
    }
}

/** Picks a random intro video from disk and returns its buffer + id */
export const getRandomIntroVideo = (): { buffer: Buffer; id: number } | null => {
    try {
        const files = readdirSync(VIDEO_DIR).filter(f => /^intro-\d+\.mp4$/.test(f))
        if (!files.length) return null
        const picked = files[Math.floor(Math.random() * files.length)]
        const videoPath = join(VIDEO_DIR, picked)
        if (!existsSync(videoPath)) return null
        const id = parseInt(picked.replace('intro-', '').replace('.mp4', ''))
        return { buffer: readFileSync(videoPath), id }
    } catch {
        return null
    }
}

/** Returns buffer of a specific intro video by id */
export const getIntroVideo = (id: number): Buffer | null => {
    try {
        const videoPath = join(VIDEO_DIR, `intro-${id}.mp4`)
        if (!existsSync(videoPath)) return null
        return readFileSync(videoPath)
    } catch {
        return null
    }
}
