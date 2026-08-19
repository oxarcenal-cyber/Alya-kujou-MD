import { Contact } from '@adiwajshing/baileys'
import {
    userSchema,
    groupSchema,
    contactSchema,
    sessionSchema,
    disabledCommandsSchema,
    featureSchema,
    feedbackSchema,
    TCommandModel,
    TGroupModel,
    TFeatureModel,
    TSessionModel,
    TUserModel,
    UserSchema,
    GroupSchema,
    FeedbackStatus
} from '../Database'
import { Utils } from '../lib'

export class Database {
    // ─── In-memory TTL cache ───────────────────────────────────────────────────
    private _cache = new Map<string, { data: unknown; expires: number }>()

    private _cacheGet<T>(key: string): T | null {
        const entry = this._cache.get(key)
        if (!entry) return null
        if (Date.now() > entry.expires) { this._cache.delete(key); return null }
        return entry.data as T
    }

    private _cacheSet(key: string, data: unknown, ttlMs: number): void {
        this._cache.set(key, { data, expires: Date.now() + ttlMs })
    }

    public cacheInvalidate(key: string): void {
        this._cache.delete(key)
    }
    // ──────────────────────────────────────────────────────────────────────────

    public getUser = async (jid: string): Promise<TUserModel> => {
        const key = `user:${jid}`
        const cached = this._cacheGet<TUserModel>(key)
        if (cached) return cached
        const result = (await this.user.findOne({ jid })) ||
            (await new this.user({ jid, tag: this.utils.generateRandomUniqueTag() }).save())
        this._cacheSet(key, result, 60_000) // 60s TTL
        return result
    }

    public setExp = async (jid: string, experience: number): Promise<void> => {
        experience = experience + Math.floor(Math.random() * 25)
        await this.updateUser(jid, 'experience', 'inc', experience)
    }

    public updateBanStatus = async (jid: string, action: 'ban' | 'unban' = 'ban'): Promise<void> => {
        await this.updateUser(jid, 'banned', 'set', action === 'ban')
    }

    public updateUser = async (
        jid: string,
        field: keyof UserSchema,
        method: 'inc' | 'set',
        update: UserSchema[typeof field]
    ): Promise<void> => {
        await this.getUser(jid)
        const op = method === 'inc' ? '$inc' : '$set'
        await this.user.updateOne({ jid }, { [op]: { [field]: update } })
        this.cacheInvalidate(`user:${jid}`) // stale hone se bachao
    }

    public getGroup = async (jid: string): Promise<TGroupModel> => {
        const key = `group:${jid}`
        const cached = this._cacheGet<TGroupModel>(key)
        if (cached) return cached
        const result = (await this.group.findOne({ jid })) || (await new this.group({ jid }).save())
        this._cacheSet(key, result, 120_000) // 120s TTL
        return result
    }

    public updateGroup = async (jid: string, field: keyof GroupSchema, update: boolean | string): Promise<void> => {
        const x = await this.getGroup(jid)
        x[field as 'bot'] = update as string
        await this.group.updateOne({ jid }, { $set: { [field]: update } })
        this.cacheInvalidate(`group:${jid}`) // settings change hone par cache clear karo
    }

    public setCrystal = async (jid: string, crystal: number, field: 'wallet' | 'bank' = 'wallet'): Promise<void> => {
        await this.updateUser(jid, field, 'inc', crystal)
    }

    // ─── Loan System ──────────────────────────────────────────────────────────

    /** Create a new loan for a user and credit the principal to their wallet */
    public takeLoan = async (
        jid: string,
        principal: number,
        totalRepay: number,
        emiAmount: number,
        nextEmiAt: number
    ): Promise<void> => {
        await this.getUser(jid)
        await this.user.updateOne({ jid }, {
            $set: {
                loan: {
                    active: true,
                    principal,
                    totalRepay,
                    remaining: totalRepay,
                    emiAmount,
                    totalEmis: 5,
                    emisPaid: 0,
                    nextEmiAt,
                    takenAt: Date.now(),
                    penaltyCount: 0
                }
            }
        })
        // Credit principal to wallet immediately
        await this.setCrystal(jid, principal, 'wallet')
    }

    /** Fetch all users whose loan EMI is due right now */
    public getDueLoanUsers = async (): Promise<TUserModel[]> => {
        return await this.user.find({
            'loan.active': true,
            'loan.nextEmiAt': { $lte: Date.now() }
        })
    }

    /** After a successful EMI deduction — update remaining, paid count, next due time */
    public updateLoanAfterEmi = async (
        jid: string,
        newRemaining: number,
        emisPaid: number,
        penaltyCount: number
    ): Promise<void> => {
        const cleared = newRemaining <= 0
        await this.user.updateOne({ jid }, {
            $set: {
                'loan.remaining': Math.max(0, newRemaining),
                'loan.emisPaid': emisPaid,
                'loan.penaltyCount': penaltyCount,
                'loan.active': !cleared,
                'loan.nextEmiAt': cleared ? 0 : Date.now() + 5 * 60 * 60 * 1000
            }
        })
    }

    /** After a penalty hit — update remaining and penalty count, push next EMI window */
    public updateLoanAfterPenalty = async (
        jid: string,
        newRemaining: number,
        penaltyCount: number
    ): Promise<void> => {
        await this.user.updateOne({ jid }, {
            $set: {
                'loan.remaining': newRemaining,
                'loan.penaltyCount': penaltyCount,
                // Keep nextEmiAt as-is so cron retries next cycle; no free extension
                'loan.nextEmiAt': Date.now() + 5 * 60 * 60 * 1000
            }
        })
    }

    /** Manual early repayment — reduce remaining; clear loan if fully paid */
    public updateLoanRemaining = async (jid: string, newRemaining: number, cleared: boolean): Promise<void> => {
        await this.user.updateOne({ jid }, {
            $set: {
                'loan.remaining': Math.max(0, newRemaining),
                'loan.active': !cleared,
                'loan.nextEmiAt': cleared ? 0 : undefined  // keep existing schedule
            }
        })
    }

    public getSession = async (sessionId: string): Promise<TSessionModel | null> =>
        await this.session.findOne({ sessionId })

    public saveNewSession = async (sessionId: string): Promise<void> => {
        await new this.session({ sessionId }).save()
    }

    public updateSession = async (sessionId: string, session: string): Promise<void> => {
        await this.session.updateOne({ sessionId }, { $set: { session } })
    }

    public removeSession = async (sessionId: string): Promise<void> => {
        await this.session.deleteOne({ sessionId })
    }

    public getContacts = async (): Promise<Contact[]> => {
        let result = await this.contact.findOne({ ID: 'contacts' })
        if (!result) result = await new this.contact({ ID: 'contacts' }).save()
        return result.data
    }

    public getDisabledCommands = async (): Promise<TCommandModel['disabledCommands']> => {
        const key = 'disabledCommands'
        const cached = this._cacheGet<TCommandModel['disabledCommands']>(key)
        if (cached) return cached
        let result = await this.disabledCommands.findOne({ title: 'commands' })
        if (!result) result = await new this.disabledCommands({ title: 'commands' }).save()
        this._cacheSet(key, result.disabledCommands, 90_000) // 90s TTL — rarely changes
        return result.disabledCommands
    }

    public updateDisabledCommands = async (update: TCommandModel['disabledCommands']): Promise<void> => {
        await this.getDisabledCommands()
        await this.disabledCommands.updateOne({ title: 'commands' }, { $set: { disabledCommands: update } })
        this.cacheInvalidate('disabledCommands') // update hone par turant refresh
    }

    public getFeature = async (feature: string): Promise<TFeatureModel> => {
        const key = `feature:${feature}`
        const cached = this._cacheGet<TFeatureModel>(key)
        if (cached) return cached
        const result = (await this.feature.findOne({ feature })) ||
            (await new this.feature({ feature }).save())
        this._cacheSet(key, result, 120_000) // 2min TTL — features rarely change
        return result
    }

    public updateFeature = async (feature: string, update: boolean): Promise<void> => {
        await this.getFeature(feature)
        await this.feature.updateOne({ feature: feature }, { $set: { state: update } })
        this.cacheInvalidate(`feature:${feature}`) // update hone par turant refresh
    }

    // ─── Gender ───────────────────────────────────────────────────────────────

    public setGender = async (jid: string, gender: 'male' | 'female'): Promise<void> => {
        await this.getUser(jid)
        await this.user.updateOne({ jid }, { $set: { gender } })
        this.cacheInvalidate(`user:${jid}`)
    }

    // ─── Command Usage Tracking ───────────────────────────────────────────────

    public trackCommandUsage = async (jid: string, cmd: string): Promise<void> => {
        // Fire-and-forget — don't block command execution
        this.user.updateOne({ jid }, { $inc: { [`commandUsage.${cmd}`]: 1 } }).catch(() => {})
    }

    // ─── Feedback ─────────────────────────────────────────────────────────────

    public saveFeedback = async (
        senderJid: string,
        senderName: string,
        type: 'suggestion' | 'bugreport' | 'request' | 'other',
        message: string
    ): Promise<void> => {
        await new this.feedback({ senderJid, senderName, type, message, status: 'pending', createdAt: Date.now(), note: '' }).save()
    }

    public getFeedbackList = async (
        status: FeedbackStatus | null,
        page: number,
        pageSize: number
    ): Promise<unknown[]> => {
        const query: Record<string, unknown> = status ? { status } : {}
        return await this.feedback
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
    }

    public getFeedbackCount = async (status: FeedbackStatus | null): Promise<number> => {
        const query: Record<string, unknown> = status ? { status } : {}
        return await this.feedback.countDocuments(query)
    }

    public updateFeedbackStatus = async (
        id: string,
        status: FeedbackStatus,
        note?: string
    ): Promise<boolean> => {
        try {
            const update: Record<string, unknown> = { $set: { status } }
            if (note) (update.$set as Record<string, unknown>).note = note
            const res = await this.feedback.updateOne({ _id: id }, update)
            return (res?.modifiedCount ?? 0) > 0
        } catch {
            return false
        }
    }

    // ─── Bot Stats (aggregated) ───────────────────────────────────────────────

    public getBotStats = async (): Promise<{
        totalUsers: number
        maleCount: number
        femaleCount: number
        unsetCount: number
        topCommands: { cmd: string; count: number }[]
        totalFeedback: number
        pendingFeedback: number
    }> => {
        const [totalUsers, maleCount, femaleCount, totalFeedback, pendingFeedback, topCmdAgg] = await Promise.all([
            this.user.countDocuments(),
            this.user.countDocuments({ gender: 'male' }),
            this.user.countDocuments({ gender: 'female' }),
            this.feedback.countDocuments(),
            this.feedback.countDocuments({ status: 'pending' }),
            // Aggregate top commands across all users
            this.user.aggregate([
                { $project: { commandUsage: { $objectToArray: '$commandUsage' } } },
                { $unwind: '$commandUsage' },
                { $group: { _id: '$commandUsage.k', total: { $sum: '$commandUsage.v' } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ])
        ])

        const topCommands = topCmdAgg.map((x: { _id: string; total: number }) => ({ cmd: x._id, count: x.total }))

        return {
            totalUsers,
            maleCount,
            femaleCount,
            unsetCount: totalUsers - maleCount - femaleCount,
            topCommands,
            totalFeedback,
            pendingFeedback
        }
    }

    private utils = new Utils()

    public user = userSchema

    public group = groupSchema

    public contact = contactSchema

    public session = sessionSchema

    public disabledCommands = disabledCommandsSchema

    public feature = featureSchema

    public feedback = feedbackSchema
}

type valueof<T> = T[keyof T]
