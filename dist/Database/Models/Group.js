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
exports.groupSchema = exports.GroupSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let GroupSchema = class GroupSchema {
};
exports.GroupSchema = GroupSchema;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'all' }),
    __metadata("design:type", String)
], GroupSchema.prototype, "bot", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, unique: true, required: true }),
    __metadata("design:type", String)
], GroupSchema.prototype, "jid", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "events", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "mods", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "chara", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "nsfw", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "wild", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "welcome", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "casino", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], GroupSchema.prototype, "rules", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "groupChatbot", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "dxdChat", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "dxdGreetings", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'en' }),
    __metadata("design:type", String)
], GroupSchema.prototype, "language", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "autoReact", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'all' }),
    __metadata("design:type", String)
], GroupSchema.prototype, "autoReactMode", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "smashboom", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "autoCute", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Object], required: true, default: [] }),
    __metadata("design:type", Array)
], GroupSchema.prototype, "gymHistory", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "badWords", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], required: true, default: [] }),
    __metadata("design:type", Array)
], GroupSchema.prototype, "badWordsList", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "beastChat", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "newsEnabled", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "birthday", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], GroupSchema.prototype, "studyAi", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'all' }),
    __metadata("design:type", String)
], GroupSchema.prototype, "studyAiMode", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], GroupSchema.prototype, "totalMessages", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Object], required: true, default: [] }),
    __metadata("design:type", Array)
], GroupSchema.prototype, "memberMsgCount", void 0);
exports.GroupSchema = GroupSchema = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], GroupSchema);
exports.groupSchema = (0, typegoose_1.getModelForClass)(GroupSchema);
