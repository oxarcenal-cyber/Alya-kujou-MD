import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Song Database ────────────────────────────────────────────────────────────

interface Song {
    title: string
    artist: string
    lyrics: string      // partial lyrics clue
    genre: string
}

const SONGS: Song[] = [
    { title: 'Shape of You',       artist: 'Ed Sheeran',      genre: 'Pop',       lyrics: `"I'm in love with the shape of ___, we push and pull like a magnet do"` },
    { title: 'Blinding Lights',    artist: 'The Weeknd',      genre: 'Pop',       lyrics: `"I've been tryna call, I've been on my own for long enough"` },
    { title: 'Believer',           artist: 'Imagine Dragons', genre: 'Rock',      lyrics: `"First things first, I'm a ___ say all the words inside my head"` },
    { title: 'Rockstar',           artist: 'Post Malone',     genre: 'Hip-Hop',   lyrics: `"I've been poppin pillies, man I feel just like a ___"` },
    { title: 'Sunflower',          artist: 'Post Malone',     genre: 'Pop',       lyrics: `"Needless to say, I keep her in check, she was all bad-bad nevertheless"` },
    { title: 'Stay',               artist: 'Justin Bieber',   genre: 'Pop',       lyrics: `"I do not do well when you say you are gone"` },
    { title: 'Levitating',         artist: 'Dua Lipa',        genre: 'Pop',       lyrics: `"I got you, moonlight, you're my starlight"` },
    { title: 'Peaches',            artist: 'Justin Bieber',   genre: 'Pop',       lyrics: `"I got my peaches out in Georgia, I got my weed from California"` },
    { title: 'Bad Guy',            artist: 'Billie Eilish',   genre: 'Pop',       lyrics: `"White shirt now red, my bloody nose, sleeping, you're on your tippy toes"` },
    { title: 'Old Town Road',      artist: 'Lil Nas X',       genre: 'Country',   lyrics: `"I'm gonna take my horse to the old town road"` },
    { title: 'Senorita',           artist: 'Shawn Mendes',    genre: 'Pop',       lyrics: `"I love it when you call me Señorita, I wish I could pretend I didn't need ya"` },
    { title: 'Watermelon Sugar',   artist: 'Harry Styles',    genre: 'Pop',       lyrics: `"Tastes like strawberries on a summer evening"` },
    { title: 'Drivers License',    artist: 'Olivia Rodrigo',  genre: 'Pop',       lyrics: `"I got my driver's license last week, just like we always talked about"` },
    { title: 'Dynamite',           artist: 'BTS',             genre: 'K-Pop',     lyrics: `"Cause I, I, I'm in the stars tonight"` },
    { title: 'Butter',             artist: 'BTS',             genre: 'K-Pop',     lyrics: `"Smooth like butter, like a criminal undercover"` },
    { title: 'Save Your Tears',    artist: 'The Weeknd',      genre: 'Pop',       lyrics: `"I saw you dancing in a crowded room"` },
    { title: 'Montero',            artist: 'Lil Nas X',       genre: 'Pop',       lyrics: `"I caught it bad yesterday, you hit me with a call"` },
    { title: 'Good 4 U',           artist: 'Olivia Rodrigo',  genre: 'Pop',       lyrics: `"Well good for you, I guess you moved on really easily"` },
    { title: 'Kiss Me More',       artist: 'Doja Cat',        genre: 'Pop',       lyrics: `"Give me something to remember"` },
    { title: 'Mood',               artist: '24kGoldn',        genre: 'Hip-Hop',   lyrics: `"Why you always in a mood? Yeah, you drag me down"` },
    { title: 'Intentions',         artist: 'Justin Bieber',   genre: 'Pop',       lyrics: `"Picture perfect, you don't need no filter"` },
    { title: 'Circles',            artist: 'Post Malone',     genre: 'Pop',       lyrics: `"We couldn't turn around till we were upside down"` },
    { title: 'Memories',           artist: 'Maroon 5',        genre: 'Pop',       lyrics: `"Here's to the ones that we got, cheers to the wish you were here but you're not"` },
    { title: 'Happier',            artist: 'Marshmello',      genre: 'EDM',       lyrics: `"I want you to be happy, free to run, get carried away"` },
    { title: 'Without Me',         artist: 'Halsey',          genre: 'Pop',       lyrics: `"Found you when your heart was broke"` },
    { title: 'Thunder',            artist: 'Imagine Dragons', genre: 'Pop',       lyrics: `"Just a young gun with a quick fuse, I was uptight, wanna let loose"` },
    { title: 'Natural',            artist: 'Imagine Dragons', genre: 'Rock',      lyrics: `"Will survive in the night with the wolves"` },
    { title: 'Closer',             artist: 'The Chainsmokers',genre: 'EDM',       lyrics: `"So baby pull me closer in the back seat of your Rover"` },
    { title: 'Something Just Like This', artist: 'Coldplay',  genre: 'Pop',       lyrics: `"I've been reading books of old, the legends and the myths"` },
    { title: 'Faded',              artist: 'Alan Walker',     genre: 'EDM',       lyrics: `"You were the shadow to my light, did you feel us?"` },
    { title: 'Kesariya',           artist: 'Arijit Singh',    genre: 'Bollywood', lyrics: `"Kesariya tera ishq hai piya, kesariya"` },
    { title: 'Tum Hi Ho',          artist: 'Arijit Singh',    genre: 'Bollywood', lyrics: `"Hum tere bin ab reh nahi sakte, tere bina kya wajood mera"` },
    { title: 'Channa Mereya',      artist: 'Arijit Singh',    genre: 'Bollywood', lyrics: `"Mainu tenu samajh na aaya, channa mereya"` },
    { title: 'Gerua',              artist: 'Arijit Singh',    genre: 'Bollywood', lyrics: `"Rang de tu mohe gerua"` },
    { title: 'Tera Ban Jaunga',    artist: 'Akhil Sachdeva',  genre: 'Bollywood', lyrics: `"Chhod do saari duniya kisi ke liye"` },
    { title: 'Apna Bana Le',       artist: 'Arijit Singh',    genre: 'Bollywood', lyrics: `"Khud ko kar de fana tu, teri marzi hai meri jaan"` },
    { title: 'Raataan Lambiyan',   artist: 'Jubin Nautiyal',  genre: 'Bollywood', lyrics: `"Raataan lambiyan, oh raataan lambiyan, teri meriyan"` },
    { title: 'Pasoori',            artist: 'Ali Sethi',       genre: 'Indie',     lyrics: `"Na na na… dil diya galla, ne na koi"` },
    { title: 'Excuses',            artist: 'AP Dhillon',      genre: 'Punjabi',   lyrics: `"I've been making excuses for you for too long"` },
    { title: 'Brown Munde',        artist: 'AP Dhillon',      genre: 'Punjabi',   lyrics: `"Kuch banda sade wargi gall nahi karda"` },
    { title: 'As It Was',          artist: 'Harry Styles',    genre: 'Pop',       lyrics: `"Holdin' me back, gravity's holdin' me back"` },
    { title: 'Anti-Hero',          artist: 'Taylor Swift',    genre: 'Pop',       lyrics: `"It's me, hi, I'm the problem, it's me"` },
    { title: 'Cruel Summer',       artist: 'Taylor Swift',    genre: 'Pop',       lyrics: `"It's cool, that's what I tell 'em, no rules in breakable heaven"` },
    { title: 'Flowers',            artist: 'Miley Cyrus',     genre: 'Pop',       lyrics: `"I can buy myself flowers, write my name in the sand"` },
    { title: 'Calm Down',          artist: 'Rema',            genre: 'Afrobeats', lyrics: `"Baby calm down, calm down"` },
    { title: 'Unholy',             artist: 'Sam Smith',       genre: 'Pop',       lyrics: `"Mummy don't know daddy's getting hot at the body shop"` },
    { title: 'Enemy',              artist: 'Imagine Dragons', genre: 'Rock',      lyrics: `"Look out for yourself"` },
    { title: 'Ghost',              artist: 'Justin Bieber',   genre: 'Pop',       lyrics: `"Young love, I thought you were the one, in this life"` },
]

// ─── State ────────────────────────────────────────────────────────────────────

interface QuizGame {
    song: Song
    hints: number
    expiresAt: number
    groupJid: string
    startedAt: number
}

const activeQuizzes = new Map<string, QuizGame>()

function normalize(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function isCorrect(guess: string, answer: string): boolean {
    const g = normalize(guess)
    const a = normalize(answer)
    if (!g) return false
    return g === a || a.includes(g) || g.includes(a)
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('musicquiz', {
    description: 'Lyrics dekho aur song guess karo! 🎵',
    category: 'games',
    usage: 'musicquiz start | musicquiz <answer> | musicquiz hint | musicquiz skip | musicquiz stop',
    aliases: ['mq', 'songquiz', 'lyricquiz'],
    cooldown: 0,
    exp: 20,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input  = context.trim().toLowerCase()
        const group  = M.from
        const quiz   = activeQuizzes.get(group)

        // Helper — send a message with the "Next Quiz" button
        const sendWithNextBtn = async (text: string): Promise<void> => {
            await this.client.sendMessage(
                M.from,
                {
                    text,
                    footer: '🎵 RedzeoX Music Quiz',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎵 Next Quiz', id: `${prefix}mq start` }]
                } as any,
                { quoted: M.message }
            )
        }

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🎵 *MUSIC QUIZ*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}mq start\` → Random song ka lyrics dikhao\n` +
                    `  \`${prefix}mq <song name>\` → Song ka naam guess karo\n` +
                    `  \`${prefix}mq hint\` → Ek hint lo (artist/genre)\n` +
                    `  \`${prefix}mq skip\` → Skip karo (answer dikhega)\n` +
                    `  \`${prefix}mq stop\` → Quiz band karo\n\n` +
                    `🏆 *Rewards:*\n` +
                    `  ✅ Sahi answer = *+30 gold*\n` +
                    `  💡 Hint ke baad sahi = *+15 gold*\n\n` +
                    `⏰ *Time limit:* 60 seconds per song`,
                footer: '🎵 RedzeoX Music Quiz',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎵 Start Quiz', id: `${prefix}mq start` }]
            } as any, { quoted: M.message })

        // ── Stop ──────────────────────────────────────────────────────────
        if (input === 'stop' || input === 'end') {
            if (!quiz) return void M.reply('❌ Koi quiz nahi chal raha!')
            activeQuizzes.delete(group)
            return void sendWithNextBtn(
                `🛑 *Quiz Stopped!*\n\n` +
                `🎵 Answer tha: *${quiz.song.title}*\n` +
                `🎤 Artist: *${quiz.song.artist}*`
            )
        }

        // ── Skip ──────────────────────────────────────────────────────────
        if (input === 'skip') {
            if (!quiz) return void M.reply(`❌ Koi quiz nahi!\n📢 Shuru karo: \`${prefix}mq start\``)
            activeQuizzes.delete(group)
            return void sendWithNextBtn(
                `⏭️ *Skipped!*\n\n` +
                `🎵 Song tha: *${quiz.song.title}*\n` +
                `🎤 Artist: *${quiz.song.artist}*\n` +
                `🎸 Genre: *${quiz.song.genre}*`
            )
        }

        // ── Hint ──────────────────────────────────────────────────────────
        if (input === 'hint') {
            if (!quiz) return void M.reply(`❌ Koi quiz nahi!\n📢 Shuru karo: \`${prefix}mq start\``)
            if (quiz.hints >= 2) return void M.reply('❌ Max 2 hints already use ho gaye!')

            quiz.hints++
            // FIX: was inferred as never[] causing TS2345 — now explicitly typed as string[]
            const hints: string[] = []
            if (quiz.hints >= 1) hints.push(`🎤 Artist: *${quiz.song.artist}*`)
            if (quiz.hints >= 2) hints.push(`🎸 Genre: *${quiz.song.genre}*`)
            if (quiz.hints >= 2) hints.push(`📝 First letter: *${quiz.song.title[0].toUpperCase()}*`)

            return void await this.client.sendMessage(M.from, {
                text:
                    `💡 *HINT ${quiz.hints}/2:*\n\n` +
                    hints.join('\n') +
                    `\n\n💰 _Sahi answer = +15 gold (hint used)_`,
                footer: '🎵 RedzeoX Music Quiz',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '⏭️ Skip', id: `${prefix}mq skip` },
                    { text: '🛑 Stop', id: `${prefix}mq stop` }
                ]
            } as any, { quoted: M.message })
        }

        // ── Start ─────────────────────────────────────────────────────────
        if (input === 'start' || input === 'new') {
            if (quiz) return void M.reply(
                `❌ Quiz pehle se chal raha hai!\n` +
                `📢 Answer do: \`${prefix}mq <song name>\`\n` +
                `⏭️ Skip: \`${prefix}mq skip\``
            )

            // Pick a random song, avoid repeating the last song if possible
            const song = SONGS[Math.floor(Math.random() * SONGS.length)]

            const newQuiz: QuizGame = {
                song,
                hints: 0,
                expiresAt: Date.now() + 60_000,
                startedAt: Date.now(),
                groupJid: group
            }
            activeQuizzes.set(group, newQuiz)

            // Auto-expire after 60 s
            setTimeout(() => {
                const q = activeQuizzes.get(group)
                if (q && q.startedAt === newQuiz.startedAt) {
                    activeQuizzes.delete(group)
                    this.client.sendMessage(
                        M.from,
                        {
                            text:
                                `⏰ *TIME UP!*\n\n` +
                                `🎵 Song tha: *${song.title}*\n` +
                                `🎤 Artist: *${song.artist}*`,
                            footer: '🎵 RedzeoX Music Quiz',
                            buttonsFormat: 'buttons',
                            buttons: [{ text: '🎵 Next Quiz', id: `${prefix}mq start` }]
                        } as any
                    ).catch(() => {})
                }
            }, 60_000)

            await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🎵 ═══ *MUSIC QUIZ* ═══ 🎵\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `🎧 *Ye lyrics kaunse song ke hain?*\n\n` +
                        `_${song.lyrics}_\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `⏰ 60 seconds!\n` +
                        `📢 Answer: \`${prefix}mq <song name>\``,
                    footer: '🎵 RedzeoX Music Quiz',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '💡 Hint',    id: `${prefix}mq hint` },
                        { text: '⏭️ Skip',   id: `${prefix}mq skip` }
                    ]
                } as any,
                { quoted: M.message }
            )
            return
        }

        // ── Answer ────────────────────────────────────────────────────────
        if (!quiz)
            return void M.reply(`❌ Koi quiz nahi!\n📢 Shuru karo: \`${prefix}mq start\``)

        // FIX: expired quiz was left in the map — now cleaned up properly
        if (Date.now() > quiz.expiresAt) {
            activeQuizzes.delete(group)
            return void sendWithNextBtn(
                `⏰ *Time Up!*\n\n` +
                `🎵 Answer tha: *${quiz.song.title}*\n` +
                `🎤 Artist: *${quiz.song.artist}*`
            )
        }

        const correct = isCorrect(input, quiz.song.title) || isCorrect(input, quiz.song.artist)

        if (correct) {
            const reward = quiz.hints > 0 ? 15 : 30
            // setCrystal adds/subtracts from wallet (positive = add gold)
            await this.client.DB.setCrystal(M.sender.jid, reward)
            activeQuizzes.delete(group)

            const timeTaken = Math.round((Date.now() - quiz.startedAt) / 1000)

            return void sendWithNextBtn(
                `🎉 *CORRECT!* 🎉\n\n` +
                `🏆 *${M.sender.username || 'Player'}* ne guess kiya!\n\n` +
                `🎵 Song: *${quiz.song.title}*\n` +
                `🎤 Artist: *${quiz.song.artist}*\n` +
                `🎸 Genre: *${quiz.song.genre}*\n\n` +
                `⏱️ Time: *${timeTaken}s*\n` +
                `💰 *+${reward} gold* ${quiz.hints > 0 ? '_(hint used)_' : '🏆'}`
            )
        }

        // Wrong answer — show hint/skip buttons
        return void await this.client.sendMessage(M.from, {
            text:
                `❌ *${context.trim()}* — Galat!\n` +
                `💡 Hint lo ya skip karo!`,
            footer: '🎵 RedzeoX Music Quiz',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '💡 Hint',   id: `${prefix}mq hint` },
                { text: '⏭️ Skip',  id: `${prefix}mq skip` }
            ]
        } as any, { quoted: M.message })
    }
}
