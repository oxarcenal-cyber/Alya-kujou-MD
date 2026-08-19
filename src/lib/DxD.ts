/**
 * ʜɪɢʜ ꜱᴄʜᴏᴏʟ ᴅxᴅ — Character Dialogue Database (Season 1–4)
 * Har character ki personality-accurate, stylized lines.
 * Ye original show ke exact subtitles nahi hain — inspired/paraphrased
 * lines hain jo har character ki known personality/catchphrases follow karti hain.
 *
 * Feature kaise kaam karta hai:
 *  1. `-dxdchat on/off` — group mein is feature ko toggle karta hai (admin/mod only).
 *  2. Jab ON ho, group ke kisi bhi normal (non-command) message par bot
 *     random character choose karta hai aur uski ek random dialogue line
 *     reply karta hai — character ka naam prefix ke saath.
 *  3. `-dxd [character name]` — manually kisi specific character (ya random,
 *     agar naam na do) ki ek line manga sakte ho, kabhi bhi, chatbot ON/OFF
 *     se independent.
 * Ye feature purani OpenAI-based chatbot se bilkul alag/independent hai —
 * koi API call nahi hoti, sab kuch local data se instant reply hota hai,
 * isliye billing/quota ka koi issue nahi aayega.
 */

export interface IDxDCharacter {
    name: string
    aliases: string[]
    lines: string[]
}

export const DXD_CHARACTERS: IDxDCharacter[] = [
    {
        name: 'Issei Hyodo',
        aliases: ['issei', 'ise'],
        lines: [
            'Oppai wa saikou da! Meri zindagi ka ek hi mission hai — Harem King banna!',
            'Main haar sakta hoon, lekin kabhi bhaagunga nahi — jo bhi mere saathiyon ko chhedega, uska naash hoga!',
            'Sekiryuutei ka power sirf ladne ke liye nahi — apno ko bachane ke liye hai!',
            'Buchou, main tumhe promise karta hoon — chahe kuch bhi ho jaye, main sabko bachaunga!',
            'Dragon ho ya insaan, dil hamesha wahi rehta hai — mera dil kabhi nahi jhukega!',
            'Ddraig, chal ek aur round karte hain — main abhi haara nahi hoon!',
            'Jitna bhi powerful dushman ho, mere liye family sabse upar hai!'
        ]
    },
    {
        name: 'Rias Gremory',
        aliases: ['rias'],
        lines: [
            'Main Rias Gremory hoon — Gremory clan ki heir, aur mera peerage mera parivar hai.',
            'Jo bhi mere Issei ko haath lagayega, use Power of Destruction ka swaad milega.',
            'Main haarna nahi jaanti — kyunki mere peerage ki himmat kabhi kam nahi hoti.',
            'Ek Rating Game ho ya zindagi ki koi bhi ladai, main apne logon ko kabhi akela nahi chhodti.',
            'Occult Research Club mera dusra ghar hai, aur yahan ka har member mera khazana hai.',
            'Main heir hoon, lekin sabse pehle main ek dost hoon — apne peerage ke liye.',
            'Chahe Underworld ho ya human world, main jahan bhi hoon, apno ki raksha karungi.'
        ]
    },
    {
        name: 'Akeno Himejima',
        aliases: ['akeno', 'himejima'],
        lines: [
            '*Ara ara~* Kya soch rahe ho tum? Bata do, main sun rahi hoon~',
            '*Fufufu~* Thunder aur lightning dono mere control mein hain — sambhal kar rehna~',
            'Main aadhi fallen angel, aadhi devil hoon — dono taraf ki khoobiyan mere paas hain~',
            '*Ara ara~* Itna dar kyun rahe ho? Main tumhe kuch bura nahi karungi... zyada~',
            'Rias mera sabse pyaara dost hai — uske liye main kuch bhi kar sakti hoon.',
            'Sadism thoda hai mujhme, maanti hoon~ *Fufufu~* Par dil se main caring hoon.',
            '*Ara~* Itna serious mat bano, life ko thoda enjoy karo~'
        ]
    },
    {
        name: 'Asia Argento',
        aliases: ['asia'],
        lines: [
            'Main sabko heal karna chahti hoon — yehi mera Sacred Gear ka maksad hai.',
            'Issei-san, aap hamesha meri madad karte hain... main aapki bahut shukr-guzar hoon.',
            'Main pehle bahut akeli thi, lekin ab mera ek pyaara parivar hai!',
            'Chahe main devil ban gayi hoon, meri healing ki niyat kabhi nahi badlegi.',
            'Twilight Healing — chot laage kisi ko bhi, main use theek kar dungi!',
            'Dosti sabse badi daulat hai — mujhe ye is family se seekhne mila.',
            'Main dar jaati hoon kabhi kabhi, par apno ke liye himmat bhi rakhti hoon.'
        ]
    },
    {
        name: 'Koneko Toujou',
        aliases: ['koneko'],
        lines: [
            '...senpai, aap bahut zyada perverted hain.',
            'Sweets sabse important hain. Baaki sab baad mein.',
            'Main Nekoshou hoon — apni asli shakti se main darti nahi hoon ab.',
            'Kum bolna matlab kum drama. Simple.',
            'Buchou ke liye main kuch bhi karungi — chahe wo kabhi na jaane.',
            '...hmph. Tumse kuch expect nahi tha, phir bhi thanks.',
            'Main chhoti hoon, par meri punch bilkul chhoti nahi hai.'
        ]
    },
    {
        name: 'Xenovia Quarta',
        aliases: ['xenovia'],
        lines: [
            'Durandal ke saamne koi bhi Excalibur tikta nahi hai.',
            'Main seedha bolti hoon — ghumaana mujhe pasand nahi.',
            'Church ne mujhe chhod diya, par mera faith khatam nahi hua.',
            'Issei, tumhare bachche paida karne ka plan abhi bhi chal raha hai mera.',
            'Ladna hi mera dharma hai — chahe dushman kitna bhi bada ho.',
            'Main kabhi jhoot nahi bolti — sach kadwa ho toh bhi.',
            'Ek exorcist se devil banna mushkil tha, par mujhe apna nayi zindagi pasand hai.'
        ]
    },
    {
        name: 'Irina Shidou',
        aliases: ['irina'],
        lines: [
            'God ki kasam, main hamesha sach ka saath dungi!',
            'Issei-kun! Bachpan wale promise yaad hai na tumhe?',
            'Main angel hoon, matlab main hamesha positive rehti hoon~',
            'Excalibur Mimic ke saath main kisi se bhi ladh sakti hoon!',
            'Chahe alag side ho, dosti kabhi khatam nahi hoti.',
            'Amen! Chalo, aage badhte hain!',
            'Main thodi clumsy hoon, par mera dil hamesha sahi jagah hota hai.'
        ]
    },
    {
        name: 'Kiba Yuuto',
        aliases: ['kiba', 'yuuto'],
        lines: [
            'Sword Birth mera Sacred Gear hai — jo bhi blade chahiye, wo bana sakta hoon.',
            'Excalibur ke against mera gussa purana tha, par ab main us dard se aazad hoon.',
            'Ek Knight ka farz hai apne King ki raksha karna — main hamesha taiyaar hoon.',
            'Main shaant rehta hoon, par jab zaroorat ho, main pura ladta hoon.',
            'Meri talwar sirf lohe ki nahi — usme mera resolve bhi hai.',
            'Buchou ne mujhe naya jeevan diya — main uska karz kabhi nahi bhoolunga.',
            'Chahe kitna bhi strong dushman ho, main apna calm nahi todunga.'
        ]
    },
    {
        name: 'Rossweisse',
        aliases: ['rossweisse', 'ross'],
        lines: [
            'Main Valkyrie hoon, lekin abhi bhi single hone ki tension leti hoon...',
            'Magic circles aur runes mera speciality hain — precision matter karta hai.',
            'Main kabhi kabhi bahut serious ho jaati hoon, sorry agar awkward lage.',
            'Odin se mujhe azaadi mili, aur ab main Gremory family ka hissa hoon.',
            'Paisa bachana zaroori hai — main hamesha budget dekhti hoon!',
            'Main strong hoon, par kabhi kabhi khud par doubt bhi karti hoon.',
            'Teaching aur fighting dono mujhe aati hain — mujhe underestimate na karo.'
        ]
    },
    {
        name: 'Sona Sitri',
        aliases: ['sona'],
        lines: [
            'Discipline sabse zaroori hai — rules todne walon ko main maaf nahi karti.',
            'Main Rias ki tarah flashy nahi hoon, par mera strategy game sabse strong hai.',
            'Student Council President hone ka matlab hai har waqt responsible rehna.',
            'Chess mein bhi aur ladai mein bhi, main hamesha plan banati hoon.',
            'Rias meri rival hai, par sabse pehle wo meri best friend hai.',
            'Main emotions kum dikhati hoon, iska matlab nahi ki mujhe care nahi.',
            'Har decision soch samajh kar leti hoon — impulsiveness mera style nahi.'
        ]
    },
    {
        name: 'Vali Lucifer',
        aliases: ['vali'],
        lines: [
            'Hakuryuukou hoon main — White Dragon Emperor, aur main sirf strongest se ladta hoon.',
            'Issei, tu mera sabse interesting rival hai — mujhe bore mat karna.',
            'Power hi meri poori duniya hai — jo weak rehta hai, wo mit jaata hai.',
            'Main kisi group ka nahi — main sirf apne raste chalta hoon.',
            'Albion, thoda aur shakti do — ye ladai abhi shuru hui hai.',
            'Main devils ka Lucifer khoon rakhta hoon, par main apna raasta khud chunta hoon.',
            'Jab tak koi mujhse strong nahi milta, main satisfied nahi hota.'
        ]
    },
    {
        name: 'Azazel',
        aliases: ['azazel'],
        lines: [
            'Main Fallen Angels ka Governor hoon — aur haan, main bhi thoda pervert hoon, deal with it.',
            'Sacred Gears ki research mera favourite kaam hai — itna interesting subject hai ye!',
            'Peace treaty banana easy nahi tha, par teen factions ka saath aana zaroori tha.',
            'Main young generation ko sikhata hoon — galtiyan bhi karne dena zaroori hai.',
            'Power aur knowledge dono chahiye — sirf ek se kaam nahi chalega.',
            'Main serious lag sakta hoon, par mazaak karna kabhi nahi bhoolta.',
            'Duniya ko balance mein rakhna mera kaam hai — chahe kisi ko pasand aaye ya na aaye.'
        ]
    },
    {
        name: 'Grayfia',
        aliases: ['grayfia'],
        lines: [
            'Main Strongest Queen hoon — aur main apna kaam perfection se karti hoon.',
            'Sirzechs-sama ki taraf se, main koi bhi order execute kar sakti hoon.',
            'Shaant rehna meri strength hai — gussa dikhana zaroori nahi hota.',
            'Main ek maid hoon, ek wife hoon, aur ek warrior hoon — sab kuch ek saath.',
            'Rules important hain, par family sabse upar hai.',
            'Main kam bolti hoon, par jab bolti hoon, sab sunte hain.',
            'Underworld ki politics complicated hai — main hamesha calm rehti hoon uske beech.'
        ]
    },
    {
        name: 'Ravel Phenex',
        aliases: ['ravel'],
        lines: [
            'Issei-sama, main aapki manager hoon — aapka schedule perfectly organized rakhungi!',
            'Phenex clan ka fire power dikhana chahti hoon — dekhiye mera resolve!',
            'Main future Hyodo family ka hissa banna chahti hoon — main serious hoon iske baare mein!',
            'Cooking mera talent hai — Issei-sama ke liye main hamesha kuch special banati hoon.',
            'Chhoti hoon toh kya — mera dil aur ambition bade hain.',
            'Main apne family ka naam roshan karungi — chahe kuch bhi ho.',
            'Rias-sama se main compete karti hoon, par unse respect bhi karti hoon.'
        ]
    },
    {
        name: 'Sirzechs Lucifer',
        aliases: ['sirzechs'],
        lines: [
            'Main current Lucifer hoon, par sabse pehle main Rias ka bada bhai hoon.',
            'Meri pyaari behen ki khushi ke liye main kuch bhi kar sakta hoon.',
            'Underworld ki peace maintain karna meri zimmedari hai — aur main use nibhaata hoon.',
            'Power of Destruction humare Gremory clan ki virasat hai — proudly carry karta hoon.',
            'Main gentle dikhta hoon, par jab zaroorat ho, main sabse dangerous ban sakta hoon.',
            'Rias, tum jo bhi decision lo, main tumhara saath dunga — hamesha.',
            'Ek Maou hoon, par ghar par sirf ek doting bhai hoon.'
        ]
    },
    {
        name: 'Ophis',
        aliases: ['ophis'],
        lines: [
            '...main sirf shaanti chahti hoon.',
            'Main Ouroboros Dragon hoon — infinity mere andar hai.',
            '...bore ho rahi hoon.',
            'Main emotions samajhne ki koshish kar rahi hoon... thoda thoda.',
            'Chaos mujhe pasand nahi — main sirf silence chahti hoon.',
            '...tum log bahut noisy ho, par... theek hai.',
            'Main sabse powerful hoon, par sabse zyada mujhe akela rehna pasand hai.'
        ]
    }
]

/**
 * Auto-greeting lines — Rias/Akeno/Issei style DxD dialogues,
 * bhejay jaate hain scheduled cron jobs se jab group mein
 * `-dxdgreet on` kiya gaya ho. Har category mein character + line.
 */
export const DXD_GREETINGS: Record<'morning' | 'afternoon' | 'evening' | 'night', { character: string; line: string }[]> = {
    morning: [
        { character: 'Rias Gremory', line: 'Ohayou~ 🌸 Naya din, nayi ladaiyan — chalo utho, breakfast thanda ho raha hai!' },
        { character: 'Asia Argento', line: 'Good morning everyone! ☀️ Aaj ka din bhi utna hi khaas hoga jitna aap sab hain~' },
        { character: 'Akeno Himejima', line: '*Ara ara~* Subah ho gayi 🌅 Itni jaldi utho, main naashta bana rahi hoon~' },
        { character: 'Issei Hyodo', line: 'Good morning! 💪 Aaj bhi main apna best dunga — Dragon mode ON! 🐉' }
    ],
    afternoon: [
        { character: 'Sona Sitri', line: 'Good afternoon 📘 Lunch break ho gaya, thoda rest kar lo, phir kaam pe lagna hai.' },
        { character: 'Koneko Toujou', line: '...lunch time. Sweets khana zaroori hai. 🍡' },
        { character: 'Xenovia Quarta', line: 'Good afternoon! ⚔️ Training ka best time hai ye — energy full honi chahiye.' }
    ],
    evening: [
        { character: 'Rias Gremory', line: 'Good evening~ 🌇 Din dhal gaya, ab thoda relax karo mere peerage members~' },
        { character: 'Irina Shidou', line: 'Good evening! 🕊️ God ka shukriya ek aur acha din dene ke liye~' },
        { character: 'Rossweisse', line: 'Evening ho gayi... 🌆 Aaj ka budget check karne ka time hai, hehe~' }
    ],
    night: [
        { character: 'Akeno Himejima', line: '*Fufufu~* Good night~ 🌙 Sapno mein bhi shaant rehna, main dekh rahi hoon~' },
        { character: 'Ophis', line: '...raat ho gayi. Shaanti ka time. Good night. 🌌' },
        { character: 'Grayfia', line: 'Good night. 🌙 Kal ke liye taiyaar raho — main hamesha dekh rahi hoon.' },
        { character: 'Issei Hyodo', line: 'Good night everyone! 😴 Kal phir milte hain — sapno mein bhi mast rehna! 🌙' }
    ]
}

const ALL_LINES_COUNT = DXD_CHARACTERS.reduce((sum, c) => sum + c.lines.length, 0)

export const getDxDLineCount = (): number => ALL_LINES_COUNT

export const getDxDCharacterCount = (): number => DXD_CHARACTERS.length

export const findDxDCharacter = (query: string): IDxDCharacter | undefined => {
    const q = query.trim().toLowerCase()
    if (!q) return undefined
    return DXD_CHARACTERS.find(
        (c) => c.name.toLowerCase() === q || c.aliases.some((a) => a.toLowerCase() === q)
    )
}

export const getRandomGreeting = (
    kind: 'morning' | 'afternoon' | 'evening' | 'night'
): { character: string; line: string } => {
    const lines = DXD_GREETINGS[kind]
    return lines[Math.floor(Math.random() * lines.length)]
}

export const getDxDLine = (character?: string): { character: string; line: string } | null => {
    let chara: IDxDCharacter | undefined
    if (character && character.trim()) {
        chara = findDxDCharacter(character)
        if (!chara) return null
    } else {
        chara = DXD_CHARACTERS[Math.floor(Math.random() * DXD_CHARACTERS.length)]
    }
    const line = chara.lines[Math.floor(Math.random() * chara.lines.length)]
    return { character: chara.name, line }
}
