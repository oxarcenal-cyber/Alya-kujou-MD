import axios from 'axios'

const NEKOS_BEST = 'https://nekos.best/api/v2/'
const NEKOS_LIFE = 'https://nekos.life/api/v2/img/'

const USER_AGENT = 'AlYaMD/7.0.0 (WhatsApp Bot; github.com/redzeoX)'

/** Maps each reaction to its API endpoint URL */
const REACTION_URLS: Record<string, string> = {
    // nekos.best (primary — most complete coverage)
    baka:      `${NEKOS_BEST}baka`,
    bite:      `${NEKOS_BEST}bite`,
    blush:     `${NEKOS_BEST}blush`,
    bonk:      `${NEKOS_BEST}bonk`,
    bored:     `${NEKOS_BEST}bored`,
    bully:     `${NEKOS_BEST}poke`,      // no 'bully' on nekos.best → remap
    cry:       `${NEKOS_BEST}cry`,
    cuddle:    `${NEKOS_BEST}cuddle`,
    cringe:    `${NEKOS_BEST}bored`,     // no 'cringe' on nekos.best → remap
    dance:     `${NEKOS_BEST}dance`,
    glomp:     `${NEKOS_BEST}hug`,       // no 'glomp' on nekos.best → remap
    handhold:  `${NEKOS_BEST}handhold`,
    happy:     `${NEKOS_BEST}happy`,
    highfive:  `${NEKOS_BEST}highfive`,
    hug:       `${NEKOS_BEST}hug`,
    kick:      `${NEKOS_BEST}kick`,
    kill:      `${NEKOS_BEST}punch`,     // no 'kill' on nekos.best → remap
    kiss:      `${NEKOS_BEST}kiss`,
    laugh:     `${NEKOS_BEST}laugh`,
    lick:      `${NEKOS_BEST}nom`,       // no 'lick' on nekos.best → remap
    nom:       `${NEKOS_BEST}nom`,
    pat:       `${NEKOS_BEST}pat`,
    poke:      `${NEKOS_BEST}poke`,
    pout:      `${NEKOS_BEST}pout`,
    punch:     `${NEKOS_BEST}punch`,
    slap:      `${NEKOS_BEST}slap`,
    smile:     `${NEKOS_BEST}smile`,
    smug:      `${NEKOS_BEST}smug`,
    stare:     `${NEKOS_BEST}stare`,
    thumbsup:  `${NEKOS_BEST}thumbsup`,
    tickle:    `${NEKOS_BEST}tickle`,
    wave:      `${NEKOS_BEST}wave`,
    wink:      `${NEKOS_BEST}wink`,
    yeet:      `${NEKOS_BEST}yeet`,
    // nekos.life (fallback for reactions missing from nekos.best)
    hug2:      `${NEKOS_LIFE}hug`,
}

export type reaction = keyof typeof REACTION_URLS

// Build the Reactions enum-like object used by the command for alias registration
export const Reactions = Object.fromEntries(
    Object.keys(REACTION_URLS).map((k) => [k, REACTION_URLS[k]])
) as Record<reaction, string>

export class Reaction {
    public getReaction = async (reaction: reaction, single: boolean = true) => {
        const url = await this.fetchUrl(REACTION_URLS[reaction] ?? `${NEKOS_BEST}pat`)
        const words = this.getSuitableWords(reaction, single)
        return { url, words }
    }

    private fetchUrl = async (apiUrl: string): Promise<string> => {
        try {
            const res = await axios.get<
                { url: string } | { results: { url: string; anime_name: string }[] }
            >(apiUrl, {
                headers: { 'User-Agent': USER_AGENT },
                timeout: 10_000
            })
            const data = res.data as any
            if (data?.results?.length) return data.results[0].url
            if (data?.url) return data.url
            throw new Error('Unexpected API response shape')
        } catch {
            // Fallback — nekos.best pat always works
            const fallback = await axios
                .get<{ results: { url: string }[] }>(`${NEKOS_BEST}pat`, {
                    headers: { 'User-Agent': USER_AGENT },
                    timeout: 10_000
                })
                .catch(() => null)
            return fallback?.data?.results?.[0]?.url ?? ''
        }
    }

    private getSuitableWords = (reaction: reaction, single: boolean = true): string => {
        switch (reaction) {
            case 'bite':      return 'Bit'
            case 'blush':     return 'Blushed at'
            case 'bonk':      return 'Bonked'
            case 'bully':     return 'Bullied'
            case 'cringe':    return 'Cringed at'
            case 'cry':       return single ? 'Cried by' : 'Cried in front of'
            case 'cuddle':    return 'Cuddled'
            case 'dance':     return 'Danced with'
            case 'glomp':     return 'Glomped at'
            case 'handhold':  return 'Held the hands of'
            case 'happy':     return single ? 'is Happied by' : 'is Happied with'
            case 'highfive':  return 'High-fived'
            case 'hug':       return 'Hugged'
            case 'kick':      return 'Kicked'
            case 'kill':      return 'Killed'
            case 'kiss':      return 'Kissed'
            case 'lick':      return 'Licked'
            case 'nom':       return 'Nomed'
            case 'pat':       return 'Patted'
            case 'poke':      return 'Poked'
            case 'slap':      return 'Slapped'
            case 'smile':     return 'Smiled at'
            case 'smug':      return 'Smugged'
            case 'tickle':    return 'Tickled'
            case 'wave':      return 'Waved at'
            case 'wink':      return 'Winked at'
            case 'yeet':      return 'Yeeted at'
            case 'baka':      return 'Yelled BAKA at'
            case 'bored':     return 'is Bored of'
            case 'laugh':     return 'Laughed at'
            case 'punch':     return 'Punched'
            case 'pout':      return 'Pouted'
            case 'stare':     return 'Stared at'
            case 'thumbsup':  return 'Thumbs-upped at'
            default:          return 'Reacted to'
        }
    }
}
