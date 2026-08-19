"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.UserSchema = exports.LoanData = exports.Pokemon = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class Pokemon {
}
exports.Pokemon = Pokemon;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Pokemon.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Pokemon.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Pokemon.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Pokemon.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'common' }),
    __metadata("design:type", String)
], Pokemon.prototype, "rarity", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Pokemon.prototype, "hp", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Pokemon.prototype, "maxHp", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Pokemon.prototype, "status", void 0);
let Gallery = class Gallery {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Object)
], Gallery.prototype, "mal_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Gallery.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Gallery.prototype, "images", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Gallery.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], Gallery.prototype, "nicknames", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Gallery.prototype, "about", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Gallery.prototype, "favorites", void 0);
Gallery = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], Gallery);
class Username {
}
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], Username.prototype, "custom", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], Username.prototype, "name", void 0);
class About {
}
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], About.prototype, "custom", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], About.prototype, "bio", void 0);
let PetData = class PetData {
};
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], PetData.prototype, "active", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], PetData.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], PetData.prototype, "animal", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 100 }),
    __metadata("design:type", Number)
], PetData.prototype, "hunger", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 100 }),
    __metadata("design:type", Number)
], PetData.prototype, "happiness", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 1 }),
    __metadata("design:type", Number)
], PetData.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], PetData.prototype, "exp", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], PetData.prototype, "lastFed", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], PetData.prototype, "lastPlayed", void 0);
PetData = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], PetData);
let Haigusha = class Haigusha {
};
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], Haigusha.prototype, "married", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true, default: () => ({}) }),
    __metadata("design:type", Object)
], Haigusha.prototype, "data", void 0);
Haigusha = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], Haigusha);
let LoanData = class LoanData {
};
exports.LoanData = LoanData;
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], LoanData.prototype, "active", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "principal", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "totalRepay", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "remaining", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "emiAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 5 }),
    __metadata("design:type", Number)
], LoanData.prototype, "totalEmis", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "emisPaid", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "nextEmiAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "takenAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], LoanData.prototype, "penaltyCount", void 0);
exports.LoanData = LoanData = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], LoanData);
let UserSchema = class UserSchema {
};
exports.UserSchema = UserSchema;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "jid", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "experience", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "banned", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 1 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "tag", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "wallet", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "bank", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "quizWins", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Haigusha, required: true, default: () => ({ married: false, data: {} }) }),
    __metadata("design:type", Haigusha)
], UserSchema.prototype, "haigusha", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "lastDaily", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "lastRob", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => About, required: true, default: () => ({ custom: false }) }),
    __metadata("design:type", About)
], UserSchema.prototype, "about", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Username, required: true, default: () => ({ custom: false }) }),
    __metadata("design:type", Username)
], UserSchema.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Pokemon, required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "party", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Pokemon, required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "pc", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Gallery, required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "gallery", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "badges", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserSchema.prototype, "partner", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], UserSchema.prototype, "birthday", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "inventory", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => PetData, required: true, default: () => ({
            active: false, name: '', animal: '', hunger: 100, happiness: 100,
            level: 1, exp: 0, lastFed: 0, lastPlayed: 0
        }) }),
    __metadata("design:type", PetData)
], UserSchema.prototype, "pet", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "deck", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "cardCollection", void 0);
__decorate([
    (0, typegoose_1.prop)({
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
    }),
    __metadata("design:type", Object)
], UserSchema.prototype, "cardBattle", void 0);
__decorate([
    (0, typegoose_1.prop)({
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
    }),
    __metadata("design:type", LoanData
    // ── Journey / Trainer Card fields ────────────────────────────────────────
    )
], UserSchema.prototype, "loan", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "journeyStarted", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserSchema.prototype, "trainerName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 7 }) // 7 = Lucas (default)
    ,
    __metadata("design:type", Number)
], UserSchema.prototype, "trainerSprite", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserSchema.prototype, "region", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserSchema.prototype, "regionImage", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], UserSchema.prototype, "gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Object, required: true, default: () => ({}) }),
    __metadata("design:type", Object)
], UserSchema.prototype, "commandUsage", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Object, required: false, default: () => ({}) }),
    __metadata("design:type", Object)
], UserSchema.prototype, "cardMissions", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], UserSchema.prototype, "cardPacks", void 0);
exports.UserSchema = UserSchema = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], UserSchema);
exports.userSchema = (0, typegoose_1.getModelForClass)(UserSchema);
