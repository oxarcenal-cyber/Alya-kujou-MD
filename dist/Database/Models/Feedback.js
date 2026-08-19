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
exports.feedbackSchema = exports.FeedbackSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let FeedbackSchema = class FeedbackSchema {
};
exports.FeedbackSchema = FeedbackSchema;
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "senderJid", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'Unknown' }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "senderName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, enum: ['suggestion', 'bugreport', 'request', 'other'] }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "message", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, default: 'pending', enum: ['pending', 'reviewing', 'done', 'rejected'] }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, default: () => Date.now() }),
    __metadata("design:type", Number)
], FeedbackSchema.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], FeedbackSchema.prototype, "note", void 0);
exports.FeedbackSchema = FeedbackSchema = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], FeedbackSchema);
exports.feedbackSchema = (0, typegoose_1.getModelForClass)(FeedbackSchema);
