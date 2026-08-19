import { prop, getModelForClass, modelOptions, index } from '@typegoose/typegoose'
import { Document } from 'mongoose'

@modelOptions({ schemaOptions: { collection: 'warnings' } })
@index({ groupJid: 1, userJid: 1 }, { unique: true })
export class WarningSchema {
    @prop({ type: String, required: true })
    public groupJid!: string

    @prop({ type: String, required: true })
    public userJid!: string

    @prop({ type: Number, required: true, default: 0 })
    public count!: number

    @prop({ type: () => [String], required: true, default: [] })
    public reasons!: string[]
}

export type TWarningModel = WarningSchema & Document
export const warningSchema = getModelForClass(WarningSchema)
