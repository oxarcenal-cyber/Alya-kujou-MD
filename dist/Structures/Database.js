"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const Database_1 = require("../Database");
const lib_1 = require("../lib");
class Database {
    constructor() {
        // ─── In-memory TTL cache ───────────────────────────────────────────────────
        this._cache = new Map();
        // ──────────────────────────────────────────────────────────────────────────
        this.getUser = async (jid) => {
            const key = `user:${jid}`;
            const cached = this._cacheGet(key);
            if (cached)
                return cached;
            const result = (await this.user.findOne({ jid })) ||
                (await new this.user({ jid, tag: this.utils.generateRandomUniqueTag() }).save());
            this._cacheSet(key, result, 60000); // 60s TTL
            return result;
        };
        this.setExp = async (jid, experience) => {
            experience = experience + Math.floor(Math.random() * 25);
            await this.updateUser(jid, 'experience', 'inc', experience);
        };
        this.updateBanStatus = async (jid, action = 'ban') => {
            await this.updateUser(jid, 'banned', 'set', action === 'ban');
        };
        this.updateUser = async (jid, field, method, update) => {
            await this.getUser(jid);
            const op = method === 'inc' ? '$inc' : '$set';
            await this.user.updateOne({ jid }, { [op]: { [field]: update } });
            this.cacheInvalidate(`user:${jid}`); // stale hone se bachao
        };
        this.getGroup = async (jid) => {
            const key = `group:${jid}`;
            const cached = this._cacheGet(key);
            if (cached)
                return cached;
            const result = (await this.group.findOne({ jid })) || (await new this.group({ jid }).save());
            this._cacheSet(key, result, 120000); // 120s TTL
            return result;
        };
        this.updateGroup = async (jid, field, update) => {
            const x = await this.getGroup(jid);
            x[field] = update;
            await this.group.updateOne({ jid }, { $set: { [field]: update } });
            this.cacheInvalidate(`group:${jid}`); // settings change hone par cache clear karo
        };
        this.setCrystal = async (jid, crystal, field = 'wallet') => {
            await this.updateUser(jid, field, 'inc', crystal);
        };
        // ─── Loan System ──────────────────────────────────────────────────────────
        /** Create a new loan for a user and credit the principal to their wallet */
        this.takeLoan = async (jid, principal, totalRepay, emiAmount, nextEmiAt) => {
            await this.getUser(jid);
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
            });
            // Credit principal to wallet immediately
            await this.setCrystal(jid, principal, 'wallet');
        };
        /** Fetch all users whose loan EMI is due right now */
        this.getDueLoanUsers = async () => {
            return await this.user.find({
                'loan.active': true,
                'loan.nextEmiAt': { $lte: Date.now() }
            });
        };
        /** After a successful EMI deduction — update remaining, paid count, next due time */
        this.updateLoanAfterEmi = async (jid, newRemaining, emisPaid, penaltyCount) => {
            const cleared = newRemaining <= 0;
            await this.user.updateOne({ jid }, {
                $set: {
                    'loan.remaining': Math.max(0, newRemaining),
                    'loan.emisPaid': emisPaid,
                    'loan.penaltyCount': penaltyCount,
                    'loan.active': !cleared,
                    'loan.nextEmiAt': cleared ? 0 : Date.now() + 5 * 60 * 60 * 1000
                }
            });
        };
        /** After a penalty hit — update remaining and penalty count, push next EMI window */
        this.updateLoanAfterPenalty = async (jid, newRemaining, penaltyCount) => {
            await this.user.updateOne({ jid }, {
                $set: {
                    'loan.remaining': newRemaining,
                    'loan.penaltyCount': penaltyCount,
                    // Keep nextEmiAt as-is so cron retries next cycle; no free extension
                    'loan.nextEmiAt': Date.now() + 5 * 60 * 60 * 1000
                }
            });
        };
        /** Manual early repayment — reduce remaining; clear loan if fully paid */
        this.updateLoanRemaining = async (jid, newRemaining, cleared) => {
            await this.user.updateOne({ jid }, {
                $set: {
                    'loan.remaining': Math.max(0, newRemaining),
                    'loan.active': !cleared,
                    'loan.nextEmiAt': cleared ? 0 : undefined // keep existing schedule
                }
            });
        };
        this.getSession = async (sessionId) => await this.session.findOne({ sessionId });
        this.saveNewSession = async (sessionId) => {
            await new this.session({ sessionId }).save();
        };
        this.updateSession = async (sessionId, session) => {
            await this.session.updateOne({ sessionId }, { $set: { session } });
        };
        this.removeSession = async (sessionId) => {
            await this.session.deleteOne({ sessionId });
        };
        this.getContacts = async () => {
            let result = await this.contact.findOne({ ID: 'contacts' });
            if (!result)
                result = await new this.contact({ ID: 'contacts' }).save();
            return result.data;
        };
        this.getDisabledCommands = async () => {
            const key = 'disabledCommands';
            const cached = this._cacheGet(key);
            if (cached)
                return cached;
            let result = await this.disabledCommands.findOne({ title: 'commands' });
            if (!result)
                result = await new this.disabledCommands({ title: 'commands' }).save();
            this._cacheSet(key, result.disabledCommands, 90000); // 90s TTL — rarely changes
            return result.disabledCommands;
        };
        this.updateDisabledCommands = async (update) => {
            await this.getDisabledCommands();
            await this.disabledCommands.updateOne({ title: 'commands' }, { $set: { disabledCommands: update } });
            this.cacheInvalidate('disabledCommands'); // update hone par turant refresh
        };
        this.getFeature = async (feature) => {
            const key = `feature:${feature}`;
            const cached = this._cacheGet(key);
            if (cached)
                return cached;
            const result = (await this.feature.findOne({ feature })) ||
                (await new this.feature({ feature }).save());
            this._cacheSet(key, result, 120000); // 2min TTL — features rarely change
            return result;
        };
        this.updateFeature = async (feature, update) => {
            await this.getFeature(feature);
            await this.feature.updateOne({ feature: feature }, { $set: { state: update } });
            this.cacheInvalidate(`feature:${feature}`); // update hone par turant refresh
        };
        // ─── Gender ───────────────────────────────────────────────────────────────
        this.setGender = async (jid, gender) => {
            await this.getUser(jid);
            await this.user.updateOne({ jid }, { $set: { gender } });
            this.cacheInvalidate(`user:${jid}`);
        };
        // ─── Command Usage Tracking ───────────────────────────────────────────────
        this.trackCommandUsage = async (jid, cmd) => {
            // Fire-and-forget — don't block command execution
            this.user.updateOne({ jid }, { $inc: { [`commandUsage.${cmd}`]: 1 } }).catch(() => { });
        };
        // ─── Feedback ─────────────────────────────────────────────────────────────
        this.saveFeedback = async (senderJid, senderName, type, message) => {
            await new this.feedback({ senderJid, senderName, type, message, status: 'pending', createdAt: Date.now(), note: '' }).save();
        };
        this.getFeedbackList = async (status, page, pageSize) => {
            const query = status ? { status } : {};
            return await this.feedback
                .find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
        };
        this.getFeedbackCount = async (status) => {
            const query = status ? { status } : {};
            return await this.feedback.countDocuments(query);
        };
        this.updateFeedbackStatus = async (id, status, note) => {
            try {
                const update = { $set: { status } };
                if (note)
                    update.$set.note = note;
                const res = await this.feedback.updateOne({ _id: id }, update);
                return (res?.modifiedCount ?? 0) > 0;
            }
            catch {
                return false;
            }
        };
        // ─── Bot Stats (aggregated) ───────────────────────────────────────────────
        this.getBotStats = async () => {
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
            ]);
            const topCommands = topCmdAgg.map((x) => ({ cmd: x._id, count: x.total }));
            return {
                totalUsers,
                maleCount,
                femaleCount,
                unsetCount: totalUsers - maleCount - femaleCount,
                topCommands,
                totalFeedback,
                pendingFeedback
            };
        };
        this.utils = new lib_1.Utils();
        this.user = Database_1.userSchema;
        this.group = Database_1.groupSchema;
        this.contact = Database_1.contactSchema;
        this.session = Database_1.sessionSchema;
        this.disabledCommands = Database_1.disabledCommandsSchema;
        this.feature = Database_1.featureSchema;
        this.feedback = Database_1.feedbackSchema;
    }
    _cacheGet(key) {
        const entry = this._cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expires) {
            this._cache.delete(key);
            return null;
        }
        return entry.data;
    }
    _cacheSet(key, data, ttlMs) {
        this._cache.set(key, { data, expires: Date.now() + ttlMs });
    }
    cacheInvalidate(key) {
        this._cache.delete(key);
    }
}
exports.Database = Database;
