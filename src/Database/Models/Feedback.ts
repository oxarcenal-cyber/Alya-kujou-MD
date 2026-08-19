import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { Document } from 'mongoose'

export type FeedbackType = 'suggestion' | 'bugreport' | 'request' | 'other'
export type FeedbackStatus = 'pending' | 'reviewing' | 'done' | 'rejected'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class FeedbackSchema {
    @prop({ type: String, required: true })
    public senderJid!: string

    @prop({ type: String, required: true, default: 'Unknown' })
    public senderName!: string

    @prop({ type: String, required: true, enum: ['suggestion', 'bugreport', 'request', 'other'] })
    public type!: FeedbackType

    @prop({ type: String, required: true })
    public message!: string

    @prop({ type: String, required: true, default: 'pending', enum: ['pending', 'reviewing', 'done', 'rejected'] })
    public status!: FeedbackStatus

    @prop({ type: Number, required: true, default: () => Date.now() })
    public createdAt!: number

    @prop({ type: String, default: '' })
    public note!: string   // mod can add notes when resolving
}

export type TFeedbackModel = FeedbackSchema & Document

export const feedbackSchema = getModelForClass(FeedbackSchema)
