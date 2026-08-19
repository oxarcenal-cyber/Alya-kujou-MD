import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { Document } from 'mongoose'
import { ICharacter, ICharacter as WaifuResponse } from '@shineiichijo/marika'


export class Pokemon {
    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: String, required: true })
    public image!: string

    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: Number, required: true })
    public level!: number

    @prop({ type: String, required: true, default: 'common' })
    public rarity!: string

    // Healing state is optional for backwards compatibility with older catches.
    @prop({ type: Number })
    public hp?: number

    @prop({ type: Number })
    public maxHp?: number

    @prop({ type: String })
    public status?: string
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class Gallery implements ICharacter {
    @prop({ required: true })
    public mal_id!: ICharacter['mal_id']

    @prop({ type: String, required: true })
    public url!: string

    @prop({ type: Object, required: true })
    public images!: ICharacter['images']

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: () => [String], required: true, default: [] })
    public nicknames!: string[]

    @prop({ type: String, required: true })
    public about!: string

    @prop({ required: true })
    public favorites!: number
}

class Username {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public name?: string
}

class About {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public bio?: string
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class PetData {
    @prop({ type: Boolean, required: true, default: false })
    public active!: boolean

    @prop({ type: String, default: '' })
    public name!: string

    @prop({ type: String, default: '' })
    public animal!: string  // cat | dog | fox | rabbit | dragon

    @prop({ type: Number, required: true, default: 100 })
    public hunger!: number  // 0–100

    @prop({ type: Number, required: true, default: 100 })
    public happiness!: number  // 0–100

    @prop({ type: Number, required: true, default: 1 })
    public level!: number

    @prop({ type: Number, required: true, default: 0 })
    public exp!: number

    @prop({ type: Number, required: true, default: 0 })
    public lastFed!: number

    @prop({ type: Number, required: true, default: 0 })
    public lastPlayed!: number
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class Haigusha {
    @prop({ type: Boolean, required: true, default: false })
    public married!: boolean

    @prop({ type: Object, required: true, default: () => ({}) })
    public data!: WaifuResponse
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class LoanData {
    @prop({ type: Boolean, required: true, default: false })
    public active!: boolean

    @prop({ type: Number, required: true, default: 0 })
    public principal!: number       // original borrowed amount

    @prop({ type: Number, required: true, default: 0 })
    public totalRepay!: number      // principal + 10% interest

    @prop({ type: Number, required: true, default: 0 })
    public remaining!: number       // amount still left to pay

    @prop({ type: Number, required: true, default: 0 })
    public emiAmount!: number       // per-EMI deduction (totalRepay / 5)

    @prop({ type: Number, required: true, default: 5 })
    public totalEmis!: number       // total EMIs (always 5)

    @prop({ type: Number, required: true, default: 0 })
    public emisPaid!: number        // how many EMIs deducted so far

    @prop({ type: Number, required: true, default: 0 })
    public nextEmiAt!: number       // timestamp when next EMI is due

    @prop({ type: Number, required: true, default: 0 })
    public takenAt!: number         // when loan was taken

    @prop({ type: Number, required: true, default: 0 })
    public penaltyCount!: number    // how many times 20% penalty was applied
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class UserSchema {
    @prop({ type: String, required: true, unique: true })
    public jid!: string

    @prop({ type: Number, required: true, default: 0 })
    public experience!: number

    @prop({ type: Boolean, required: true, default: false })
    public banned!: boolean

    @prop({ type: Number, required: true, default: 1 })
    public level!: number

    @prop({ type: String, required: true })
    public tag!: string
    
    @prop({ type: Number, required: true, default: 0 })
    public wallet!: number

    @prop({ type: Number, required: true, default: 0 })
    public bank!: number

   @prop({ type: Number, required: true, default: 0 })
    public quizWins!: number
 
   @prop({ type: () => Haigusha, required: true, default: () => ({ married: false, data: {} }) })
    public haigusha!: Haigusha

    @prop({ type: Number, required: true, default: 0 })
    public lastDaily!: number
    
    @prop({ type: Number, required: true, default: 0 })
    public lastRob!: number

    @prop({ type: () => About, required: true, default: () => ({ custom: false }) })
    public about!: About

    @prop({ type: () => Username, required: true, default: () => ({ custom: false }) })
    public username!: Username
  
    @prop({ type: () => Pokemon, required: true, default: [] })
    public party!: Pokemon[]

    @prop({ type: () => Pokemon, required: true, default: [] })
    public pc!: Pokemon[]

    @prop({ type: () => Gallery, required: true, default: [] })
    public gallery!: Gallery[]

    @prop({ type: () => [String], required: true, default: [] })
    public badges!: string[]

    @prop({ type: String, default: '' })
    public partner!: string  // jid of married user, empty = single

    @prop({ type: Number, required: true, default: 0 })
    public birthday!: number  // DDMM format e.g. 1504 = 15 April, 0 = not set

    @prop({ type: () => [String], required: true, default: [] })
    public inventory!: string[]  // shop item keys

    @prop({ type: () => PetData, required: true, default: () => ({
        active: false, name: '', animal: '', hunger: 100, happiness: 100,
        level: 1, exp: 0, lastFed: 0, lastPlayed: 0
    }) })
    public pet!: PetData

    @prop({ type: () => [String], required: true, default: [] })
    public deck!: string[]

    @prop({ type: () => [String], required: true, default: [] })
    public cardCollection!: string[]

    /**
     * Persistent card-battle progress. Kept as a mixed object so older users
     * get safe defaults without a database migration.
     */
    @prop({
        type: () => Object,
        required: true,
        default: () => ({
            wins: 0,
            losses: 0,
            rating: 1000,
            streak: 0,
            cardsWon: 0,
            cardsLost: 0,
            protectedCards: [],
            history: []
        })
    })
    public cardBattle!: {
        wins: number
        losses: number
        rating: number
        streak: number
        cardsWon: number
        cardsLost: number
        protectedCards: string[]
        history: {
            opponent: string
            result: 'win' | 'loss' | 'draw'
            mode: string
            card: string
            reward: string
            date: number
        }[]
    }

    @prop({
        type: () => LoanData,
        required: true,
        default: () => ({
            active: false,
            principal: 0,
            totalRepay: 0,
            remaining: 0,
            emiAmount: 0,
            totalEmis: 5,
            emisPaid: 0,
            nextEmiAt: 0,
            takenAt: 0,
            penaltyCount: 0
        })
    })
    public loan!: LoanData

    // ── Journey / Trainer Card fields ────────────────────────────────────────
    @prop({ type: Boolean, required: true, default: false })
    public journeyStarted!: boolean

    @prop({ type: String, default: '' })
    public trainerName!: string

    @prop({ type: Number, required: true, default: 7 })  // 7 = Lucas (default)
    public trainerSprite!: number

    @prop({ type: String, default: '' })
    public region!: string

    @prop({ type: String, default: '' })
    public regionImage!: string   // custom region image URL (user-provided)

    // ── Gender Selection ──────────────────────────────────────────────────────
    @prop({ type: String, default: '' })
    public gender!: string   // 'male' | 'female' | '' (empty = not set)

    // ── Per-user Command Usage Tracking ──────────────────────────────────────
    @prop({ type: () => Object, required: true, default: () => ({}) })
    public commandUsage!: Record<string, number>   // { commandName: usageCount }

    // ── Card Missions (daily reset) ───────────────────────────────────────────
    @prop({ type: () => Object, required: false, default: () => ({}) })
    public cardMissions!: {
        date: string
        missions: { id: string; progress: number; claimed: boolean }[]
    }

    // ── Unopened Card Packs ────────────────────────────────────────────────────
    @prop({ type: () => [String], required: true, default: [] })
    public cardPacks!: string[]

}

export type TUserModel = UserSchema & Document

export const userSchema = getModelForClass(UserSchema)
